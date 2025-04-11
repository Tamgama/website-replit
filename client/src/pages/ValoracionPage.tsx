import SimpleHeroSection from "@/components/sections/SimpleHeroSection";
import ValuationStepsSection from "@/components/sections/ValuationStepsSection";
import LocalExpertiseSection from "@/components/sections/LocalExpertiseSection";
import ContactSection from "@/components/sections/ContactSection";
import LastValuationsSection from "@/components/sections/LastValuationsSection";
import ValuationFormSection from "@/components/sections/ValuationFormSection";
import { useEffect } from "react";

const ValoracionPage = () => {
  useEffect(() => {
    document.title = "¿Cuánto cuesta mi casa? Valoración inmobiliaria GRATIS en 3 minutos | Promurcia";

    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', 'Inmobiliaria en Murcia especializada en vender viviendas. Valoración GRATIS en 3 minutos. Expertos en Vista Alegre, Santa María de Gracias y La Flota. Descubre cuánto cuesta tu casa sin compromiso con la inmobiliaria líder en Murcia.');

    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', 'inmobiliaria en murcia, vender vivienda, cuánto cuesta mi casa, valoración inmobiliaria Vista Alegre, valoración inmobiliaria Santa María de Gracias, valoración inmobiliaria La Flota, precio vivienda Murcia, inmobiliaria Murcia, valoración gratis 3 minutos');

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'RealEstateAgent',
      'name': 'Promurcia Inmobiliarios',
      'description': 'Inmobiliaria en Murcia especializada en valoración y venta de viviendas en Vista Alegre, Santa María de Gracias y La Flota',
      'url': 'https://promurcia.com',
      'telephone': '+34 622 337 098',
      'email': 'Pro@promurcia.com',
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': 'C/ Maestra Maria Maroto, 6',
        'addressLocality': 'Murcia',
        'addressRegion': 'Vista alegre',
        'postalCode': '30007',
        'addressCountry': 'ES'
      },
      'areaServed': ['Vista Alegre', 'Santa María de Gracias', 'La Flota', 'Murcia'],
      'sameAs': ['https://promurcia.com']
    });
    document.head.appendChild(script);

    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');

      if (anchor) {
        e.preventDefault();
        const targetId = anchor.getAttribute('href');
        if (!targetId || targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.getBoundingClientRect().top + window.scrollY - 80,
            behavior: 'smooth'
          });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  return (
    <>
      <SimpleHeroSection />

      <ValuationFormSection />

      {/* Beneficios visuales */}
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

      {/* Especialización por barrios */}
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

      <LastValuationsSection />
      <ValuationStepsSection />
      <LocalExpertiseSection />
      <ContactSection />
    </>
  );
};

export default ValoracionPage;
