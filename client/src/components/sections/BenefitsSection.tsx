import { TrendingUp, RefreshCw, ThumbsUp, CheckCircle } from "lucide-react";

const BenefitsSection = () => {
  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-primary-dark mb-10 text-center">
            Beneficios de Nuestra Valoración Especializada en Murcia
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Benefit 1 */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-start">
                <TrendingUp className="h-6 w-6 text-orange-500 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="font-heading text-xl font-semibold mb-3 text-primary-dark">
                    Análisis de datos exhaustivo
                  </h3>
                  <p className="text-gray-600">
                    Analizamos más de 3.000 datos del mercado murciano, incluyendo precios por m² en barrios
                    específicos como Vista Alegre, Santa María de Gracias y San Miguel.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Benefit 2 */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-start">
                <RefreshCw className="h-6 w-6 text-orange-500 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="font-heading text-xl font-semibold mb-3 text-primary-dark">
                    Actualizaciones diarias
                  </h3>
                  <p className="text-gray-600">
                    Actualización diaria con transacciones reales de la Región de Murcia para ofrecerte 
                    siempre los datos más precisos.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Benefit 3 */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-start">
                <ThumbsUp className="h-6 w-6 text-orange-500 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="font-heading text-xl font-semibold mb-3 text-primary-dark">
                    Recomendaciones personalizadas
                  </h3>
                  <p className="text-gray-600">
                    Recibe recomendaciones personalizadas para vender o alquilar tu propiedad en Murcia
                    basadas en las tendencias actuales del mercado.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Benefit 4 */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-orange-500 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="font-heading text-xl font-semibold mb-3 text-primary-dark">
                    Precisión verificada
                  </h3>
                  <p className="text-gray-600">
                    95% de precisión verificada por agentes inmobiliarios murcianos con años de experiencia 
                    en el mercado local.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
