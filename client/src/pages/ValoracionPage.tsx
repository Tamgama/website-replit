import SimpleHeroSection from "@/components/sections/SimpleHeroSection";
import ValuationStepsSection from "@/components/sections/ValuationStepsSection";
import LocalExpertiseSection from "@/components/sections/LocalExpertiseSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import ContactSection from "@/components/sections/ContactSection";
import LastValuationsSection from "@/components/sections/LastValuationsSection";
import { useEffect } from "react";

const ValoracionPage = () => {
  // Apply additional SEO tags
  useEffect(() => {
    // Update title with location and service for SEO
    document.title = "¿Cuánto cuesta mi casa? Valoración inmobiliaria GRATIS en 3 minutos | Promurcia";
    
    // Update meta description with rich keywords
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', 'Inmobiliaria en Murcia especializada en vender viviendas. Valoración GRATIS en 3 minutos. Expertos en Vista Alegre, Santa María de Gracias y La Flota. Descubre cuánto cuesta tu casa sin compromiso con la inmobiliaria líder en Murcia.');
    
    // Update keywords with focus on property valuation in Murcia
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', 'inmobiliaria en murcia, vender vivienda, cuánto cuesta mi casa, valoración inmobiliaria Vista Alegre, valoración inmobiliaria Santa María de Gracias, valoración inmobiliaria La Flota, precio vivienda Murcia, inmobiliaria Murcia, valoración gratis 3 minutos');
    
    // Add structured data for Real Estate Agent
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
    
    // Handle smooth scroll for anchor links
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
            top: targetElement.getBoundingClientRect().top + window.scrollY - 80, // Adjust for header height
            behavior: 'smooth'
          });
        }
      }
    };
    
    document.addEventListener('click', handleAnchorClick);
    
    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);
  
  return (
    <>
      {/* Hero section con el widget integrado */}
      <SimpleHeroSection />
      
      {/* Otras secciones importantes */}
      <LastValuationsSection />
      <ValuationStepsSection />
      <TestimonialsSection />
      <LocalExpertiseSection />
      <ContactSection />
    </>
  );
};

export default ValoracionPage;