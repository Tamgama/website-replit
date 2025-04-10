import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Home, Phone, CheckCircle2, LocateFixed, ArrowRight } from "lucide-react";

// Esquema de validación para el formulario
const valuationFormSchema = z.object({
  address: z.string().min(2, { message: "La dirección es requerida" }),
  location: z.string().min(2, { message: "La ubicación es requerida" }),
  size: z.string().regex(/^\d+$/, { message: "Introduce un número válido" }),
  rooms: z.string(),
  propertyType: z.string().min(1, { message: "Selecciona un tipo de propiedad" }),
  condition: z.string().min(1, { message: "Selecciona el estado de la propiedad" }),
  name: z.string().min(2, { message: "El nombre es requerido" }),
  phone: z.string().min(9, { message: "Introduce un número de teléfono válido" }),
  comments: z.string().optional(),
  privacy: z.boolean().refine((val) => val === true, { message: "Debes aceptar la política de privacidad" }),
});

type ValuationFormValues = z.infer<typeof valuationFormSchema>;

interface ValuationFormProps {
  onValuationComplete?: (data: any) => void;
}

const ValuationForm = ({ onValuationComplete }: ValuationFormProps) => {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const form = useForm<ValuationFormValues>({
    resolver: zodResolver(valuationFormSchema),
    defaultValues: {
      address: "",
      location: "Vista Alegre",
      size: "",
      rooms: "3",
      propertyType: "",
      condition: "",
      name: "",
      phone: "",
      comments: "",
      privacy: false,
    },
  });

  // Función para manejar el envío del formulario
  const onSubmit = async (data: ValuationFormValues) => {
    // Si estamos en el paso 2, mostrar el paso 3 con los resultados
    if (currentStep === 2) {
      // Validar los campos obligatorios en el paso 2
      const result = await form.trigger(["name", "phone", "privacy"]);
      if (result) {
        setCurrentStep(3);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      return;
    }
    
    // Solo enviamos a la API cuando el usuario está en el paso 3 y hace clic en "Guardar valoración"
    setIsSubmitting(true);
    try {
      // Calcular valor estimado (simulación)
      const sizeNum = parseInt(data.size);
      let basePrice = 0;
      
      // Precios base por zona (€/m²)
      switch (data.location) {
        case "Vista Alegre":
          basePrice = 1850;
          break;
        case "Santa María de Gracias":
          basePrice = 1950;
          break;
        case "La Flota":
          basePrice = 2200;
          break;
        default:
          basePrice = 1700;
      }
      
      // Ajuste por estado de la propiedad
      let conditionMultiplier = 1.0;
      switch (data.condition) {
        case "nuevo":
          conditionMultiplier = 1.1;
          break;
        case "bueno":
          conditionMultiplier = 1.0;
          break;
        case "reformar":
          conditionMultiplier = 0.85;
          break;
      }
      
      // Ajuste por tipo de propiedad
      let typeMultiplier = 1.0;
      switch (data.propertyType) {
        case "piso":
          typeMultiplier = 1.0;
          break;
        case "atico":
          typeMultiplier = 1.15;
          break;
        case "chalet":
          typeMultiplier = 1.2;
          break;
        case "adosado":
          typeMultiplier = 1.1;
          break;
      }
      
      // Cálculo final
      const estimatedValue = Math.round(sizeNum * basePrice * conditionMultiplier * typeMultiplier);
      
      // Crear objeto de valoración
      const valuationData = {
        address: data.address,
        location: data.location,
        size: data.size,
        rooms: data.rooms,
        condition: data.condition,
        propertyType: data.propertyType,
        estimatedValue: estimatedValue.toString(),
        timestamp: new Date().toISOString()
      };
      
      // Verificar si el usuario ya existe según el teléfono
      const checkUserResponse = await fetch(`/api/users/phone/${data.phone}`);
      const checkUserData = await checkUserResponse.json();
      
      let userId = 0;
      
      if (checkUserData.success && checkUserData.user) {
        // Actualizar valoración del usuario existente
        userId = checkUserData.user.id;
        
        const updateResponse = await fetch(`/api/users/${userId}/valuation`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            valuationData: JSON.stringify(valuationData)
          }),
        });
        
        if (!updateResponse.ok) {
          throw new Error('Error al actualizar la valoración');
        }
      } else {
        // Crear un nuevo usuario propietario con la valoración
        const createUserResponse = await fetch('/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: data.name,
            phone: data.phone,
            role: "propietario",
            last_valuation: JSON.stringify(valuationData)
          }),
        });
        
        const userData = await createUserResponse.json();
        
        if (!userData.success || !userData.user) {
          throw new Error('Error al crear el usuario');
        }
        
        userId = userData.user.id;
      }
      
      // Notificar éxito
      toast({
        title: "¡Valoración guardada!",
        description: "Tu valoración ha sido guardada correctamente.",
      });
      
      // Si hay una función de callback, la llamamos con los datos de valoración y el userId
      if (onValuationComplete) {
        onValuationComplete({
          ...valuationData,
          userId
        });
      } else {
        // Si no hay callback, redirigimos a la página de resultados
        navigate(`/valoracion-resultado/${userId}`);
      }
      
    } catch (error) {
      toast({
        title: "Error al procesar la valoración",
        description: "Por favor, inténtalo de nuevo más tarde.",
        variant: "destructive",
      });
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Avanzar al siguiente paso del formulario
  const nextStep = async () => {
    let fieldsToValidate: Array<keyof ValuationFormValues> = [];
    
    if (currentStep === 1) {
      fieldsToValidate = ["address", "location", "size", "rooms", "propertyType", "condition"];
    }
    
    const result = await form.trigger(fieldsToValidate);
    if (result) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Retroceder al paso anterior
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Card className="w-full shadow-lg border-2 border-blue-200">
      <CardHeader className="bg-blue-50 border-b border-blue-200">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl text-blue-700">
            Detalles de tu propiedad
          </CardTitle>
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 1 ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-600"}`}>1</span>
            <span className="text-gray-400">→</span>
            <span className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 2 ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-600"}`}>2</span>
            <span className="text-gray-400">→</span>
            <span className={`w-8 h-8 rounded-full flex items-center justify-center bg-blue-100 text-blue-600`}>3</span>
          </div>
        </div>
        <CardDescription>
          {currentStep === 1 
            ? "Datos de tu propiedad" 
            : "Tus datos de contacto"}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-blue-700 font-medium mb-2">
                  <Home className="h-5 w-5" />
                  <h3>Información de la propiedad</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dirección</FormLabel>
                        <FormControl>
                          <Input placeholder="Calle, número, piso..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Barrio/Zona</FormLabel>
                        <FormControl>
                          <Select 
                            value={field.value} 
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona zona" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Vista Alegre">Vista Alegre</SelectItem>
                              <SelectItem value="Santa María de Gracias">Santa María de Gracias</SelectItem>
                              <SelectItem value="La Flota">La Flota</SelectItem>
                              <SelectItem value="Otro">Otro barrio de Murcia</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="size"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Superficie (m²)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            placeholder="Metros cuadrados" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="rooms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Habitaciones</FormLabel>
                        <FormControl>
                          <Select 
                            value={field.value} 
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Nº habitaciones" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 habitación</SelectItem>
                              <SelectItem value="2">2 habitaciones</SelectItem>
                              <SelectItem value="3">3 habitaciones</SelectItem>
                              <SelectItem value="4">4 habitaciones</SelectItem>
                              <SelectItem value="5+">5 o más habitaciones</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="propertyType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de inmueble</FormLabel>
                        <FormControl>
                          <Select 
                            value={field.value} 
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="piso">Piso</SelectItem>
                              <SelectItem value="atico">Ático</SelectItem>
                              <SelectItem value="chalet">Chalet</SelectItem>
                              <SelectItem value="adosado">Adosado</SelectItem>
                              <SelectItem value="otro">Otro</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="condition"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <FormControl>
                          <Select 
                            value={field.value} 
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona estado" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="nuevo">Nuevo/Como nuevo</SelectItem>
                              <SelectItem value="bueno">Buen estado</SelectItem>
                              <SelectItem value="reformar">Para reformar</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}
            
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-blue-700 font-medium mb-2">
                  <Phone className="h-5 w-5" />
                  <h3>Datos de contacto</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre completo</FormLabel>
                        <FormControl>
                          <Input placeholder="Tu nombre y apellidos" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono</FormLabel>
                        <FormControl>
                          <Input placeholder="622 123 456" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="comments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comentarios adicionales (opcional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Añade cualquier detalle relevante sobre tu propiedad..." 
                          rows={3} 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="privacy"
                  render={({ field }) => (
                    <FormItem className="flex items-start space-x-2 space-y-0 pt-2">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm text-gray-600">
                          Acepto la <Link href="/privacidad" className="text-blue-600 hover:underline">Política de Privacidad</Link> y los <Link href="/terminos" className="text-blue-600 hover:underline">Términos y Condiciones</Link>
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-sm text-blue-700 flex items-start gap-2 mt-4">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p>
                    Tu información está segura. Solo utilizaremos tus datos para enviarte 
                    la valoración y no los compartiremos con terceros sin tu consentimiento.
                  </p>
                </div>
              </div>
            )}
            
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-green-700 font-medium mb-2">
                  <CheckCircle2 className="h-5 w-5" />
                  <h3>Resultado de la valoración</h3>
                </div>
                
                <div className="text-center py-4">
                  <div className="text-3xl font-bold text-blue-700 mb-1">
                    {/* Cálculo aproximado basado en los datos ingresados */}
                    {form.getValues("size") && form.getValues("location") ? 
                      `${Math.round(parseInt(form.getValues("size")) * 
                        (form.getValues("location") === "Vista Alegre" ? 1850 : 
                         form.getValues("location") === "Santa María de Gracias" ? 1950 : 
                         form.getValues("location") === "La Flota" ? 2200 : 1700) * 
                        (form.getValues("condition") === "nuevo" ? 1.1 : 
                         form.getValues("condition") === "bueno" ? 1.0 : 0.85) * 
                        (form.getValues("propertyType") === "atico" ? 1.15 : 
                         form.getValues("propertyType") === "chalet" ? 1.2 : 
                         form.getValues("propertyType") === "adosado" ? 1.1 : 1.0)).toLocaleString('es-ES')} €` 
                      : "Calculando..."}
                  </div>
                  <p className="text-gray-600">Valoración estimada de tu propiedad</p>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h4 className="font-semibold text-blue-800 mb-2">Detalles de la propiedad</h4>
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <div className="font-medium">Dirección:</div>
                    <div>{form.getValues("address")}</div>
                    
                    <div className="font-medium">Zona:</div>
                    <div>{form.getValues("location")}</div>
                    
                    <div className="font-medium">Superficie:</div>
                    <div>{form.getValues("size")} m²</div>
                    
                    <div className="font-medium">Habitaciones:</div>
                    <div>{form.getValues("rooms")}</div>
                    
                    <div className="font-medium">Tipo de inmueble:</div>
                    <div>{form.getValues("propertyType")}</div>
                    
                    <div className="font-medium">Estado:</div>
                    <div>{form.getValues("condition")}</div>
                  </div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <h4 className="font-semibold text-green-800 mb-2">¿Qué quieres hacer ahora?</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Guarda este resultado y te mostraremos más opciones para tu propiedad.
                  </p>
                </div>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4">
        {currentStep === 1 ? (
          <div className="flex items-center text-sm text-gray-600">
            <LocateFixed className="h-4 w-4 mr-1 text-blue-600" />
            <span>Especializados en Vista Alegre</span>
          </div>
        ) : (
          <Button 
            variant="outline" 
            onClick={prevStep}
          >
            Volver
          </Button>
        )}
        
        {currentStep === 1 ? (
          <Button
            type="button"
            onClick={nextStep}
            className="flex items-center gap-1"
          >
            Continuar
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : currentStep === 2 ? (
          <Button
            type="button"
            onClick={form.handleSubmit(onSubmit)}
            className="flex items-center gap-1"
          >
            Ver resultado
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="button"
            disabled={isSubmitting}
            onClick={form.handleSubmit(onSubmit)}
            className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
          >
            {isSubmitting ? "Procesando..." : "Guardar valoración"}
            {!isSubmitting && <ArrowRight className="h-4 w-4" />}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ValuationForm;