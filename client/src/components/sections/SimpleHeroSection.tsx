import { useLocation } from "wouter";

const SimpleHeroSection = () => {
  const [, setLocation] = useLocation();

  return (
    <section className="bg-white py-8 md:py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center">
          <div className="w-full max-w-xl mx-auto text-center">
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-3 text-blue-800">
              ¿Cuánto vale mi casa en <span className="text-blue-600 underline decoration-blue-500/30 decoration-4 underline-offset-2">Vista Alegre</span>?
            </h1>
            <p className="text-base md:text-xl mb-4 leading-relaxed text-gray-700">
              Valoración <span className="font-bold bg-yellow-100 px-1 rounded">100% GRATUITA</span> de viviendas online en <span className="font-semibold">solo 3 minutos</span>
            </p>
            <div className="mb-6 flex justify-center">
              <span className="inline-flex items-center bg-blue-50 text-blue-700 font-medium rounded-full px-4 py-1 text-sm">
                <svg viewBox="0 0 24 24" className="w-4 h-4 mr-1 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Solo 3 PASOS - 100% ONLINE
              </span>
            </div>
          </div>
          
          {/* Confianza */}
          <div className="w-full max-w-xl mx-auto mt-4 text-center">
            <div className="text-xs text-gray-600">★★★★★ <span className="font-medium">4.6/5</span> basado en <span className="font-medium">900+</span> valoraciones</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SimpleHeroSection;