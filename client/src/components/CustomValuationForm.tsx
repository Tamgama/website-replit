import { useState, useRef } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Search, Building, Video } from "lucide-react";
import AerialView from "@/components/AerialView";
import AddressAutocomplete from "./AddressAutocomplete";
import { getParcelsByCoordinates, getBuildingsByParcelRC, CatastroParcel, CatastroBuilding } from "@/lib/catastro";

interface CustomValuationFormProps {
  onValuationComplete?: (data: any) => void;
}
// Schema para el formulario de valoración simplificado en pasos
const addressSchema = z.object({
  address: z.string().min(3, { message: "La dirección es obligatoria" }),
});

const propertyDetailsSchema = z.object({
  propertyType: z.string().min(1, { message: "El tipo de inmueble es obligatorio" }),
  size: z.string().min(1, { message: "El tamaño es obligatorio" }),
  rooms: z.string().min(1, { message: "El número de rooms es obligatorio" }),
  banos: z.string().min(1, { message: "El número de baños es obligatorio" }),
  planta: z.string().min(1, { message: "La planta es obligatoria" }),
  puerta: z.string().min(1, { message: "La puerta es obligatoria" }),
  condition: z.string().min(1, { message: "El condition es obligatorio" }),
  yearBuilt: z.string().optional(),
  hasElevator: z.boolean().optional(),
  hasGarage: z.boolean().optional(),
  hasPool: z.boolean().optional(),
  hasTerrace: z.boolean().optional(),
});

const contactInfoSchema = z.object({
  name: z.string().min(2, { message: "El nombre es obligatorio" }),
  phone: z.string().regex(/^[0-9]{9}$/, { message: "Introduce tu número de teléfono" }),
});

// Unimos los schemas para tener el esquema completo
const valuationFormSchema = addressSchema.merge(propertyDetailsSchema).merge(contactInfoSchema);

type AddressFormValues = z.infer<typeof addressSchema>;
type PropertyDetailsFormValues = z.infer<typeof propertyDetailsSchema>;
type ContactInfoFormValues = z.infer<typeof contactInfoSchema>;
type ValuationFormValues = z.infer<typeof valuationFormSchema>;

enum FormStep {
  Address = 1,
  SelectProperty = 2,
  PropertyDetailsAndContact = 3, // Combinamos PropertyDetails y ContactInfo
  Results = 4,
}

const CustomValuationForm = () => {
  // Definición de interfaces para el condition
  interface CatastroParcel {
    rc: string;
    area: string;
    address: string;
    buildingType: string;
    constructionYear?: string;
  }
  
  interface CatastroBuilding {
    rc: string;
    area: string;
    constructionYear?: string;
    use: string;
    floors: string;
    condition?: string;
  }
  
  interface CatastroDataState {
    parcel?: CatastroParcel;
    building?: CatastroBuilding;
  }

  // Interfaz para los inmuebles encontrados
  interface PropiedadEncontrada {
    id: string;
    rc: string;
    tipo: string;
    direccion: string;
    superficie: string;
    rooms: number;
    banos: number;
    yearBuilt?: string;
    condition: string;
    escalera?: string;
    planta?: string;
    puerta?: string;
    coeficienteParticipacion?: string;
    eficienciaEnergetica?: string;
    ultimaReforma?: string;
    orientacion?: string;
    tieneTrastero?: boolean;
    hasGarage?: boolean;
    nivelRuido?: string;
    calidad?: string;
  }
  
  const [step, setStep] = useState<FormStep>(FormStep.Address);
  const [valuationResults, setValuationResults] = useState<any>(null);
  const [catastroData, setCatastroData] = useState<CatastroDataState | null>(null);
  const [isLoadingCatastro, setIsLoadingCatastro] = useState<boolean>(false);
  const [propiedadesEncontradas, setPropiedadesEncontradas] = useState<PropiedadEncontrada[]>([]);
  const [propiedadSeleccionada, setPropiedadSeleccionada] = useState<PropiedadEncontrada | null>(null);
  const selectedLocation = useRef<{lat: number, lng: number} | null>(null);
  
  // Función para seleccionar una propiedad
  const seleccionarPropiedad = (propiedad: PropiedadEncontrada) => {
    setPropiedadSeleccionada(propiedad);
    
    // Auto-rellenar los campos del formulario con los datos de esta propiedad
    propertyDetailsForm.setValue('propertyType', propiedad.tipo);
    propertyDetailsForm.setValue('size', propiedad.superficie);
    propertyDetailsForm.setValue('rooms', propiedad.rooms.toString());
    propertyDetailsForm.setValue('condition', propiedad.condition);
    
    // Deshabilitar edición de los campos
    // (Esto se manejará en el renderizado)
    
    // Pasar al siguiente paso
    setStep(FormStep.PropertyDetailsAndContact);
  };
  const { toast } = useToast();

  // Inicializar el formulario de dirección (paso 1)
  const addressForm = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      address: "",
    },
  });

  // Inicializar el formulario de detalles de propiedad (paso 2)
  const propertyDetailsForm = useForm<PropertyDetailsFormValues>({
    resolver: zodResolver(propertyDetailsSchema),
    defaultValues: {
      propertyType: "piso",
      size: "100",
      rooms: "3",
      banos: "1",
      planta: "1",
      puerta: "A",
      hasElevator: false,
      hasGarage: false,
      condition: "buen_condition",
    },
  });

  // Inicializar el formulario de contacto (paso 3)
  const contactForm = useForm<ContactInfoFormValues>({
    resolver: zodResolver(contactInfoSchema),
    defaultValues: {
      name: "",
      phone: "",
    },
  });

  // Función para enviar los datos y obtener la valoración
  const calculateValuation = async (formData: ValuationFormValues) => {
    try {
      // Simular un tiempo de espera para la API
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Calcular un valor estimado basado en los datos proporcionados
      const basePrice = 1200; // Precio base por metro cuadrado en Vista Alegre
      const size = parseInt(formData.size);
      const rooms = parseInt(formData.rooms);
      const year = parseInt(formData.yearBuilt || "2000");
      const currentYear = new Date().getFullYear();
      const barrio = formData.address.toLowerCase();
      const buildingAge = currentYear - year
      
      // Factores de ajuste según características
      const typeFactor = 
        formData.propertyType === "piso" ? 1.0 : 
        formData.propertyType === "chalet" ? 1.3 : 
        formData.propertyType === "dúplex" ? 1.2 : 0.95;
      
      let ageFactor = 1;
        if (buildingAge < 5) ageFactor = 1.2;
        else if (buildingAge < 15) ageFactor = 1.1;
        else if (buildingAge > 40) ageFactor = 0.85;
    
      let conditionFactor = 1;
        if (formData.condition === "excelente") conditionFactor = 1.15;
        else if (formData.condition === "malo") conditionFactor = 0.8;
      
      let estimatedValue = basePrice * size * typeFactor * ageFactor * conditionFactor * (1 + 0.1 * rooms);
      
      // Si tenemos datos del catastro, usarlos para una estimación más precisa
      if (catastroData && catastroData.parcel && catastroData.building) {
        try {
          // Mejorar el cálculo con datos catastrales
          // Factores base según catastro
          const areaCatastro = parseInt(catastroData.building.area) || size;
          const yearConstruction = catastroData.building.constructionYear 
            ? parseInt(catastroData.building.constructionYear) 
            : 0;
          
          // Ajustar precio base según la información catastral
          let adjustedBasePrice = basePrice;
          
          // Ajuste por antigüedad de la construcción
          const currentYear = new Date().getFullYear();
          if (yearConstruction > 0) {
            const buildingAge = currentYear - yearConstruction;
            if (buildingAge < 5) {
              adjustedBasePrice *= 1.3; // Edificio muy nuevo
            } else if (buildingAge < 15) {
              adjustedBasePrice *= 1.1; // Edificio relativamente nuevo
            } else if (buildingAge > 50) {
              adjustedBasePrice *= 0.8; // Edificio antiguo
            }
          }
          
          // Cálculo con datos del catastro
          const valorBase = Math.round(
            adjustedBasePrice * areaCatastro * typeFactor * conditionFactor * 
            (1 + 0.1 * rooms)
          );
          // Verificar si la ubicación es Vista Alegre para aplicar el 22% de aumento
          const isVistaAlegre = formData.address.toLowerCase().includes('vista alegre');
          if (isVistaAlegre) {
            // Aplicar 22% para Vista Alegre (15% + 7% adicional)
            estimatedValue = Math.round(valorBase * 1.22);
            console.log("Propiedad en Vista Alegre: aplicando ajuste del 22% (15% + 7%)");
          } else {
            // Aplicar ajuste de precio (-7%) para otras zonas
            estimatedValue = Math.round(valorBase * 1.2 * 0.93);
          }
          
          console.log("Valoración calculada con datos catastrales:", estimatedValue);
        } catch (error) {
          console.error("Error al calcular con datos del catastro, usando método alternativo", error);
          // Si falla el cálculo con datos del catastro, usamos el método alternativo
          estimatedValue = Math.round(
            basePrice * size * typeFactor * conditionFactor * 
            (1 + 0.1 * rooms)
          );
        }
      } else {
        // Cálculo estimado (fórmula simplificada) si no hay datos del catastro
        const valorBase = Math.round(
          basePrice * size * typeFactor * conditionFactor * 
          (1 + 0.1 * rooms)
        );
        
        // Verificar si la ubicación es Vista Alegre para aplicar un 22% de ajuste (15% + 7% adicional)
        const isVistaAlegre = formData.address.toLowerCase().includes('vista alegre');
        if (isVistaAlegre) {
          // Aplicar 22% para Vista Alegre (15% base + 7% adicional)
          estimatedValue = Math.round(valorBase * 1.22);
          console.log("Propiedad en Vista Alegre: aplicando ajuste del 22% (15% + 7%)");
        } else {
          // Aplicar ajuste de precio (-7%) para otras zonas
          estimatedValue = Math.round(valorBase * 1.2 * 0.93);
        }
      }
      
      // Crear objeto de resultados
      const results = {
        address: formData.address,
        propertyType: formData.propertyType,
        size: formData.size,
        rooms: formData.rooms,
        condition: formData.condition,
        estimatedValue: estimatedValue,
        minValue: Math.round(estimatedValue * 0.9),
        maxValue: Math.round(estimatedValue * 1.1),
        userId: 1, // Este sería el ID de usuario real en una implementación completa
        catastroData: catastroData || null // Incluir datos del catastro si están disponibles
      };
      
      return results;
    } catch (error) {
      throw new Error("No pudimos procesar la valoración");
    }
  };

  // Manejadores para cada paso del formulario
  const onAddressSubmit = async (data: AddressFormValues) => {
    // Guardar coordenadas si están disponibles (para posible uso posterior)
    if (selectedLocation.current) {
      const { lat, lng } = selectedLocation.current;
      console.log("Coordenadas guardadas:", lat, lng);
      
      try {
        // Intentar obtener datos de catastro en segundo plano pero no esperar a que termine
        fetch(`/api/catastro?lat=${lat}&lng=${lng}`)
          .then(response => {
            if (response.ok) return response.json();
            return null;
          })
          .then(data => {
            if (data?.parcels && data.parcels.length > 0) {
              setCatastroData({ parcel: data.parcels[0] });
              console.log("Datos del catastro guardados en segundo plano");
            }
          })
          .catch(error => {
            console.error("Error consultando datos del catastro en segundo plano:", error);
          });
      } catch (error) {
        console.error("Error iniciando consulta de catastro:", error);
      }
    }
    
    // Activar consulta de Catastro para obtener propiedades en la dirección
    setIsLoadingCatastro(true);
    
    try {
      const { lat, lng } = selectedLocation.current || { lat: 0, lng: 0 };
      
      if (lat && lng) {
        // Consultar API de Catastro para obtener detalles completos
        const response = await fetch(`/api/catastro?lat=${lat}&lng=${lng}`);
        
        if (response.ok) {
          const data = await response.json();
          
          if (data?.propiedades && data.propiedades.length > 0) {
            setPropiedadesEncontradas(data.propiedades);
            setCatastroData({ 
              parcel: data.parcela,
              building: data.edificio
            });
            
            console.log("Datos del catastro recibidos:", data);
            setStep(FormStep.SelectProperty);
          } else {
            // No se encontraron propiedades, ir directo a detalles
            setStep(FormStep.PropertyDetailsAndContact);
          }
        } else {
          console.error("Error en la respuesta de la API de Catastro");
          setStep(FormStep.PropertyDetailsAndContact);
        }
      } else {
        console.warn("No hay coordenadas disponibles para consultar el Catastro");
        setStep(FormStep.PropertyDetailsAndContact);
      }
    } catch (error) {
      console.error("Error consultando API de Catastro:", error);
      setStep(FormStep.PropertyDetailsAndContact);
    } finally {
      setIsLoadingCatastro(false);
    }
  };

  // Reemplazamos esta función ya que ahora vamos directo a resultados desde el formulario combinado
  const onPropertyDetailsSubmit = async (data: PropertyDetailsFormValues) => {
    // Ahora iríamos a Results, pero esta función ya no se usa
    setStep(FormStep.Results);
  };

  const onContactSubmit = async (data: ContactInfoFormValues) => {
    try {
      // Combinar todos los datos del formulario
      const formData: ValuationFormValues = {
        address: addressForm.getValues().address,
        ...propertyDetailsForm.getValues(),
        ...data,
      };
      
      // Calcular la valoración
      const results = await calculateValuation(formData);
      
      // Actualizar condition y mostrar resultados
      setValuationResults(results);
      setStep(FormStep.Results);
    } catch (error) {
      toast({
        title: "Error en la valoración",
        description: "No pudimos procesar tu solicitud. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  // Función para volver al paso anterior
  const goBack = () => {
    if (step === FormStep.SelectProperty) {
      setStep(FormStep.Address);
    } else if (step === FormStep.PropertyDetailsAndContact) {
      // Si tenemos propiedades encontradas, volvemos a seleccionar propiedad
      if (propiedadesEncontradas.length > 0) {
        setStep(FormStep.SelectProperty);
      } else {
        // Si no hay propiedades, volvemos a la dirección
        setStep(FormStep.Address);
      }
    } else if (step === FormStep.Results) {
      setStep(FormStep.PropertyDetailsAndContact);
    }
  };

  // Renderizado del formulario según el paso actual
  switch (step) {
    case FormStep.SelectProperty:
      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-blue-800 mb-4">Selecciona tu vivienda</h2>
          <p className="text-gray-600 mb-6">Hemos encontrado estas propiedades en la dirección indicada</p>
          
          {isLoadingCatastro ? (
            <div className="flex flex-col items-center justify-center p-12">
              <svg className="animate-spin h-10 w-10 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-sm text-gray-500">Obteniendo datos del Catastro...</p>
            </div>
          ) : propiedadesEncontradas.length > 0 ? (
            <div className="grid gap-4">
              {propiedadesEncontradas.map((propiedad) => (
                <div 
                  key={propiedad.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    propiedadSeleccionada?.id === propiedad.id 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-300 hover:border-blue-400'
                  }`}
                  onClick={() => seleccionarPropiedad(propiedad)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{propiedad.direccion}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {propiedad.superficie} m² · {propiedad.rooms} habit. · {propiedad.banos} baños
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${
                          propiedad.condition === 'nuevo' 
                            ? 'bg-green-100 text-green-800' 
                            : propiedad.condition === 'reformar' 
                              ? 'bg-amber-100 text-amber-800' 
                              : 'bg-blue-100 text-blue-800'
                        }`}>
                          {propiedad.condition === 'nuevo' ? 'Nuevo/Casi nuevo' : 
                           propiedad.condition === 'reformar' ? 'Para reformar' : 'Buen condition'}
                        </span>
                        {propiedad.yearBuilt && (
                          <span className="text-xs text-gray-500">
                            Construido en {propiedad.yearBuilt}
                          </span>
                        )}
                        {propiedad.eficienciaEnergetica && (
                          <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${
                            propiedad.eficienciaEnergetica === 'A' || propiedad.eficienciaEnergetica === 'B' 
                              ? 'bg-green-100 text-green-800' 
                              : propiedad.eficienciaEnergetica === 'C' || propiedad.eficienciaEnergetica === 'D'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                          }`}>
                            Efic. {propiedad.eficienciaEnergetica}
                          </span>
                        )}
                        {propiedad.hasGarage && (
                          <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                            Garaje
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        {propiedad.calidad && (
                          <span className="text-xs text-gray-500">
                            Calidad: {propiedad.calidad}
                          </span>
                        )}
                        {propiedad.ultimaReforma && (
                          <span className="text-xs text-gray-500">
                            Reforma: {propiedad.ultimaReforma}
                          </span>
                        )}
                        {propiedad.orientacion && (
                          <span className="text-xs text-gray-500">
                            Orient: {propiedad.orientacion}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="bg-gray-200 text-gray-900 p-2 rounded-md text-xs font-mono">
                      {propiedad.rc.substring(0, 7)}...
                    </div>
                  </div>
                  {propiedadSeleccionada?.id === propiedad.id && (
                    <div className="mt-2 text-sm text-green-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Seleccionado
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 border border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-600 mb-4">No se encontraron propiedades en esta dirección</p>
              <Button 
                onClick={() => {
                  // Continuar con formulario manual
                  setStep(FormStep.PropertyDetailsAndContact);
                }}
                className="bg-blue-600"
              >
                Continuar con formulario manual
              </Button>
            </div>
          )}
          
          <div className="flex space-x-3 pt-6">
            <Button 
              onClick={goBack}
              variant="outline" 
              className="flex-1"
            >
              Volver a dirección
            </Button>
            {propiedadSeleccionada && (
              <Button 
                onClick={() => setStep(FormStep.PropertyDetailsAndContact)}
                className="flex-1 bg-green-500 hover:bg-green-600"
              >
                Continuar
              </Button>
            )}
          </div>
        </div>
      );
      
    case FormStep.Address:
      return (
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            ¿Cuánto vale mi casa?
          </h2>
          <p className="text-lg mb-8">
            Tasación de viviendas online gratuita en 3 minutos
          </p>
          
          <Form {...addressForm}>
            <form onSubmit={addressForm.handleSubmit(onAddressSubmit)} className="space-y-6">
              <FormField
                control={addressForm.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormControl>
                      <AddressAutocomplete
                        value={field.value}
                        onChange={field.onChange}
                        onPlaceSelect={(place) => {
                          // Actualizar el valor con la dirección formateada
                          if (place && place.formatted_address) {
                            field.onChange(place.formatted_address);
                            
                            // Si tenemos coordenadas, guardarlas para usar con la API del catastro
                            if (place.location) {
                              selectedLocation.current = place.location;
                              console.log("Coordenadas guardadas:", place.location);
                            }
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-md"
                disabled={isLoadingCatastro}
              >
                {isLoadingCatastro ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Obteniendo datos...
                  </span>
                ) : (
                  "Valorar"
                )}
              </Button>
            </form>
          </Form>
          
          <div className="mt-8">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-sm font-medium">Excelente</span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-600">3'500+ reseñas</span>
            </div>
          </div>
        </div>
      );
    
    case FormStep.PropertyDetailsAndContact:
      return (
        <Form {...propertyDetailsForm}>
          <form onSubmit={propertyDetailsForm.handleSubmit((propertyData) => {
            // Combinar datos de propiedad con datos de contacto
            const contactData = contactForm.getValues();
            const formData: ValuationFormValues = {
              address: addressForm.getValues().address,
              ...propertyData,
              ...contactData
            };
            // Calcular valoración y pasar a resultados
            calculateValuation(formData).then(results => {
              setValuationResults(results);
              setStep(FormStep.Results);
            }).catch(error => {
              toast({
                title: "Error en la valoración",
                description: "No pudimos procesar tu solicitud. Por favor, inténtalo de nuevo.",
                variant: "destructive",
              });
            });
          })} className="space-y-4">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">Detalles de tu propiedad</h2>
            
            {/* Sección de datos del catastro - siempre visible */}
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <div className="flex items-center mb-4">
                <Building className="text-blue-700 mr-2 h-5 w-5" />
                <h3 className="font-medium text-blue-800">Datos oficiales del Catastro</h3>
              </div>
              
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                {propiedadSeleccionada ? (
                  <>
                    <dt className="text-gray-600">Referencia catastral:</dt>
                    <dd className="font-mono text-xs">{propiedadSeleccionada.rc}</dd>
                    
                    <dt className="text-gray-600">Tipo de inmueble:</dt>
                    <dd>{propiedadSeleccionada.tipo === 'piso' ? 'Piso' : 
                        propiedadSeleccionada.tipo === 'chalet' ? 'Chalet' : 
                        propiedadSeleccionada.tipo === 'dúplex' ? 'Dúplex' : 
                        propiedadSeleccionada.tipo}</dd>
                    
                    <dt className="text-gray-600">Superficie:</dt>
                    <dd>{propiedadSeleccionada.superficie} m²</dd>
                    
                    <dt className="text-gray-600">Uso principal:</dt>
                    <dd>{propiedadSeleccionada.tipo === 'piso' ? 'Residencial' : 'Otro'}</dd>
                  </>
                ) : catastroData ? (
                  <>
                    <dt className="text-gray-600">Referencia catastral:</dt>
                    <dd className="font-mono text-xs">{catastroData.parcel?.rc || 'No disponible'}</dd>
                    
                    <dt className="text-gray-600">Superficie construida:</dt>
                    <dd>{catastroData.building?.area || 'No disponible'} m²</dd>
                    
                    <dt className="text-gray-600">Clase:</dt>
                    <dd>Urbano</dd>
                    
                    <dt className="text-gray-600">Uso principal:</dt>
                    <dd>{catastroData.building?.use || 'Residencial'}</dd>
                  </>
                ) : (
                  <>
                    <dt className="text-gray-600">Referencia catastral:</dt>
                    <dd className="font-mono text-xs">No disponible</dd>
                    
                    <dt className="text-gray-600">Superficie construida:</dt>
                    <dd>No disponible</dd>
                    
                    <dt className="text-gray-600">Clase:</dt>
                    <dd>No disponible</dd>
                    
                    <dt className="text-gray-600">Uso principal:</dt>
                    <dd>No disponible</dd>
                  </>
                )}
              </dl>
              
              {/* Selectores de planta y puerta como desplegables */}
              <div className="mt-4 border-t border-blue-100 pt-4 grid grid-cols-2 gap-4">
                <FormField
                  control={propertyDetailsForm.control}
                  name="planta"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-600">Planta</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona la planta" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Baja">Planta Baja</SelectItem>
                          <SelectItem value="1">Primera planta</SelectItem>
                          <SelectItem value="2">Segunda planta</SelectItem>
                          <SelectItem value="3">Tercera planta</SelectItem>
                          <SelectItem value="4">Cuarta planta</SelectItem>
                          <SelectItem value="5">Quinta planta</SelectItem>
                          <SelectItem value="6">Sexta planta</SelectItem>
                          <SelectItem value="7">Séptima planta</SelectItem>
                          <SelectItem value="8">Octava planta</SelectItem>
                          <SelectItem value="9">Novena planta</SelectItem>
                          <SelectItem value="10+">Décima o superior</SelectItem>
                          <SelectItem value="Ático">Ático</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={propertyDetailsForm.control}
                  name="puerta"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-600">Puerta</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona la puerta" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="A">A</SelectItem>
                          <SelectItem value="B">B</SelectItem>
                          <SelectItem value="C">C</SelectItem>
                          <SelectItem value="D">D</SelectItem>
                          <SelectItem value="E">E</SelectItem>
                          <SelectItem value="F">F</SelectItem>
                          <SelectItem value="G">G</SelectItem>
                          <SelectItem value="H">H</SelectItem>
                          <SelectItem value="I">I</SelectItem>
                          <SelectItem value="J">J</SelectItem>
                          <SelectItem value="Única">Puerta única</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            {propiedadSeleccionada ? (
              // Características específicas si hay una propiedad seleccionada
              <>
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  {/* Sección de características con botones */}
                  <div className="mt-4 border-t border-blue-100 pt-4">
                    <h4 className="font-medium text-blue-800 mb-3">Características:</h4>
                    
                    {/* rooms */}
                    <div className="mb-3">
                      <label className="block text-sm text-gray-600 mb-1">rooms:</label>
                      <div className="flex flex-wrap gap-2">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <button
                            key={`hab-${num}`}
                            type="button"
                            className={`px-3 py-1 rounded text-sm ${
                              propiedadSeleccionada.rooms === num
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                            }`}
                            onClick={() => {
                              // Actualizar la propiedad seleccionada con el nuevo valor
                              setPropiedadSeleccionada({
                                ...propiedadSeleccionada,
                                rooms: num
                              });
                            }}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Baños */}
                    <div className="mb-3">
                      <label className="block text-sm text-gray-600 mb-1">Baños:</label>
                      <div className="flex flex-wrap gap-2">
                        {[1, 2, 3].map((num) => (
                          <button
                            key={`bano-${num}`}
                            type="button"
                            className={`px-3 py-1 rounded text-sm ${
                              propiedadSeleccionada.banos === num
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                            }`}
                            onClick={() => {
                              setPropiedadSeleccionada({
                                ...propiedadSeleccionada,
                                banos: num
                              });
                            }}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* condition */}
                    <div className="mb-3">
                      <label className="block text-sm text-gray-600 mb-1">condition:</label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { id: 'nuevo', label: 'Nuevo/Casi nuevo' },
                          { id: 'buen_condition', label: 'Buen condition' },
                          { id: 'reformar', label: 'Para reformar' }
                        ].map((condition) => (
                          <button
                            key={`condition-${condition.id}`}
                            type="button"
                            className={`px-3 py-1 rounded text-sm ${
                              propiedadSeleccionada.condition === condition.id
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                            }`}
                            onClick={() => {
                              setPropiedadSeleccionada({
                                ...propiedadSeleccionada,
                                condition: condition.id
                              });
                            }}
                          >
                            {condition.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Escalera (solo para pisos) */}
                    {propiedadSeleccionada.tipo === 'piso' && (
                      <div className="mb-3">
                        <label className="block text-sm text-gray-600 mb-1">Escalera:</label>
                        <div className="flex flex-wrap gap-2">
                          {['A', 'B', 'C', 'D', 'Única'].map((esc) => (
                            <button
                              key={`escalera-${esc}`}
                              type="button"
                              className={`px-3 py-1 rounded text-sm ${
                                propiedadSeleccionada.escalera === esc
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                              }`}
                              onClick={() => {
                                setPropiedadSeleccionada({
                                  ...propiedadSeleccionada,
                                  escalera: esc
                                });
                              }}
                            >
                              {esc}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Eliminados los selectores de planta y puerta (ahora están en la sección superior) */}
                    
                    {/* Año construcción */}
                    <div className="mb-3">
                      <label className="block text-sm text-gray-600 mb-1">Año construcción:</label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { rango: '1970-1980', label: '70s' },
                          { rango: '1981-1990', label: '80s' },
                          { rango: '1991-2000', label: '90s' },
                          { rango: '2001-2010', label: '00s' },
                          { rango: '2011-2020', label: '10s' },
                          { rango: '2021-2025', label: 'Reciente' }
                        ].map((periodo) => {
                          const anoActual = propiedadSeleccionada.yearBuilt || '2000';
                          const [inicio, fin] = periodo.rango.split('-').map(n => parseInt(n));
                          const estaEnRango = parseInt(anoActual) >= inicio && parseInt(anoActual) <= fin;
                          
                          return (
                            <button
                              key={`ano-${periodo.rango}`}
                              type="button"
                              className={`px-3 py-1 rounded text-sm ${
                                estaEnRango
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                              }`}
                              onClick={() => {
                                // Establecer el año como el punto medio del rango
                                const nuevoAno = Math.floor((inicio + fin) / 2).toString();
                                setPropiedadSeleccionada({
                                  ...propiedadSeleccionada,
                                  yearBuilt: nuevoAno
                                });
                              }}
                            >
                              {periodo.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-4">
                    Estos datos han sido obtenidos automáticamente del Catastro y no son editables
                  </p>
                </div>
                
                {/* Campos ocultos para mantener los valores en el formulario */}
                <div className="hidden">
                  <FormField
                    control={propertyDetailsForm.control}
                    name="propertyType"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input type="hidden" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={propertyDetailsForm.control}
                    name="size"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input type="hidden" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={propertyDetailsForm.control}
                    name="rooms"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input type="hidden" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={propertyDetailsForm.control}
                    name="condition"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input type="hidden" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </>
            ) : (
              // Mostrar formulario editable si no hay propiedad seleccionada
              <>
                {/* Tipo de inmueble fijo como piso */}
                <FormField
                  control={propertyDetailsForm.control}
                  name="propertyType"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="hidden" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                {/* Los metros cuadrados se han movido a la sección de datos del catastro */}
                <FormField
                  control={propertyDetailsForm.control}
                  name="size"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="hidden" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={propertyDetailsForm.control}
                  name="rooms"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>rooms</FormLabel>
                      <FormControl>
                        <div className="flex flex-wrap gap-2">
                          {[1, 2, 3, 4, 5].map((num) => (
                            <button
                              key={`rooms-${num}`}
                              type="button"
                              className={`px-4 py-2 rounded-md ${
                                field.value === num.toString()
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                              }`}
                              onClick={() => field.onChange(num.toString())}
                            >
                              {num} {num === 1 ? 'habit.' : 'habit.'}
                            </button>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={propertyDetailsForm.control}
                  name="banos"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>Baños</FormLabel>
                      <FormControl>
                        <div className="flex flex-wrap gap-2">
                          {[1, 2, 3].map((num) => (
                            <button
                              key={`banos-${num}`}
                              type="button"
                              className={`px-4 py-2 rounded-md ${
                                field.value === num.toString()
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                              }`}
                              onClick={() => field.onChange(num.toString())}
                            >
                              {num} {num === 1 ? 'baño' : 'baños'}
                            </button>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={propertyDetailsForm.control}
                  name="condition"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>condition de la vivienda</FormLabel>
                      <FormControl>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { id: "nuevo", label: "Nuevo" },
                            { id: "buen_condition", label: "Buen condition" },
                            { id: "reformar", label: "Para reformar" }
                          ].map((condition) => (
                            <button
                              key={`condition-${condition.id}`}
                              type="button"
                              className={`px-4 py-2 rounded-md ${
                                field.value === condition.id
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                              }`}
                              onClick={() => field.onChange(condition.id)}
                            >
                              {condition.label}
                            </button>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Los campos de planta y puerta se han movido a la sección de datos del catastro */}
                
                <div className="space-y-4 mb-4">
                  <div>
                    <FormLabel>Características adicionales</FormLabel>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      <div className={`flex items-center gap-2 p-3 rounded-md border bg-white border-gray-300 text-gray-700`}>
                        <div className={`w-4 h-4 rounded-full bg-gray-300`} />
                        <span>Ascensor</span>
                      </div>
                      
                      <div className={`flex items-center gap-2 p-3 rounded-md border bg-white border-gray-300 text-gray-700`}>
                        <div className={`w-4 h-4 rounded-full bg-gray-300`} />
                        <span>Garaje</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
            
            {/* SECCIÓN DE DATOS DE CONTACTO */}
            <div className="mt-8 border-t pt-6">
              <h3 className="text-xl font-bold text-blue-800 mb-4">Tus datos de contacto</h3>
              <p className="text-gray-600 mb-4">Necesitamos algunos datos para enviarte la valoración</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={contactForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input placeholder="Tu nombre" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={contactForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="Teléfono (ej: 612345678)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex space-x-3 pt-6">
              <Button 
                type="button" 
                onClick={goBack} 
                variant="outline" 
                className="flex-1"
              >
                Atrás
              </Button>
              <Button 
                type="submit" 
                className="flex-1 bg-green-500 hover:bg-green-600"
              >
                Ver valoración
              </Button>
            </div>
            
            <p className="text-xs text-gray-500 mt-4 text-center">
              Al enviar este formulario aceptas nuestra{" "}
              <a href="/privacidad" className="text-blue-600 hover:underline">
                política de privacidad
              </a>
            </p>
          </form>
        </Form>
      );
      
    // Caso de resultados
    case FormStep.Results:
      if (!valuationResults) return null;
      return (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-blue-800 mb-2">Valoración completada</h2>
          <p className="text-gray-600 mb-6">Basada en datos del mercado inmobiliario de Murcia</p>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <p className="text-sm text-gray-600 mb-2">Precio estimado de tu inmueble</p>
            <h3 className="text-3xl font-bold text-green-600 mb-2">
              {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(valuationResults.estimatedValue)}
            </h3>
            <p className="text-sm text-gray-500">
              Rango: {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(valuationResults.minValue)} - 
              {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(valuationResults.maxValue)}
            </p>
          </div>
          
          {/* Componente de vista aérea */}
          {/* Vista aérea temporalmente desactivada 
          <div className="mb-6">
            <div className="mb-2 flex items-center justify-center gap-2">
              <Video className="h-4 w-4 text-blue-700" />
              <h4 className="font-medium text-blue-800">Vista aérea de la propiedad</h4>
            </div>
            <AerialView 
              address={valuationResults.address} 
              className="h-48 md:h-64 w-full rounded-lg shadow-md" 
            />
            <p className="text-xs text-gray-500 mt-2">
              © Copyright 2023 Google LLC. All Rights Reserved. SPDX-License-Identifier: Apache-2.0
            </p>
          </div>
          */}
          
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-blue-800 mb-2">Detalles del inmueble</h4>
            <ul className="text-sm text-left">
              <li className="flex justify-between py-1 border-b border-blue-100">
                <span>Dirección:</span>
                <span className="font-medium">{valuationResults.address}</span>
              </li>
              <li className="flex justify-between py-1 border-b border-blue-100">
                <span>Tipo:</span>
                <span className="font-medium">{valuationResults.propertyType}</span>
              </li>
              <li className="flex justify-between py-1 border-b border-blue-100">
                <span>Superficie:</span>
                <span className="font-medium">{valuationResults.size} m²</span>
              </li>
              <li className="flex justify-between py-1 border-b border-blue-100">
                <span>rooms:</span>
                <span className="font-medium">{valuationResults.rooms}</span>
              </li>
              
              {/* Mostrar datos adicionales del catastro si están disponibles */}
              {valuationResults.catastroData && valuationResults.catastroData.building && (
                <>
                  {propiedadSeleccionada?.escalera && (
                    <li className="flex justify-between py-1 border-b border-blue-100">
                      <span>Escalera:</span>
                      <span className="font-medium">{propiedadSeleccionada.escalera}</span>
                    </li>
                  )}
                  
                  {propiedadSeleccionada?.planta && (
                    <li className="flex justify-between py-1 border-b border-blue-100">
                      <span>Planta:</span>
                      <span className="font-medium">{propiedadSeleccionada.planta}</span>
                    </li>
                  )}
                  
                  {propiedadSeleccionada?.puerta && (
                    <li className="flex justify-between py-1 border-b border-blue-100">
                      <span>Puerta:</span>
                      <span className="font-medium">{propiedadSeleccionada.puerta}</span>
                    </li>
                  )}
                  
                  <li className="flex justify-between py-1 border-b border-blue-100">
                    <span>Año Construcción:</span>
                    <span className="font-medium">
                      {valuationResults.catastroData.building.constructionYear || propiedadSeleccionada?.yearBuilt || "No disponible"}
                    </span>
                  </li>
                  
                  {/* Campos adicionales si están disponibles */}
                  {propiedadSeleccionada?.ultimaReforma && (
                    <li className="flex justify-between py-1 border-b border-blue-100">
                      <span>Última reforma:</span>
                      <span className="font-medium">{propiedadSeleccionada.ultimaReforma}</span>
                    </li>
                  )}
                  
                  {propiedadSeleccionada?.eficienciaEnergetica && (
                    <li className="flex justify-between py-1 border-b border-blue-100">
                      <span>Eficiencia energética:</span>
                      <span className={`font-medium px-2 py-0.5 rounded ${
                        propiedadSeleccionada.eficienciaEnergetica === 'A' || propiedadSeleccionada.eficienciaEnergetica === 'B' 
                        ? 'bg-green-100 text-green-800' 
                        : propiedadSeleccionada.eficienciaEnergetica === 'C' || propiedadSeleccionada.eficienciaEnergetica === 'D'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                      }`}>
                        {propiedadSeleccionada.eficienciaEnergetica}
                      </span>
                    </li>
                  )}
                  
                  {propiedadSeleccionada?.orientacion && (
                    <li className="flex justify-between py-1 border-b border-blue-100">
                      <span>Orientación:</span>
                      <span className="font-medium">{propiedadSeleccionada.orientacion}</span>
                    </li>
                  )}
                  
                  {propiedadSeleccionada?.coeficienteParticipacion && (
                    <li className="flex justify-between py-1 border-b border-blue-100">
                      <span>Coef. participación:</span>
                      <span className="font-medium">{propiedadSeleccionada.coeficienteParticipacion}</span>
                    </li>
                  )}
                  
                  {propiedadSeleccionada?.tieneTrastero !== undefined && (
                    <li className="flex justify-between py-1 border-b border-blue-100">
                      <span>Trastero:</span>
                      <span className="font-medium">{propiedadSeleccionada.tieneTrastero ? 'Sí' : 'No'}</span>
                    </li>
                  )}
                  
                  {propiedadSeleccionada?.hasGarage !== undefined && (
                    <li className="flex justify-between py-1 border-b border-blue-100">
                      <span>Garaje:</span>
                      <span className="font-medium">{propiedadSeleccionada.hasGarage ? 'Sí' : 'No'}</span>
                    </li>
                  )}
                  
                  {propiedadSeleccionada?.calidad && (
                    <li className="flex justify-between py-1 border-b border-blue-100">
                      <span>Calidad:</span>
                      <span className="font-medium">{propiedadSeleccionada.calidad}</span>
                    </li>
                  )}
                  
                  {propiedadSeleccionada?.nivelRuido && (
                    <li className="flex justify-between py-1 border-b border-blue-100">
                      <span>Nivel de ruido:</span>
                      <span className={`font-medium px-2 py-0.5 rounded ${
                        propiedadSeleccionada.nivelRuido === 'Bajo' 
                        ? 'bg-green-100 text-green-800' 
                        : propiedadSeleccionada.nivelRuido === 'Medio'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                      }`}>
                        {propiedadSeleccionada.nivelRuido}
                      </span>
                    </li>
                  )}
                  
                  <li className="flex justify-between py-1">
                    <span>Ref. Catastral:</span>
                    <span className="font-medium text-xs">
                      {valuationResults.catastroData.parcel?.rc || propiedadSeleccionada?.rc || "No disponible"}
                    </span>
                  </li>
                </>
              )}
            </ul>
          </div>
          
          {/* Sello de Catastro si se usaron datos oficiales */}
          {valuationResults.catastroData && (
            <div className="mb-6 flex items-center justify-center gap-2 text-xs text-gray-600">
              <Building className="h-4 w-4 text-blue-700" />
              <span>Valoración con datos oficiales del Catastro</span>
            </div>
          )}
          
          <div className="space-y-4">
            <Button 
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={() => {
                // Redirigir a la página de venta
                window.location.href = "/ventas-secretas";
              }}
            >
              Vender mi propiedad
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full border-blue-600 text-blue-600"
              onClick={() => {
                // Redirigir a la página de venta confidencial
                window.location.href = "/ventas-secretas";
              }}
            >
              Venta confidencial
            </Button>
            
            <Button 
              variant="link" 
              className="w-full"
              onClick={() => {
                // Resetear formulario y volver al inicio
                addressForm.reset();
                propertyDetailsForm.reset();
                contactForm.reset();
                setStep(FormStep.Address);
              }}
            >
              Nueva valoración
            </Button>
          </div>
        </div>
      );
      
    default:
      return null;
  }
};

export default CustomValuationForm;