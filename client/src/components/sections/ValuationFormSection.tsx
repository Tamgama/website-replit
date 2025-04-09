import ValuationForm from "@/components/ValuationForm";
import { useLocation } from "wouter";
import { useState } from "react";

interface ValuationFormSectionProps {
  showContactInfo?: boolean;
}

const ValuationFormSection = ({ showContactInfo = true }: ValuationFormSectionProps) => {
  const [, setLocation] = useLocation();
  const [valuationComplete, setValuationComplete] = useState(false);

  // Función que se ejecuta cuando se completa la valoración
  const handleValuationComplete = (valuationData: any) => {
    console.log("Valoración completada:", valuationData);
    setValuationComplete(true);
    
    // Redirigir si tenemos ID de usuario
    if (valuationData.userId) {
      // Esperar un momento para que el usuario vea el mensaje de éxito
      setTimeout(() => {
        setLocation(`/valoracion-resultado/${valuationData.userId}`);
      }, 1500);
    }
  };

  return (
    <section className={showContactInfo ? "py-12 md:py-16 bg-gray-50" : ""}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {showContactInfo && (
            <>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-blue-800 mb-6 text-center">
                Valoración gratuita de tu propiedad
              </h2>
              <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
                Introduce los datos de tu vivienda y recibe una valoración profesional
                basada en el mercado actual de Murcia en solo 3 minutos.
                <span className="block mt-2 text-blue-700 font-medium">Sin compromisos y totalmente gratis.</span>
              </p>
            </>
          )}
          
          <div className="mb-10 bg-white p-6 rounded-lg shadow-lg">
            {/* Formulario de valoración personalizado */}
            <ValuationForm onValuationComplete={handleValuationComplete} />
            
            {valuationComplete && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-green-600 mb-2">
                    ¡Valoración completada!
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Hemos calculado el valor de tu vivienda. Redirigiendo a los resultados...
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {showContactInfo && (
            <div className="text-center mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <p className="text-lg font-medium text-gray-800 mb-2">
                También puedes contactarnos directamente
              </p>
              <p className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4">
                <a href="tel:+34622337098" className="text-blue-600 hover:underline flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  +34 622 337 098
                </a>
                <span className="hidden md:inline text-gray-300">|</span>
                <a href="mailto:Pro@promurcia.com" className="text-blue-600 hover:underline flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  Pro@promurcia.com
                </a>
              </p>
              <p className="text-gray-500 text-sm mt-4">
                C/ Maestra Maria Maroto, 6, Vista Alegre, Murcia
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ValuationFormSection;