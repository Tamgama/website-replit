import { useEffect } from "react";
import CustomValuationForm from "@/components/CustomValuationForm";

// Declaraciones globales necesarias para los componentes de Google Maps
declare global {
  interface Window {
    initMap?: () => void;
  }
}

const CustomValuationPage = () => {
  useEffect(() => {
    // Actualizar el título de la página
    document.title = "¿Cuánto vale mi casa? - Tasación gratuita en 3 minutos";
    
    // Cargar la API de Google Maps (enfoque tradicional, no beta)
    const loadGoogleMapsScript = () => {
      if (!document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]')) {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDNz1_vZIExIU_W0vCSo4tq8CWBydG6nsQ&libraries=places&callback=initMap`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }
    };
    
    // Función de inicialización para el mapa
    window.initMap = () => {
      console.log("Google Maps API cargada con éxito");
    };
    
    // Iniciar la carga de Google Maps
    loadGoogleMapsScript();
    
    // Limpiar cuando el componente se desmonte
    return () => {
      window.initMap = () => {}; // Asignar una función vacía en lugar de eliminarla
    };
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <div className="container max-w-2xl mx-auto px-4 py-10">
        <div className="bg-blue-50 rounded-xl p-6 mb-8 shadow-md">
          <CustomValuationForm />
        </div>
        
        {/* Beneficios visibles después del paso 1 */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Rápido</h3>
            <p className="text-gray-600 text-sm">Resultados precisos en solo 3 minutos</p>
          </div>
          
          <div className="text-center p-4">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Gratuito</h3>
            <p className="text-gray-600 text-sm">Sin compromiso ni pagos ocultos</p>
          </div>
          
          <div className="text-center p-4">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Preciso</h3>
            <p className="text-gray-600 text-sm">Basado en datos actuales del mercado</p>
          </div>
        </div>
        
        {/* Especialización en Vista Alegre */}
        <div className="mt-12 bg-blue-50 rounded-lg p-6 shadow-md">
          <h2 className="text-2xl font-bold text-center text-blue-800 mb-6">Especialistas en Vista Alegre</h2>
          <div className="space-y-4">
            <p className="text-gray-700">
              Nuestro sistema está especializado en el mercado inmobiliario de <strong>Vista Alegre, Santa María de Gracias y La Flota</strong> de Murcia, proporcionando valoraciones precisas basadas en transacciones reales.
            </p>
            <p className="text-gray-700">
              A diferencia de otras valoraciones genéricas, nuestro algoritmo considera factores específicos de cada barrio, la evolución de precios en cada calle y las características particulares de tu vivienda.
            </p>
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

export default CustomValuationPage;