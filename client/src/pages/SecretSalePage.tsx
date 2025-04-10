import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocation } from "wouter";
import { LockIcon, EyeOffIcon, HomeIcon, MapPinIcon, EuroIcon, SquareIcon } from "lucide-react";

// Tipo ficticio para el ejemplo
interface SecretProperty {
  id: number;
  title: string;
  location: string;
  price: number;
  discount: number;
  size: number;
  description: string;
  isExclusive: boolean;
}

const SecretSalePage = () => {
  const { toast } = useToast();
  const [location, setLocation] = useLocation();
  
  // Apply SEO metadata
  document.title = "Ventas Secretas | Promurcia Inmobiliarios";
  
  // Comprueba si el usuario está autenticado
  const { data: user, isLoading: isLoadingUser, isError: userError } = useQuery({
    queryKey: ['/api/me'],
    retry: false,
  });
  
  // Si el usuario no está autenticado, redirige al login
  useEffect(() => {
    if (!isLoadingUser && userError) {
      toast({
        title: "Acceso restringido",
        description: "Debes iniciar sesión para ver las ventas secretas",
        variant: "destructive",
      });
      setLocation("/login");
    }
  }, [isLoadingUser, userError, setLocation, toast]);
  
  // Obtenemos las propiedades con ventas secretas
  const { data: properties, isLoading } = useQuery<SecretProperty[]>({
    queryKey: ['/api/secret-properties'],
    enabled: !!user, // Solo se ejecuta si el usuario está autenticado
  });
  
  // Mock properties para el ejemplo
  const mockProperties: SecretProperty[] = [
    {
      id: 1,
      title: "Villa Premium en Vista Alegre",
      location: "Vista Alegre, Murcia",
      price: 350000,
      discount: 15,
      size: 180,
      description: "Propiedad de alto nivel disponible solo para inversores seleccionados. Identidad del propietario protegida por nuestro protocolo de confidencialidad máxima.",
      isExclusive: true
    },
    {
      id: 2,
      title: "Ático Exclusivo en La Flota",
      location: "La Flota, Murcia",
      price: 275000,
      discount: 10,
      size: 120,
      description: "Oportunidad única presentada únicamente a nuestra cartera privada de inversores. Transacción con total discreción y garantía de anonimato.",
      isExclusive: true
    },
    {
      id: 3,
      title: "Residencia Premium en Santa María de Gracia",
      location: "Santa María de Gracia, Murcia",
      price: 320000,
      discount: 12,
      size: 160,
      description: "Inmueble selecto en venta confidencial. Sin exposición a portales inmobiliarios, presentación exclusiva a inversores cualificados bajo estricto acuerdo de confidencialidad.",
      isExclusive: true
    }
  ];
  
  // En una implementación real, usaríamos los datos de la API
  // Aquí usamos los mock para ilustración
  const secretProperties = properties || mockProperties;
  
  // Función para contactar sobre una propiedad confidencial
  const handleContactProperty = (propertyId: number) => {
    toast({
      title: "Solicitud de acceso confidencial enviada",
      description: "Un asesor de operaciones confidenciales te contactará para concertar una reunión en el lugar que prefieras, sin necesidad de visitar nuestra oficina. Tu interés está protegido por nuestro protocolo de confidencialidad.",
    });
  };
  
  if (isLoadingUser) {
    return (
      <div className="min-h-screen py-16 flex items-center justify-center bg-gray-50">
        <div className="container px-4">
          <Card>
            <CardHeader className="space-y-1">
              <Skeleton className="h-8 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen py-16 bg-gray-50">
      <div className="container px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2 text-primary-dark">
            <LockIcon className="inline-block mr-2 mb-1" size={24} />
            Venta confidencial de propiedades premium
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            En Promurcia te ofrecemos dos modalidades de comercialización. Elige la opción que mejor proteja tus intereses y garantice la discreción que deseas.
          </p>
        </div>

        {/* Banners de selección de tipo de venta */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Opción de Venta Confidencial */}
          <div className="bg-blue-600 text-white rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-3 flex items-center">
              <LockIcon className="mr-2" size={20} />
              Venta Confidencial
            </h2>
            <p className="mb-4">
              Máxima discreción, sin presencia en internet,
              presentación exclusiva a inversores privados y cartera selecta de clientes premium.
            </p>
            <ul className="mb-6 space-y-2">
              <li className="flex items-start">
                <span className="text-blue-200 mr-2">✓</span> Garantía de secreto absoluto
              </li>
              <li className="flex items-start">
                <span className="text-blue-200 mr-2">✓</span> Solo inversores privados seleccionados
              </li>
              <li className="flex items-start">
                <span className="text-blue-200 mr-2">✓</span> Identidad del propietario protegida
              </li>
              <li className="flex items-start">
                <span className="text-blue-200 mr-2">✓</span> Reuniones en su domicilio o lugar de elección
              </li>
            </ul>
            <Button className="w-full bg-white text-blue-600 hover:bg-blue-50">
              Quiero vender con discreción total
            </Button>
          </div>
          
          {/* Opción de Venta Pública */}
          <div className="bg-green-600 text-white rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-3 flex items-center">
              <HomeIcon className="mr-2" size={20} />
              Venta Pública
            </h2>
            <p className="mb-4">
              Maximiza la visibilidad de tu propiedad en todos los portales inmobiliarios y redes sociales.
              Ideal para llegar al mayor número posible de compradores potenciales.
            </p>
            <ul className="mb-6 space-y-2">
              <li className="flex items-start">
                <span className="text-green-200 mr-2">✓</span> Publicación en principales portales
              </li>
              <li className="flex items-start">
                <span className="text-green-200 mr-2">✓</span> Fotografía profesional y tour virtual
              </li>
              <li className="flex items-start">
                <span className="text-green-200 mr-2">✓</span> Promoción activa en redes sociales
              </li>
            </ul>
            <Button className="w-full bg-white text-green-600 hover:bg-green-50">
              Quiero vender con máxima difusión
            </Button>
          </div>
        </div>
        
        {/* <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold mb-2 text-primary-dark">
            Oportunidades Exclusivas y Confidenciales
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Estas propiedades se comercializan con absoluta discreción, garantizando secreto total para el propietario.
            Presentadas exclusivamente a inversores seleccionados y clientes de confianza de nuestra cartera.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {secretProperties.map((property) => (
            <Card key={property.id} className="overflow-hidden h-full flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center mb-1">
                  <CardTitle className="text-lg font-bold">
                    {property.title}
                  </CardTitle>
                  {property.isExclusive && (
                    <Badge className="bg-primary text-white">
                      <EyeOffIcon size={12} className="mr-1" /> Confidencial
                    </Badge>
                  )}
                </div>
                <CardDescription className="flex items-center">
                  <MapPinIcon size={14} className="mr-1" />
                  {property.location}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-4 flex-grow">
                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="flex items-center">
                    <EuroIcon size={14} className="mr-1 text-primary" />
                    <span className="font-semibold">
                      {new Intl.NumberFormat('es-ES').format(property.price)} €
                    </span>
                    {property.discount > 0 && (
                      <Badge variant="outline" className="ml-2 text-xs">
                        {property.discount}% dto.
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center">
                    <SquareIcon size={14} className="mr-1 text-primary" />
                    <span>{property.size} m²</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  {property.description}
                </p>
              </CardContent>
              <CardFooter className="pt-0">
                <Button 
                  className="w-full"
                  onClick={() => handleContactProperty(property.id)}
                >
                  Acceso confidencial <LockIcon size={14} className="ml-1" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div> */}
        
        <div className="mt-12 text-center">
          <div className="max-w-2xl mx-auto p-6 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-primary-dark">
              ¿Cómo garantizamos el máximo secreto y discreción?
            </h3>
            <p className="text-gray-700 mb-4">
              Nuestra modalidad de venta confidencial te garantiza un proceso completamente discreto. Tu propiedad nunca aparecerá en 
              portales inmobiliarios ni publicidad. Ofrecemos absoluto secreto, presentando tu inmueble únicamente a inversores privados 
              seleccionados y clientes de confianza de nuestra cartera. Nunca tendrás que acudir a nuestra oficina, concertaremos 
              reuniones en tu propio domicilio, en el inmueble o en cualquier lugar social que consideres oportuno, manteniendo 
              en todo momento tu identidad en total anonimato.
            </p>
            {/*<div className="flex justify-center">
              <Button variant="outline" className="mr-2">
                <HomeIcon size={16} className="mr-1" />
                Solicitar valoración gratuita
              </Button>
              <Button>
                Hablar con un asesor de operaciones confidenciales
              </Button>
            </div>*/}
          </div>
        </div>
      </div>
      <footer className="bg-gray-50 py-6 text-center">
        <p className="text-sm text-gray-600">© 2025 Promurcia Inmobiliarios</p>
        <div className="flex justify-center mt-2 space-x-4 text-xs">
          <a href="/privacidad" className="text-blue-600 hover:underline">Política de Privacidad</a>
          <a href="/terminos" className="text-blue-600 hover:underline">Términos y Condiciones</a>
          <a href="/cookies" className="text-blue-600 hover:underline">Política de Cookies</a>
        </div>
      </footer>
    </div>
  );
};

export default SecretSalePage;