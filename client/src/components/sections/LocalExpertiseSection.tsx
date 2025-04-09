import { MapPin } from "lucide-react";

const locations = [
  "Vista Alegre",
  "Santa María de Gracias",
  "San Miguel",
  "San Juan",
  "La Flota",
  "Centro histórico"
];

const LocalExpertiseSection = () => {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-primary-light rounded-lg p-8 text-white shadow-lg">
            <h2 className="font-heading text-2xl md:text-3xl font-bold mb-6">
              Conocimiento Experto del Mercado Murciano
            </h2>
            <p className="mb-6 text-lg leading-relaxed">
              En Murcia, el precio de un piso en Vista Alegre puede variar hasta un 20% frente a zonas 
              como La Flota o San Juan. Nuestro sistema detecta estas diferencias al instante, 
              considerando las particularidades de cada barrio murciano para una valoración precisa y gratuita.
            </p>
            <div className="grid md:grid-cols-2 gap-4 mt-8">
              {locations.map((location, index) => (
                <div key={index} className="bg-white bg-opacity-20 rounded-lg px-4 py-3 flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{location}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocalExpertiseSection;
