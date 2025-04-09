import { Map } from "lucide-react";
import { useState } from "react";
import { useEffect, useRef } from "react";
import { Link } from "wouter";

// Datos de estadísticas simplificados
const stats = [
  {
    value: "3",
    label: "Minutos"
  },
  {
    value: "100%",
    label: "Gratis"
  },
  {
    value: "4.8/5",
    label: "Valoración"
  }
];

// Datos de tasaciones recientes (específicas para los barrios solicitados)
const recentValuations = [
  {
    id: 1,
    timeAgo: "hace 4 minutos",
    location: "Vista Alegre, Murcia",
    price: 1532,
    type: "Piso",
    postal: "30007",
    coordinates: { lat: 37.988722, lng: -1.130639 }
  },
  {
    id: 2,
    timeAgo: "hace 6 minutos",
    location: "Santa María de Gracia, Murcia",
    price: 1378,
    type: "Piso",
    postal: "30009",
    coordinates: { lat: 37.994583, lng: -1.129778 }
  },
  {
    id: 3,
    timeAgo: "hace 7 minutos",
    location: "La Flota, Murcia",
    price: 1985,
    type: "Casa",
    postal: "30007",
    coordinates: { lat: 38.002861, lng: -1.116889 }
  },
  {
    id: 4,
    timeAgo: "hace 12 minutos",
    location: "San Miguel, Murcia",
    price: 1650,
    type: "Piso",
    postal: "30009",
    coordinates: { lat: 37.991722, lng: -1.125389 }
  },
  {
    id: 5,
    timeAgo: "hace 18 minutos",
    location: "San Juan, Murcia",
    price: 1420,
    type: "Piso",
    postal: "30011",
    coordinates: { lat: 37.999250, lng: -1.137556 }
  },
  {
    id: 6,
    timeAgo: "hace 23 minutos",
    location: "Vista Alegre, Murcia",
    price: 1895,
    type: "Casa",
    postal: "30007",
    coordinates: { lat: 37.989167, lng: -1.131944 }
  },
  {
    id: 7,
    timeAgo: "hace 25 minutos",
    location: "Santa María de Gracia, Murcia",
    price: 1645,
    type: "Piso",
    postal: "30009",
    coordinates: { lat: 37.995306, lng: -1.131167 }
  },
  {
    id: 8,
    timeAgo: "hace 31 minutos",
    location: "La Flota, Murcia",
    price: 2120,
    type: "Casa",
    postal: "30007",
    coordinates: { lat: 38.004361, lng: -1.118611 }
  }
];

// Componente para crear un mapa estático basado en las coordenadas
const StaticMap = ({ lat, lng }: { lat: number, lng: number }) => {
  return (
    <div className="h-36 w-full overflow-hidden relative">
      {/* Simulación de Google Maps */}
      <div className="absolute inset-0" style={{ backgroundColor: '#e6e6e6' }}>
        {/* Capa base del mapa */}
        <div className="absolute inset-0" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M0 0h10v10H0zm10 10h10v10H10zm10 0h10v10H20zm10 0h10v10H30zm10 0h10v10H40zm10 0h10v10H50zm10 0h10v10H60zm10 0h10v10H70zm10 0h10v10H80zm10 0h10v10H90zm-80 10h10v10h-10zm10 10h10v10H20zm10 0h10v10H30zm10 0h10v10H40zm10 0h10v10H50zm10 0h10v10H60zm10 0h10v10H70zm10 0h10v10H80zm10 0h10v10H90zm-50 10h10v10h-10zm10 10h10v10H50zm10 0h10v10H60zm10 0h10v10H70zm10 0h10v10H80zm10 0h10v10H90z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '50px 50px',
        }} />
        
        {/* Calles al estilo Google Maps */}
        <svg className="absolute inset-0" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
          <path d="M10,30 L90,30" stroke="#ffffff" strokeWidth="3" />
          <path d="M10,50 L90,50" stroke="#ffffff" strokeWidth="4" />
          <path d="M10,70 L90,70" stroke="#ffffff" strokeWidth="3" />
          
          <path d="M30,10 L30,90" stroke="#ffffff" strokeWidth="3" />
          <path d="M50,10 L50,90" stroke="#ffffff" strokeWidth="4" />
          <path d="M70,10 L70,90" stroke="#ffffff" strokeWidth="3" />
          
          {/* Cruces de calles */}
          <rect x="48" y="48" width="4" height="4" fill="#ffffff" />
          <rect x="28" y="48" width="4" height="4" fill="#ffffff" />
          <rect x="68" y="48" width="4" height="4" fill="#ffffff" />
          <rect x="48" y="28" width="4" height="4" fill="#ffffff" />
          <rect x="48" y="68" width="4" height="4" fill="#ffffff" />
        </svg>
        
        {/* Marcador de posición al estilo Google Maps */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <svg width="24" height="36" viewBox="0 0 24 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 0C5.364 0 0 5.364 0 12c0 2.724 0.912 5.244 2.448 7.26L12 36l9.552-16.74C23.088 17.244 24 14.724 24 12c0-6.636-5.364-12-12-12z" fill="#EA4335"/>
              <circle cx="12" cy="12" r="6" fill="white"/>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Elementos de UI de Google Maps */}
      <div className="absolute bottom-1 left-1 flex gap-1">
        <div className="bg-white rounded-sm shadow-sm p-1 text-xs flex items-center">
          <svg className="w-3 h-3 mr-0.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a7 7 0 100 14 7 7 0 000-14zm0 12a5 5 0 100-10 5 5 0 000 10z" clipRule="evenodd"/>
            <path fillRule="evenodd" d="M10 11a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
          </svg>
          <span className="text-gray-600">Maps</span>
        </div>
        <div className="bg-white rounded-sm shadow-sm p-1 text-xs flex items-center">
          <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

const ValuationCard = ({ valuation }: { valuation: typeof recentValuations[0] }) => {
  // Verificar si la ubicación es Vista Alegre para destacarla
  const isVistaAlegre = valuation.location.includes("Vista Alegre");
  
  // Referencias para el efecto de contador incremental
  const priceRef = useRef<HTMLDivElement>(null);
  
  // Efecto de animación para simular actualización en tiempo real
  useEffect(() => {
    const interval = setInterval(() => {
      if (priceRef.current && Math.random() > 0.7) {
        // Efecto de parpadeo
        priceRef.current.classList.add('bg-blue-50');
        setTimeout(() => {
          if (priceRef.current) {
            priceRef.current.classList.remove('bg-blue-50');
          }
        }, 300);
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className={`bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${isVistaAlegre ? 'border-2 border-blue-400 ring-2 ring-blue-200' : ''}`}>
      <div className="relative">
        <StaticMap lat={valuation.coordinates.lat} lng={valuation.coordinates.lng} />
        <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full shadow-sm flex items-center">
          <span className={`${isVistaAlegre ? 'animate-pulse mr-1' : ''}`}>{isVistaAlegre ? '🔥' : ''}</span>
          {valuation.timeAgo}
        </div>
        {isVistaAlegre && (
          <div className="absolute top-2 right-2 bg-yellow-400 text-blue-900 text-xs px-2 py-1 rounded-full shadow-sm font-semibold">
            Vista Alegre
          </div>
        )}
      </div>
      <div className="p-3 sm:p-4">
        <div className="text-xs sm:text-sm font-medium text-blue-700 mb-1 flex items-center">
          {valuation.location.replace(", Murcia", "")}
          {/* Indicador visual de actualización en tiempo real */}
          <div className="flex items-center ml-1">
            <span className="block w-1 h-1 bg-green-500 rounded-full mr-0.5"></span>
          </div>
        </div>
        <div 
          ref={priceRef}
          className={`font-bold text-lg sm:text-xl mb-2 ${isVistaAlegre ? 'text-blue-700' : 'text-blue-600'} transition-colors duration-300 rounded-md px-1`}
        >
          € {valuation.price} / m²
        </div>
        <Link 
          href="#widget"
          className={`block text-center text-sm py-1.5 px-3 rounded-md font-semibold ${isVistaAlegre ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'}`}
        >
          Valorar mi vivienda
        </Link>
      </div>
    </div>
  );
};

const LastValuationsSection = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const valuationsPerPage = 4;
  const totalPages = Math.ceil(recentValuations.length / valuationsPerPage);
  
  const currentValuations = recentValuations.slice(
    currentPage * valuationsPerPage, 
    (currentPage + 1) * valuationsPerPage
  );
  
  const handleNext = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };
  
  const handlePrev = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Estadísticas con diseño mejorado */}
          <div className="grid grid-cols-3 gap-3 md:gap-6 mb-8 md:mb-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center bg-white p-4 sm:p-5 rounded-xl shadow-md border border-blue-100 transform transition-transform hover:scale-105 hover:shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 h-16 w-16 bg-blue-400 rounded-bl-3xl opacity-10 transform rotate-12"></div>
                {/* Añadimos un elemento visual para sugerir tiempo real */}
                {index === 0 && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full shadow">
                    <span className="absolute top-0 right-0 -mt-1 -mr-1 w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                  </div>
                )}
                <div className="relative z-10">
                  <div className={`text-blue-700 text-2xl md:text-4xl font-bold mb-1 flex items-center justify-center`}>
                    {stat.value}
                    {/* Eliminamos la línea vertical que parecía un "1" */}
                  </div>
                  <div className="text-gray-700 text-sm md:text-base">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Título simplificado con mayor énfasis en Vista Alegre */}
          <div className="text-center mb-8 md:mb-10">
            <div className="inline-flex px-4 py-1 bg-blue-50 rounded-full text-blue-700 font-medium text-sm mb-3 border border-blue-200 items-center">
              <div className="flex items-center space-x-1.5 mr-1.5">
                <span className="block w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                <span className="block w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                <span className="block w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
              </div>
              Valoraciones actualizadas
            </div>
            <h2 className="font-heading text-xl md:text-3xl font-bold text-blue-800 mb-2">
              Precios en <span className="text-blue-600 underline decoration-blue-500/30 decoration-4 underline-offset-2">Vista Alegre</span>
            </h2>
            <p className="text-gray-700 text-sm md:text-base max-w-2xl mx-auto">
              Conoce el valor actual de tu vivienda <strong className="text-blue-700">100% GRATIS</strong> y en solo 3 minutos
            </p>
          </div>
          
          {/* Carrusel de valoraciones */}
          <div className="relative px-2 sm:px-4 md:px-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {currentValuations.map((valuation) => (
                <ValuationCard key={valuation.id} valuation={valuation} />
              ))}
            </div>
            
            {/* Controles de navegación */}
            <button 
              onClick={handlePrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 md:-translate-x-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 z-10"
              aria-label="Anterior"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 md:translate-x-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 z-10"
              aria-label="Siguiente"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            {/* Indicadores de página - Para móvil */}
            <div className="flex justify-center mt-4">
              {Array.from({length: totalPages}).map((_, index) => (
                <button 
                  key={index}
                  className={`h-2 w-2 mx-1 rounded-full ${index === currentPage ? 'bg-blue-600' : 'bg-gray-300'}`}
                  onClick={() => setCurrentPage(index)}
                  aria-label={`Página ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LastValuationsSection;