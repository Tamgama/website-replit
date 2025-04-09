const IntroductionSection = () => {
  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-primary-dark mb-6">
            ¿Quieres saber cuánto vale tu vivienda en Murcia?
          </h2>
          <div className="prose prose-lg max-w-none">
            <p>
              Somos <strong>Promurcia</strong>, expertos en el mercado inmobiliario murciano. Con nuestra tecnología avanzada, 
              combinamos datos en tiempo real de los principales barrios de Murcia con inteligencia 
              artificial para ofrecerte una valoración precisa <strong>100% gratuita en solo 3 minutos</strong>. ¡Sin coste y sin compromiso!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntroductionSection;
