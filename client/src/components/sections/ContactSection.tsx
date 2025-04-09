import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
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

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "El nombre es requerido" }),
  phone: z.string().min(9, { message: "Introduce un número de teléfono válido" }),
  location: z.string().min(2, { message: "La ubicación es requerida" }),
  message: z.string().min(10, { message: "El mensaje debe tener al menos 10 caracteres" }),
  privacy: z.boolean().refine((val) => val === true, { message: "Debes aceptar la política de privacidad" }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const ContactSection = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      location: "",
      message: "",
      privacy: false,
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/contact", data);
      toast({
        title: "Mensaje enviado",
        description: "Nos pondremos en contacto contigo lo antes posible.",
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Error al enviar",
        description: "Por favor, inténtalo de nuevo más tarde.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-primary-dark mb-8 text-center">
            ¿Necesitas más información?
          </h2>
          <div className="text-center mb-6">
            <p className="text-lg">
              <strong>Promurcia Inmobiliarios</strong><br />
              C/ Maestra Maria Maroto, 6, Vista Alegre, Murcia<br />
              <a href="mailto:Pro@promurcia.com" className="text-primary hover:underline">Pro@promurcia.com</a> | 
              <a href="tel:+34622337098" className="text-primary hover:underline"> +34 622 337 098</a>
            </p>
          </div>
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre completo</FormLabel>
                        <FormControl>
                          <Input placeholder="Introduce tu nombre" {...field} />
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
                          <Input placeholder="612 345 678" {...field} />
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
                        <FormLabel>Ubicación de la propiedad</FormLabel>
                        <FormControl>
                          <Input placeholder="Barrio/Zona en Murcia" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mensaje</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Cuéntanos qué necesitas..." 
                          rows={4} 
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
                    <FormItem className="flex items-start space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm text-gray-600">
                          Acepto la <Link href="/privacidad" className="text-primary hover:underline">Política de Privacidad</Link> y los <Link href="/terminos" className="text-primary hover:underline">Términos y Condiciones</Link>
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                <div className="text-center pt-2">
                  <Button 
                    type="submit" 
                    className="py-3 px-8 bg-orange-500 hover:bg-orange-600"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Enviando..." : "Enviar consulta"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
