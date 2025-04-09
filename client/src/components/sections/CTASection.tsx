import { Link } from "wouter";

const CTASection = () => {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-primary-dark to-primary">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-6">
            ¿Listo para conocer el valor de tu propiedad en Murcia?
          </h2>
          <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Obtén una valoración <strong>100% GRATUITA</strong> y precisa en solo 3 minutos utilizando nuestro sistema basado en inteligencia artificial 
            y datos reales de todos los barrios de Murcia. ¡Lo sabrás al instante!
          </p>
          <Link href="#widget" className="inline-block py-3 px-8 bg-white text-primary font-heading font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200 shadow-lg transform hover:-translate-y-1 hover:shadow-xl">
            Valora Tu Vivienda Ahora →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
