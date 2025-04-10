import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useLocation } from "wouter";
import { BuildingIcon, HomeIcon, UserIcon } from "lucide-react";

// Esquema extendido del formulario de registro
const registerFormSchema = z.object({
  phone: z.string().min(9, { message: "El número de teléfono debe tener al menos 9 dígitos" }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
  confirmPassword: z.string().min(6, { message: "La confirmación de contraseña es requerida" }),
  name: z.string().optional(),
  // El email se ha eliminado según solicitud del cliente
  // El rol siempre será propietario
  role: z.literal("propietario"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerFormSchema>;

const RegisterPage = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, setLocation] = useLocation();

  // Apply SEO metadata
  document.title = "Registro | Promurcia Inmobiliarios";

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      phone: "",
      password: "",
      confirmPassword: "",
      name: "",
      role: "propietario",
    },
  });

  // Ya no necesitamos vigilar el rol, ya que siempre será propietario

  const onSubmit = async (data: RegisterFormValues) => {
    setIsSubmitting(true);
    try {
      // Excluye confirmPassword del envío al servidor
      const { confirmPassword, ...registerData } = data;
      
      // Registrar al usuario
      const response = await apiRequest("POST", "/api/register", registerData);
      
      // Guardar los datos del usuario en localStorage si están disponibles
      if (response && typeof response === 'object' && 'user' in response) {
        localStorage.setItem("user", JSON.stringify(response.user));
      }
      
      toast({
        title: "Registro exitoso",
        description: "Tu cuenta ha sido creada correctamente",
      });
      
      // Iniciar sesión automáticamente después del registro
      try {
        const loginResponse = await apiRequest("POST", "/api/login", {
          phone: registerData.phone,
          password: registerData.password
        });
        
        // Guardar los datos actualizados del usuario después del login
        if (loginResponse && typeof loginResponse === 'object' && 'user' in loginResponse) {
          localStorage.setItem("user", JSON.stringify(loginResponse.user));
        }
        
        // Siempre redirigir a la página de ventas confidenciales
        setLocation("/ventas-secretas");
      } catch (error) {
        // Si falla el inicio de sesión automático, redirigir al login
        setLocation("/login");
      }
    } catch (error) {
      toast({
        title: "Error al registrarse",
        description: "No se pudo crear la cuenta. Intenta con otro número de teléfono.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-16 flex items-center justify-center bg-gray-50">
      <div className="container px-4">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-heading font-bold text-center text-primary-dark">
                Crear Cuenta de Propietario
              </CardTitle>
              <CardDescription className="text-center">
                Regístrate para valorar tu propiedad o acceder a oportunidades exclusivas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {/* Usuario propietario (oculto) */}
                  <input type="hidden" {...form.register("role")} value="propietario" />
                  
                  {/* Campos básicos */}
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Introduce tu número de teléfono" 
                            type="tel" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Nombre (opcional) */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Nombre
                          <span className="text-gray-500 text-xs ml-1">(opcional)</span>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Tu nombre y apellidos" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Email eliminado a petición del cliente */}
                  
                  {/* Contraseñas */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contraseña</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="Elige una contraseña" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirmar Contraseña</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="Confirma tu contraseña" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 shadow-md"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Registrando..." : "CREAR CUENTA"}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <div className="text-sm text-center text-gray-500">
                <span>¿Ya tienes una cuenta? </span>
                <a href="/login" className="text-primary hover:underline">
                  Iniciar sesión
                </a>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;