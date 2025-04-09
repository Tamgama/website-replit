import { Link } from "wouter";
import { Home, Calculator, Clock3 } from "lucide-react";

interface WidgetPlaceholderProps {
  onStartValuation?: () => void;
}

const WidgetPlaceholder = ({ onStartValuation }: WidgetPlaceholderProps) => {
  return (
    <section id="widget" className="py-8 md:py-16 bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="bg-white border-2 border-blue-200 rounded-xl p-4 sm:p-8 max-w-3xl mx-auto shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 h-24 w-24 bg-blue-600 rounded-bl-3xl opacity-10 transform rotate-12"></div>
          <div className="absolute bottom-0 left-0 h-32 w-32 bg-blue-400 rounded-tr-3xl opacity-10 transform -rotate-12"></div>
          <div className="text-center space-y-4 sm:space-y-6 relative z-10">
            <div className="inline-flex px-4 py-1 bg-blue-50 rounded-full text-blue-700 font-medium text-sm mb-2 sm:mb-4 border border-blue-200 items-center">
              <div className="flex items-center space-x-1.5 mr-2">
                <span className="block w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                <span className="block w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
              </div>
              Inmobiliaria en Murcia - Valoración GRATIS
            </div>
            <div className="flex justify-center">
              <Calculator className="h-12 w-12 sm:h-16 sm:w-16 text-blue-600" />
            </div>
            <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold text-blue-800">
              ¿Cuánto cuesta mi casa en <strong className="text-blue-600 underline decoration-blue-500/30 decoration-2 underline-offset-2">Vista Alegre</strong>? Valoración <strong className="bg-yellow-100 px-1 rounded">100% GRATUITA</strong>
            </h2>
            <p className="text-gray-700 text-sm sm:text-base max-w-2xl mx-auto">
              Como <strong>inmobiliaria en Murcia</strong> especializada en <strong>vender vivienda</strong> al mejor precio.
              Descubre <strong>cuánto cuesta tu casa</strong> en <strong className="text-blue-700">Vista Alegre</strong>, Santa María de Gracias y La Flota.
              <strong className="text-blue-700"> Solo 3 minutos GRATIS</strong>.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-2xl mx-auto mt-6 relative">
              {/* Línea de conexión entre los pasos */}
              <div className="hidden sm:block absolute top-1/2 left-0 w-full h-0.5 bg-blue-100 -z-10"></div>
              
              <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md border border-blue-100 transform transition-transform hover:scale-105 hover:shadow-lg relative">
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">1</div>
                <div className="flex justify-center mb-2">
                  <Home className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold">Datos de tu inmueble</h3>
                <p className="text-xs sm:text-sm text-gray-600"><strong className="text-blue-700">Vista Alegre</strong>, Santa María de Gracias, La Flota</p>
              </div>
              
              <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md border border-blue-100 transform transition-transform hover:scale-105 hover:shadow-lg relative">
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">2</div>
                <div className="flex justify-center mb-2">
                  <Calculator className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold">Valoración precisa</h3>
                <p className="text-xs sm:text-sm text-gray-600">Por la inmobiliaria líder en Murcia</p>
              </div>
              
              <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md border border-blue-100 transform transition-transform hover:scale-105 hover:shadow-lg relative">
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">3</div>
                <div className="flex justify-center mb-2">
                  <Clock3 className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold flex items-center justify-center">
                  Solo 3 minutos
                  <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full ml-1.5 animate-pulse"></span>
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">Obtén la información al instante</p>
              </div>
            </div>
            
            <div className="pt-6 sm:pt-8">
              <div className="relative inline-block group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-200"></div>
                <button 
                  onClick={onStartValuation}
                  className="relative inline-block py-4 px-8 sm:px-10 bg-blue-600 text-white font-heading font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 text-sm sm:text-base shadow-md hover:shadow-lg transform hover:-translate-y-1"
                >
                  <span className="realtime-indicator">VALORAR MI VIVIENDA GRATIS</span>
                </button>
              </div>
              <p className="text-xs text-gray-600 mt-3 max-w-xs mx-auto">
                <span className="text-blue-700 font-semibold">Expertos inmobiliarios en Vista Alegre</span> - Resultados en 3 minutos
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WidgetPlaceholder;
