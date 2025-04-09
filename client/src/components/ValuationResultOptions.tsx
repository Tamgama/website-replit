import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { CalendarIcon, HomeIcon, PhoneIcon, CheckCircleIcon, AlertCircleIcon, ArrowRightIcon } from "lucide-react";

// Tipo para la valoración
interface ValuationData {
  address?: string;
  location?: string;
  size?: string;
  rooms?: string;
  condition?: string;
  estimatedValue?: string;
  propertyType?: string;
  userId?: number;
}

// Opciones disponibles para el propietario
type Option = "sell" | "confidential" | "later" | null;

interface ValuationResultOptionsProps {
  valuationData: ValuationData;
  userId: number;
}

const ValuationResultOptions = ({ valuationData, userId }: ValuationResultOptionsProps) => {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [selectedOption, setSelectedOption] = useState<Option>(null);
  const [isSending, setIsSending] = useState(false);

  // Formato para mostrar el precio
  const formatPrice = (value?: string) => {
    if (!value) return "N/A";
    return new Intl.NumberFormat('es-ES', { 
      style: 'currency', 
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Number(value));
  };

  // Envía la decisión del propietario a la agencia
  const sendDecisionToAgency = async (option: Option) => {
    if (!option) return;
    
    setIsSending(true);
    
    try {
      // Construir mensaje según la opción
      let message = "";
      let action = "";
      
      switch (option) {
        case "sell":
          message = "Quiero vender mi propiedad al precio de mercado";
          action = "venta_normal";
          break;
        case "confidential":
          message = "Me interesa una venta confidencial para mi propiedad";
          action = "venta_confidencial";
          break;
        case "later":
          message = "Quiero pensarlo, contactarme más adelante";
          action = "contactar_despues";
          break;
      }
      
      // Enviar datos al servidor
      const response = await fetch('/api/property-decision', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          valuationData,
          option,
          message,
          action,
          timestamp: new Date().toISOString()
        }),
      });
      
      if (!response.ok) {
        throw new Error('Error al enviar tu decisión');
      }
      
      // Mostrar mensaje de éxito según la opción
      let successTitle = "";
      let successDescription = "";
      
      switch (option) {
        case "sell":
          successTitle = "¡Excelente decisión!";
          successDescription = "Un agente se pondrá en contacto contigo en las próximas 2 horas para iniciar el proceso de venta.";
          break;
        case "confidential":
          successTitle = "Solicitud de venta confidencial recibida";
          successDescription = "Un asesor especializado en operaciones discretas te contactará para explicarte nuestro proceso de venta confidencial.";
          break;
        case "later":
          successTitle = "Gracias por tu interés";
          successDescription = "Respetamos tu decisión. Puedes volver a contactarnos cuando lo consideres oportuno.";
          break;
      }
      
      toast({
        title: successTitle,
        description: successDescription,
      });
      
      // Redirigir según opción
      if (option === "confidential") {
        navigate("/secret-sale");
      }
      
    } catch (error) {
      toast({
        title: "Error al procesar tu solicitud",
        description: "Por favor, inténtalo de nuevo o contáctanos por teléfono.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
      {/* Tarjeta de valoración */}
      <Card className="border-2 border-blue-200 shadow-lg">
        <CardHeader className="bg-blue-50 border-b border-blue-200">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl text-blue-700 flex items-center gap-2">
              <HomeIcon className="h-5 w-5" />
              Tu valoración inmobiliaria
            </CardTitle>
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block animate-pulse"></span>
              Gratis
            </span>
          </div>
          <CardDescription>
            Basado en datos reales del mercado inmobiliario en Murcia
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <h3 className="font-medium text-lg">{valuationData.address || valuationData.location || "Tu propiedad"}</h3>
              <div className="flex flex-wrap gap-x-4 gap-y-2 mt-1 text-sm text-gray-600">
                {valuationData.propertyType && (
                  <span>{valuationData.propertyType}</span>
                )}
                {valuationData.size && (
                  <span>{valuationData.size} m²</span>
                )}
                {valuationData.rooms && (
                  <span>{valuationData.rooms} habitaciones</span>
                )}
                {valuationData.condition && (
                  <span>Estado: {valuationData.condition}</span>
                )}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">Valor estimado de mercado</div>
              <div className="text-3xl font-bold text-blue-700">
                {formatPrice(valuationData.estimatedValue)}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Confianza: <span className="text-green-600 font-medium">Alta</span>
              </div>
            </div>
            
            <div className="flex items-center text-sm text-gray-600 justify-center">
              <CalendarIcon className="h-4 w-4 mr-1" />
              <span>Valoración actualizada: {new Date().toLocaleDateString('es-ES')}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Tarjeta de opciones para el propietario */}
      <Card className="border-2 border-blue-200 shadow-lg">
        <CardHeader className="bg-blue-50 border-b border-blue-200">
          <CardTitle className="text-xl text-blue-700">¿Qué deseas hacer?</CardTitle>
          <CardDescription>
            Selecciona una opción para continuar con el proceso
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div 
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                selectedOption === "sell" 
                  ? "border-blue-500 bg-blue-50" 
                  : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
              }`}
              onClick={() => setSelectedOption("sell")}
            >
              <div className="flex items-start gap-3">
                <div className={`rounded-full p-2 ${selectedOption === "sell" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"}`}>
                  <HomeIcon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium text-blue-700">Quiero vender mi propiedad</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Me interesa vender al precio de mercado con asesoramiento profesional
                  </p>
                </div>
                {selectedOption === "sell" && (
                  <CheckCircleIcon className="h-5 w-5 text-blue-600 ml-auto" />
                )}
              </div>
            </div>
            
            <div 
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                selectedOption === "confidential" 
                  ? "border-purple-500 bg-purple-50" 
                  : "border-gray-200 hover:border-purple-300 hover:bg-purple-50/50"
              }`}
              onClick={() => setSelectedOption("confidential")}
            >
              <div className="flex items-start gap-3">
                <div className={`rounded-full p-2 ${selectedOption === "confidential" ? "bg-purple-100 text-purple-600" : "bg-gray-100 text-gray-500"}`}>
                  <AlertCircleIcon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium text-purple-700">Venta confidencial</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Prefiero un proceso discreto sin publicidad, solo para inversores seleccionados
                  </p>
                </div>
                {selectedOption === "confidential" && (
                  <CheckCircleIcon className="h-5 w-5 text-purple-600 ml-auto" />
                )}
              </div>
            </div>
            
            <div 
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                selectedOption === "later" 
                  ? "border-gray-500 bg-gray-50" 
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50/50"
              }`}
              onClick={() => setSelectedOption("later")}
            >
              <div className="flex items-start gap-3">
                <div className={`rounded-full p-2 ${selectedOption === "later" ? "bg-gray-200 text-gray-600" : "bg-gray-100 text-gray-500"}`}>
                  <CalendarIcon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-700">Lo pensaré más adelante</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Quiero analizar la información y decidir en otro momento
                  </p>
                </div>
                {selectedOption === "later" && (
                  <CheckCircleIcon className="h-5 w-5 text-gray-600 ml-auto" />
                )}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4">
          <div className="text-sm text-gray-600 flex items-center gap-1">
            <PhoneIcon className="h-4 w-4" />
            <span>¿Dudas? Llámanos: 622 337 098</span>
          </div>
          <Button 
            disabled={!selectedOption || isSending}
            onClick={() => sendDecisionToAgency(selectedOption)}
            className="flex items-center gap-1"
          >
            {isSending ? "Enviando..." : "Continuar"}
            {!isSending && <ArrowRightIcon className="h-4 w-4" />}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ValuationResultOptions;