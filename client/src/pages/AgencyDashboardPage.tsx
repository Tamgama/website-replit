import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "@/components/ui/card";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Iconos
import { HomeIcon, UserIcon, PhoneIcon, ClockIcon, CheckIcon, AlertCircleIcon } from "lucide-react";

// Tipo para las valoraciones
interface Valuation {
  userId: number;
  phone: string;
  name: string;
  role: string;
  lastValuation: string;
  createdAt: string;
}

// Tipo para las propiedades
interface Property {
  id: number;
  title: string;
  address: string;
  location: string;
  size: number;
  price: number;
  sale_type: string;
  status: string;
  created_at: string;
  owner: {
    id: number;
    phone: string;
    name: string;
  };
}

export default function AgencyDashboardPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [wsConnected, setWsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  
  // Verificar autenticación y rol
  useEffect(() => {
    // En una aplicación real, verificaríamos el rol desde una sesión o token
    // Para esta demo, asumimos que hay un usuario en localStorage
    const storedUser = localStorage.getItem("user");
    
    if (!storedUser) {
      // Redirigir a login si no hay usuario
      setLocation("/login");
      return;
    }
    
    const user = JSON.parse(storedUser);
    
    // Verificar si el usuario es una agencia
    if (user.role !== "agencia") {
      // Redirigir a la página principal si no es agencia
      setLocation("/");
    }
  }, [setLocation]);
  
  // Configurar la conexión WebSocket
  useEffect(() => {
    // Crear conexión WebSocket
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;
    
    // Manejar eventos de WebSocket
    ws.onopen = () => {
      console.log("WebSocket conectado");
      setWsConnected(true);
      toast({
        title: "Conexión en tiempo real activa",
        description: "Recibirás notificaciones de nuevas valoraciones y propiedades.",
      });
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("WebSocket mensaje recibido:", data);
        
        // Manejar diferentes tipos de mensajes
        switch (data.type) {
          case 'welcome':
            // Mensaje de bienvenida, no requiere acción
            break;
            
          case 'new_valuation':
            // Invalidar la caché de valoraciones para refrescar datos
            queryClient.invalidateQueries({ queryKey: ['/api/valuations'] });
            toast({
              title: "Nueva valoración recibida",
              description: `${data.user?.name || 'Un usuario'} ha solicitado una valoración.`,
            });
            break;
            
          case 'new_property':
            // Invalidar la caché de propiedades para refrescar datos
            queryClient.invalidateQueries({ queryKey: ['/api/properties'] });
            toast({
              title: "Nueva propiedad registrada",
              description: `Se ha añadido una nueva propiedad en ${data.property?.location || 'la plataforma'}.`,
            });
            break;
            
          case 'property_updated':
            // Invalidar la caché de propiedades para refrescar datos
            queryClient.invalidateQueries({ queryKey: ['/api/properties'] });
            toast({
              title: "Propiedad actualizada",
              description: `Se ha actualizado el estado de una propiedad.`,
            });
            break;
        }
      } catch (error) {
        console.error("Error al procesar mensaje WebSocket:", error);
      }
    };
    
    ws.onerror = (error) => {
      console.error("Error de WebSocket:", error);
      setWsConnected(false);
    };
    
    ws.onclose = () => {
      console.log("WebSocket desconectado");
      setWsConnected(false);
    };
    
    // Limpiar al desmontar
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [toast, queryClient]);
  
  // Definición de tipos para las respuestas de la API
  interface ValuationsResponse {
    success: boolean;
    valuations: Valuation[];
  }
  
  interface PropertiesResponse {
    success: boolean;
    properties: Property[];
  }

  // Obtener las valoraciones
  const { 
    data: valuationsData,
    isLoading: isLoadingValuations
  } = useQuery<ValuationsResponse>({
    queryKey: ['/api/valuations'],
    retry: false
  });
  
  // Obtener las propiedades
  const { 
    data: propertiesData,
    isLoading: isLoadingProperties
  } = useQuery<PropertiesResponse>({
    queryKey: ['/api/properties'],
    retry: false
  });
  
  // Función para formatear la fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Función para obtener la clase del estado
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'en_proceso':
        return 'bg-blue-100 text-blue-800';
      case 'vendida':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Función para obtener el color de la etiqueta del tipo de venta
  const getSaleTypeClass = (saleType: string) => {
    return saleType === 'secreta' 
      ? 'bg-purple-100 text-purple-800' 
      : 'bg-blue-100 text-blue-800';
  };
  
  // Función para renderizar la valoración (si existe)
  const renderValuation = (valuation: string) => {
    if (!valuation) return <span className="text-gray-500">No disponible</span>;
    
    try {
      const data = JSON.parse(valuation);
      return (
        <div className="flex flex-col gap-1">
          <div className="text-sm font-medium">
            {data.address || data.location || "Dirección no disponible"}
          </div>
          <div className="flex gap-2 text-xs text-gray-500">
            {data.propertyType && <span>{data.propertyType}</span>}
            {data.size && <span>{data.size} m²</span>}
            {data.rooms && <span>{data.rooms} hab.</span>}
          </div>
          {data.estimatedValue && (
            <div className="text-sm font-bold text-green-600">
              {new Intl.NumberFormat('es-ES', { 
                style: 'currency', 
                currency: 'EUR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              }).format(data.estimatedValue)}
            </div>
          )}
        </div>
      );
    } catch (e) {
      return <span className="text-gray-500">{valuation}</span>;
    }
  };
  
  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Panel de Agencia Inmobiliaria</h1>
        <div className="flex items-center gap-2">
          {wsConnected ? (
            <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Conectado en tiempo real</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <span>Sin conexión en tiempo real</span>
            </div>
          )}
        </div>
      </div>
      
      <Tabs defaultValue="valuations" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="valuations">Valoraciones</TabsTrigger>
          <TabsTrigger value="properties">Propiedades</TabsTrigger>
        </TabsList>
        
        {/* Pestaña de Valoraciones */}
        <TabsContent value="valuations">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HomeIcon className="h-5 w-5 text-primary" />
                Valoraciones Recientes
              </CardTitle>
              <CardDescription>
                Listado de todas las valoraciones solicitadas por los propietarios
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingValuations ? (
                <div className="flex justify-center py-10">
                  <div className="animate-pulse text-center">
                    <div className="h-4 bg-gray-200 rounded-full w-32 mb-2 mx-auto"></div>
                    <div className="h-2 bg-gray-200 rounded-full max-w-md mb-2.5"></div>
                    <div className="h-2 bg-gray-200 rounded-full mb-2.5"></div>
                  </div>
                </div>
              ) : valuationsData?.valuations?.length ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Usuario</TableHead>
                        <TableHead>Contacto</TableHead>
                        <TableHead>Valoración</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Acción</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {valuationsData?.valuations
                        .filter((valuation: Valuation) => valuation.role === "propietario" && valuation.lastValuation)
                        .map((valuation: Valuation) => (
                        <TableRow key={valuation.userId}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <UserIcon className="h-4 w-4 text-gray-500" />
                              {valuation.name || `Usuario ${valuation.userId}`}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <PhoneIcon className="h-4 w-4 text-gray-500" />
                              {valuation.phone}
                            </div>
                          </TableCell>
                          <TableCell>
                            {renderValuation(valuation.lastValuation)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <ClockIcon className="h-4 w-4 text-gray-500" />
                              {formatDate(valuation.createdAt)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                // Aquí implementaríamos la lógica para contactar al cliente
                                alert(`Llamando a ${valuation.phone}...`);
                              }}
                            >
                              Contactar
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  No hay valoraciones disponibles en este momento.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Pestaña de Propiedades */}
        <TabsContent value="properties">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HomeIcon className="h-5 w-5 text-primary" />
                Listado de Propiedades
              </CardTitle>
              <CardDescription>
                Todas las propiedades registradas en la plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingProperties ? (
                <div className="flex justify-center py-10">
                  <div className="animate-pulse text-center">
                    <div className="h-4 bg-gray-200 rounded-full w-32 mb-2 mx-auto"></div>
                    <div className="h-2 bg-gray-200 rounded-full max-w-md mb-2.5"></div>
                    <div className="h-2 bg-gray-200 rounded-full mb-2.5"></div>
                  </div>
                </div>
              ) : propertiesData?.properties?.length ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Propiedad</TableHead>
                        <TableHead>Ubicación</TableHead>
                        <TableHead>Precio</TableHead>
                        <TableHead>Propietario</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Acción</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {propertiesData?.properties?.map((property: Property) => (
                        <TableRow key={property.id}>
                          <TableCell className="font-medium">
                            <div className="flex flex-col">
                              <span>{property.title}</span>
                              <span className="text-xs text-gray-500">{property.size} m²</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>{property.location}</span>
                              <span className="text-xs text-gray-500">{property.address}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {property.price ? (
                              <span className="font-semibold">
                                {new Intl.NumberFormat('es-ES', { 
                                  style: 'currency', 
                                  currency: 'EUR',
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 0
                                }).format(property.price)}
                              </span>
                            ) : (
                              <span className="text-gray-500">No disponible</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <UserIcon className="h-4 w-4 text-gray-500" />
                              <div className="flex flex-col">
                                <span>{property.owner.name || 'Propietario'}</span>
                                <span className="text-xs text-gray-500">{property.owner.phone}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getSaleTypeClass(property.sale_type)}>
                              {property.sale_type === 'secreta' ? 'Venta Secreta' : 'Venta Pública'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusClass(property.status)}>
                              {property.status === 'pendiente' && 'Pendiente'}
                              {property.status === 'en_proceso' && 'En Proceso'}
                              {property.status === 'vendida' && 'Vendida'}
                              {!['pendiente', 'en_proceso', 'vendida'].includes(property.status) && property.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  // Actualizar estado
                                  alert(`Actualizando estado de la propiedad ${property.id}...`);
                                }}
                              >
                                <CheckIcon className="h-4 w-4 mr-1" />
                                Actualizar
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  <div className="mb-4">
                    <AlertCircleIcon className="h-10 w-10 mx-auto text-gray-400" />
                  </div>
                  <p>No hay propiedades registradas en este momento.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => {
                      // Aquí podríamos redirigir a una página para crear propiedades
                      alert('Funcionalidad para añadir propiedades');
                    }}
                  >
                    Añadir Propiedad
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}