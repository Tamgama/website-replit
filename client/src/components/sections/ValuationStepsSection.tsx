import { Link } from "wouter";
import { MapPin, Home, BarChart } from "lucide-react";

const ValuationStepsSection = () => {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-orange-700 mb-10 text-center">
            ¿Cuánto vale mi casa? Valoración <strong>100% GRATIS en solo 3 minutos</strong> con 3 Simples Pasos
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-md relative">
              <div className="absolute -top-5 -left-5 w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-heading font-bold text-xl">
                1
              </div>
              <h3 className="font-heading text-xl font-semibold mb-4 mt-2 text-orange-700">
                Indica la ubicación
              </h3>
              <p className="text-gray-600">
                Proporciona la ubicación exacta de tu propiedad en Murcia 
                <span className="font-medium"> (Vista Alegre, Santa María de Gracias, San Miguel, San Juan, La Flota)</span>
              </p>
              <div className="mt-4">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-md relative">
              <div className="absolute -top-5 -left-5 w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-heading font-bold text-xl">
                2
              </div>
              <h3 className="font-heading text-xl font-semibold mb-4 mt-2 text-orange-700">
                Describe tu vivienda
              </h3>
              <p className="text-gray-600">
                Indica las características de tu inmueble 
                <span className="font-medium"> (m², habitaciones, estado de conservación)</span>
              </p>
              <div className="mt-4">
                <Home className="h-6 w-6 text-primary" />
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-md relative">
              <div className="absolute -top-5 -left-5 w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-heading font-bold text-xl">
                3
              </div>
              <h3 className="font-heading text-xl font-semibold mb-4 mt-2 text-orange-700 flex items-center">
                Recibe tu informe
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full ml-2 animate-pulse"></span>
              </h3>
              <p className="text-gray-600">
                Obtén tu informe con precio de mercado <strong>en solo 3 minutos, 100% GRATIS</strong>, con tendencias en Murcia y comparativas por barrios
              </p>
              <div className="mt-4">
                <BarChart className="h-6 w-6 text-primary" />
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link 
              href="#widget" 
              className="inline-block py-3 px-8 bg-orange-500 text-white font-heading font-semibold rounded-lg hover:bg-orange-600 transition-colors duration-200 shadow-md"
            >
              <span className="realtime-indicator">Valora Tu Vivienda en Murcia Ahora →</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValuationStepsSection;
