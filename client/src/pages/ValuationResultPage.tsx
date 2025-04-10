import { useState, useEffect } from "react";
import { useLocation, useRoute, Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import ValuationResultOptions from "@/components/ValuationResultOptions";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, HomeIcon, ShieldCheck } from "lucide-react";

// Componente de carga
const LoadingState = () => (
  <div className="flex flex-col items-center justify-center min-h-[400px]">
    <Loader2 className="h-10 w-10 text-blue-600 animate-spin mb-4" />
    <p className="text-gray-600">Cargando tu valoración inmobiliaria...</p>
  </div>
);

// Componente de error
const ErrorState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
    <div className="bg-red-100 text-red-700 p-3 rounded-full mb-4">
      <ShieldCheck className="h-8 w-8" />
    </div>
    <h2 className="text-xl font-bold text-red-700 mb-2">Ha ocurrido un error</h2>
    <p className="text-gray-600 mb-6 max-w-md">{message}</p>
    <Link href="/">
      <a>
        <Button className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Volver a la página principal
        </Button>
      </a>
    </Link>
  </div>
);

const ValuationResultPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [valuationData, setValuationData] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [, params] = useRoute<{ userId: string }>("/valoracion-resultado/:userId");
  
  // Definir interfaces para las respuestas API
  interface UserResponse {
    success: boolean;
    user?: {
      id: number;
      phone: string;
      name: string;
      role: string;
      lastValuation?: string;
      createdAt: string;
    };
    message?: string;
  }

  useEffect(() => {
    const fetchValuationData = async () => {
      // Si no hay userId en los parámetros, intentar obtener usuario de la sesión
      if (!params?.userId) {
        try {
          const response = await fetch('/api/me');
          const data: UserResponse = await response.json();
          
          if (data.success && data.user) {
            setUserData(data.user);
            
            // Si el usuario tiene una valoración, mostrarla
            if (data.user.lastValuation) {
              try {
                const valuation = JSON.parse(data.user.lastValuation);
                setValuationData(valuation);
                setIsLoading(false);
              } catch (e) {
                setError("No se pudo procesar la información de tu valoración");
                setIsLoading(false);
              }
            } else {
              // Si el usuario no tiene valoración, redirigir a la página de valoración
              toast({
                title: "No tienes valoraciones recientes",
                description: "Realiza una valoración primero para ver los resultados",
              });
              navigate("/");
            }
          } else {
            // Si no hay usuario en sesión, redirigir al login
            toast({
              title: "Sesión no iniciada",
              description: "Inicia sesión para ver tus valoraciones",
            });
            navigate("/login");
          }
        } catch (e) {
          setError("No se pudo obtener la información de tu cuenta");
          setIsLoading(false);
        }
      } else {
        // Si hay userId en los parámetros, obtener datos del usuario específico
        try {
          const userId = Number(params.userId);
          const response = await fetch(`/api/users/${userId}`);
          const data: UserResponse = await response.json();
          
          if (data.success && data.user) {
            setUserData(data.user);
            
            if (data.user.lastValuation) {
              try {
                const valuation = JSON.parse(data.user.lastValuation);
                setValuationData(valuation);
                setIsLoading(false);
              } catch (e) {
                setError("No se pudo procesar la información de la valoración");
                setIsLoading(false);
              }
            } else {
              setError("Este usuario no tiene valoraciones recientes");
              setIsLoading(false);
            }
          } else {
            setError("No se encontró el usuario solicitado");
            setIsLoading(false);
          }
        } catch (e) {
          setError("Error al obtener los datos de valoración");
          setIsLoading(false);
        }
      }
    };
    
    fetchValuationData();
  }, [params, navigate, toast]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-blue-50 py-10">
      <div className="container px-4">
        <div className="max-w-6xl mx-auto">
          {/* Barra de navegación sencilla */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <Link href="/" className="flex items-center gap-1 hover:text-blue-600 transition-colors">
              <HomeIcon className="h-4 w-4" />
              <span>Inicio</span>
            </Link>
            <span>/</span>
            <span className="text-blue-600 font-medium">Resultado de valoración</span>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold text-blue-800 mb-4">
            Resultado de tu valoración inmobiliaria
          </h1>
          
          <p className="text-gray-600 mb-8 max-w-3xl">
            Basado en los datos proporcionados y en nuestro análisis del mercado inmobiliario actual en Murcia,
            hemos calculado una estimación precisa del valor de tu propiedad.
          </p>
          
          {isLoading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState message={error} />
          ) : (
            <ValuationResultOptions 
              valuationData={valuationData} 
              userId={userData.id} 
            />
          )}
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-10 text-sm text-blue-700">
            <div className="flex items-start gap-2">
              <ShieldCheck className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium mb-1">Valoración confidencial y personalizada</p>
                <p>
                  Esta valoración está basada en datos específicos del mercado inmobiliario de Murcia 
                  y es exclusiva para tu propiedad. La información proporcionada es confidencial.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ValuationResultPage;