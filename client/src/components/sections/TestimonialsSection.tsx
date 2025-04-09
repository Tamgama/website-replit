import { Star, StarHalf } from "lucide-react";

// Datos de testimonios con diferentes barrios de Murcia y valoraciones variadas (3-5 estrellas)
const testimonials = [
  // 5 estrellas
  {
    id: 1,
    name: "Laura García",
    location: "Vista Alegre",
    rating: 5,
    comment: "Gracias a esta inmobiliaria en Murcia descubrí exactamente cuánto cuesta mi casa en Vista Alegre. El precio era asombrosamente preciso y me ayudaron a vender mi vivienda en tiempo récord. ¡100% recomendable!"
  },
  {
    id: 2,
    name: "Antonio Martínez",
    location: "La Flota",
    rating: 4,
    comment: "Excelente inmobiliaria en Murcia. Su herramienta para saber cuánto cuesta mi casa en La Flota fue muy precisa y el proceso para vender mi vivienda fue mucho más fácil con su asesoramiento profesional."
  },
  {
    id: 3,
    name: "Carmen Sánchez",
    location: "San Miguel",
    rating: 5,
    comment: "Cuando necesitaba saber cuánto cuesta mi casa en San Miguel, esta inmobiliaria en Murcia me dio una valoración perfecta. Gracias a ellos pude vender mi vivienda al precio justo en menos de un mes."
  },
  {
    id: 4,
    name: "Javier López",
    location: "Santa María de Gracias",
    rating: 3,
    comment: "Descubrir cuánto cuesta mi casa en Santa María de Gracias fue rápido y sencillo. La inmobiliaria en Murcia me ofreció buenos consejos para vender mi vivienda, aunque el precio fue algo conservador."
  },
  {
    id: 5,
    name: "María Fernández",
    location: "Centro",
    rating: 4,
    comment: "La mejor inmobiliaria en Murcia para saber cuánto cuesta mi casa en el centro histórico. Su valoración precisa y asesoramiento profesional fueron clave para vender mi vivienda a un excelente precio."
  },
  {
    id: 6,
    name: "Pedro Navarro",
    location: "San Juan",
    rating: 5,
    comment: "Quería saber exactamente cuánto cuesta mi casa en San Juan y esta inmobiliaria en Murcia acertó completamente. Su apoyo durante el proceso de vender mi vivienda fue excepcional y muy eficiente."
  },
  {
    id: 7,
    name: "Ana Pérez",
    location: "Vista Alegre",
    rating: 3,
    comment: "Conocer cuánto cuesta mi casa en Vista Alegre fue sencillo con esta inmobiliaria en Murcia. El proceso de valoración fue rápido y me dieron buenas pautas para vender mi vivienda al mejor precio posible."
  },
  {
    id: 8,
    name: "Francisco Hernández",
    location: "Vista Alegre",
    rating: 4,
    comment: "La inmobiliaria en Murcia más precisa para saber cuánto cuesta mi casa en Vista Alegre. Su valoración me permitió establecer el precio correcto y vender mi vivienda mucho más rápido de lo esperado."
  },
  {
    id: 9,
    name: "Elena Gómez",
    location: "San Miguel",
    rating: 3,
    comment: "Esta inmobiliaria en Murcia me ayudó a entender cuánto cuesta mi casa en San Miguel. Su valoración y consejos me dieron la confianza necesaria para tomar decisiones sobre vender mi vivienda."
  },
  {
    id: 10,
    name: "Jorge Ruiz",
    location: "El Carmen",
    rating: 5,
    comment: "Valoración inmobiliaria 100% profesional y precisa. En solo 3 minutos tuve una tasación detallada de mi piso en El Carmen que me ayudó a negociar mejor la venta. El mejor servicio de valoración en Murcia."
  },
  {
    id: 11,
    name: "Lucía Martínez",
    location: "Espinardo",
    rating: 4,
    comment: "Promurcia me ofreció una tasación detallada de mi dúplex en Espinardo. El valor estimado estaba bien fundamentado con datos comparativos del mercado inmobiliario de Murcia. Muy recomendable."
  },
  {
    id: 12,
    name: "Roberto Sánchez",
    location: "Santiago el Mayor",
    rating: 3,
    comment: "Servicio correcto de valoración de viviendas. El precio estimado para mi piso en Santiago el Mayor fue algo conservador, pero ofrecen datos útiles sobre el mercado inmobiliario en Murcia."
  },
  {
    id: 13,
    name: "Isabel Fernández",
    location: "Infante Juan Manuel",
    rating: 5,
    comment: "¡Valoración gratuita increíblemente precisa! El precio que me dieron para mi vivienda en Infante Juan Manuel coincidió casi exactamente con la tasación bancaria. Promurcia conoce el mercado de Murcia como nadie."
  },
  {
    id: 14,
    name: "Alejandro Torres",
    location: "San Antón",
    rating: 4,
    comment: "Muy contentos con la valoración inmobiliaria de nuestro piso en San Antón. El servicio gratuito de Promurcia nos dio una referencia clara del valor actual del inmueble en el mercado murciano."
  },
  {
    id: 15,
    name: "Cristina López",
    location: "La Alberca",
    rating: 3,
    comment: "Valoración rápida y gratuita para mi casa en La Alberca. La estimación era menor de lo que esperaba, pero los datos comparativos del mercado inmobiliario de Murcia me resultaron útiles."
  },
  {
    id: 16,
    name: "Manuel García",
    location: "Santa Eulalia",
    rating: 5,
    comment: "¡Servicio de tasación inmobiliaria excelente! Con Promurcia obtuve el precio exacto de mercado para mi ático en Santa Eulalia en solo 3 minutos. Imprescindible si quieres vender en Murcia."
  },
  {
    id: 17,
    name: "Sofía Martínez",
    location: "Santo Domingo",
    rating: 4,
    comment: "Promurcia me proporcionó una valoración detallada de mi vivienda en Santo Domingo. Los datos específicos del barrio me ayudaron a entender mejor el mercado inmobiliario actual en Murcia."
  },
  {
    id: 18,
    name: "David Navarro",
    location: "Los Dolores",
    rating: 3,
    comment: "La valoración inmobiliaria gratuita me dio una idea aproximada del precio de mi casa en Los Dolores. El servicio es básico pero funcional para quien busca una referencia del mercado en Murcia."
  },
  {
    id: 19,
    name: "Marta Sánchez",
    location: "Puente Tocinos",
    rating: 5,
    comment: "Increíble precisión en la valoración de mi chalet en Puente Tocinos. Promurcia conoce perfectamente los precios del mercado inmobiliario en cada barrio de Murcia. 100% recomendable."
  },
  {
    id: 20,
    name: "Carlos Hernández",
    location: "El Ranero",
    rating: 4,
    comment: "Muy satisfecho con la tasación inmobiliaria gratuita de mi vivienda en El Ranero. Promurcia ofrece un servicio serio y profesional, con datos actualizados del mercado de Murcia."
  },
  {
    id: 21,
    name: "Patricia Gómez",
    location: "San Basilio",
    rating: 3,
    comment: "Valoración correcta para mi piso en San Basilio. El precio estimado por Promurcia era algo conservador, pero el análisis del mercado inmobiliario en Murcia me resultó interesante."
  },
  {
    id: 22,
    name: "Fernando Ruiz",
    location: "San Andrés",
    rating: 5,
    comment: "La mejor valoración inmobiliaria en Murcia. El informe gratuito que recibí para mi vivienda en San Andrés incluía datos muy específicos del barrio y tendencias de precios. Excelente servicio."
  },
  {
    id: 23,
    name: "Alicia Torres",
    location: "Vista Alegre",
    rating: 4,
    comment: "Probé varios servicios de valoración y Promurcia fue el más preciso para mi piso en Vista Alegre. Su conocimiento del mercado inmobiliario en Murcia es impresionante."
  },
  {
    id: 24,
    name: "Raúl Martínez",
    location: "La Paz",
    rating: 3,
    comment: "Servicio de tasación inmobiliaria básico pero eficiente para mi apartamento en La Paz. La valoración gratuita me sirvió como primera referencia para conocer el precio en el mercado de Murcia."
  },
  {
    id: 25,
    name: "Eva García",
    location: "San Antolín",
    rating: 5,
    comment: "¡Valoración perfecta! El precio que me dio Promurcia para mi casa en San Antolín fue exactamente el que conseguí al vender. Conocen cada calle y cada tendencia del mercado inmobiliario murciano."
  },
  {
    id: 26,
    name: "Hugo Sánchez",
    location: "Santiago y Zaraiche",
    rating: 4,
    comment: "La valoración gratuita de mi vivienda en Santiago y Zaraiche fue muy profesional. Promurcia analiza datos reales del mercado inmobiliario en Murcia para dar precios ajustados a la realidad."
  },
  {
    id: 27,
    name: "Beatriz López",
    location: "La Flota",
    rating: 3,
    comment: "La valoración de mi piso en La Flota fue rápida. Aunque el precio me pareció algo bajo, el informe incluía datos interesantes sobre la evolución del mercado inmobiliario en Murcia."
  },
  {
    id: 28,
    name: "Pablo Fernández",
    location: "La Fama",
    rating: 5,
    comment: "Increíble servicio de valoración inmobiliaria en Murcia. El informe gratuito que recibí para mi dúplex en La Fama fue muy completo y me ayudó a fijar el precio ideal para vender rápido."
  },
  {
    id: 29,
    name: "Diana Navarro",
    location: "San Miguel",
    rating: 4,
    comment: "Muy buena experiencia con la tasación gratuita de mi ático en San Miguel. Promurcia ofrece un servicio profesional con datos actualizados del mercado inmobiliario en Murcia."
  },
  {
    id: 30,
    name: "Nicolás Martínez",
    location: "Santa María de Gracias",
    rating: 3,
    comment: "La valoración inmobiliaria de mi piso en Santa María de Gracias me dio una idea aproximada del precio. El servicio gratuito de Promurcia es útil como punto de partida para entender el mercado en Murcia."
  }
];

// Componente para mostrar las estrellas según la valoración
const RatingStars = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  
  return (
    <div className="flex">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
      ))}
      {hasHalfStar && <StarHalf className="w-5 h-5 fill-yellow-400 text-yellow-400" />}
      {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
        <Star key={i} className="w-5 h-5 text-gray-300" />
      ))}
    </div>
  );
};

const TestimonialsSection = () => {
  // Mostrar 9 testimonios en la sección principal para más densidad de keywords SEO
  const displayedTestimonials = testimonials.slice(0, 9);
  
  return (
    <section className="py-12 md:py-16 bg-gray-50" id="testimonios">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-[#5A5A5A] mb-3 text-center">
            Opiniones sobre nuestra inmobiliaria en Murcia
          </h2>
          <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
            Más de 500 propietarios en Murcia ya han descubierto cuánto cuesta su casa y cómo vender su vivienda.
            Esto es lo que opinan de nuestra inmobiliaria especializada en Murcia.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedTestimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white rounded-lg shadow-md p-6">
                <RatingStars rating={testimonial.rating} />
                <p className="mt-4 text-gray-700 italic">"{testimonial.comment}"</p>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="font-semibold text-orange-700">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.location}, Murcia</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-10 text-center">
            <p className="text-sm text-gray-500">
              Basado en más de 500 clientes que han utilizado nuestra inmobiliaria en Murcia para saber cuánto cuesta su casa
              en barrios como Vista Alegre, Santa María de Gracias, San Miguel, San Juan y La Flota.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Promurcia es la inmobiliaria líder en Murcia para valorar y vender viviendas al mejor precio.
              Servicio 100% gratuito con resultados en solo 3 minutos.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;