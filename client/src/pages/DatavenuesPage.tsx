import { useEffect } from "react";

const DatavenuesPage = () => {
  useEffect(() => {
    // Actualizar el título de la página
    document.title = "¿Cuánto vale mi casa en Vista Alegre? - Valoración Gratuita";
    
    // Cargar el script de Datavenues
    const script = document.createElement('script');
    script.src = "https://app.datavenues.com/js/datavenues.js?tkn=0195ccfb-f469-7b88-90bf-abbeb5604dfd&target=dv-widget&locale=es&color=%23FFAB00&alt";
    script.async = true;
    
    // Añadir el script al documento
    document.body.appendChild(script);
    
    // Limpieza al desmontar el componente
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);
  
  return (
    <div className="bg-white min-h-screen">
      <header className="text-center py-10 bg-gray-50">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-800 mb-3">
          ¿Cuánto vale mi casa en Vista Alegre?
        </h1>
        <p className="text-lg text-gray-700">
          Valoración <span className="font-bold bg-yellow-100 px-1 rounded">100% gratuita</span> de viviendas online en solo 3 minutos
        </p>
      </header>

      <div className="container max-w-2xl mx-auto px-4 py-10">
        {/* Contenedor donde se inyectará el formulario de Datavenues */}
        <div id="dv-widget" className="bg-white rounded-lg shadow-lg p-6"></div>
        
        {/* Indicadores de confianza */}
        <div className="mt-6 text-center">
          <div className="text-sm text-gray-600 mb-2">★★★★★ <span className="font-medium">4.6/5</span> basado en <span className="font-medium">900+</span> valoraciones</div>
          <p className="text-xs text-gray-500">
            Especialistas en el mercado inmobiliario de Murcia desde 2010
          </p>
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

export default DatavenuesPage;