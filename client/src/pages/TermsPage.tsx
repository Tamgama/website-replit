import { useEffect } from "react";

const TermsPage = () => {
  useEffect(() => {
    document.title = "Términos y Condiciones | Promurcia";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary-dark mb-8">
            Términos y Condiciones
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <p>
              <strong>Última actualización:</strong> 21 de marzo de 2023
            </p>
            
            <h2>1. Introducción</h2>
            <p>
              Bienvenido a Promurcia Inmobiliarios (en adelante, "Promurcia"). Estos Términos y Condiciones rigen su acceso y uso 
              de nuestro sitio web promurcia.com, incluyendo todos los contenidos, funcionalidades y servicios ofrecidos en o a 
              través de nuestro sitio web.
            </p>
            <p>
              Al acceder o utilizar nuestro sitio web, usted acepta estar sujeto a estos Términos y Condiciones. Si no está de 
              acuerdo con alguna parte de estos términos, no podrá acceder al sitio web ni utilizar nuestros servicios.
            </p>
            
            <h2>2. Definiciones</h2>
            <p>En estos Términos y Condiciones:</p>
            <ul>
              <li>"Cliente", "Usted" y "Su" se refiere a la persona que accede o utiliza nuestro sitio web, o a la empresa u otra entidad legal en cuyo nombre dicha persona está accediendo o utilizando nuestro sitio web.</li>
              <li>"Promurcia", "Nosotros", "Nos" y "Nuestro" se refiere a Promurcia Inmobiliarios.</li>
              <li>"Parte" se refiere tanto al Cliente como a nosotros, o a cualquiera de los dos según el contexto.</li>
              <li>"Servicios" se refiere a los servicios ofrecidos por Promurcia, incluyendo pero no limitado a valoraciones inmobiliarias, asesoramiento en la compra, venta o alquiler de propiedades en Murcia.</li>
              <li>"Sitio web" se refiere a promurcia.com.</li>
            </ul>
            
            <h2>3. Servicio de valoración inmobiliaria</h2>
            <p>
              Promurcia ofrece un servicio de valoración inmobiliaria en Murcia, especialmente en las áreas de Vista Alegre, Santa María de Gracias, San Miguel, San Juan y La Flota. Este servicio se proporciona de forma gratuita a través de nuestro sitio web.
            </p>
            <p>
              Las valoraciones proporcionadas son estimaciones basadas en datos del mercado inmobiliario actual, características de la propiedad y ubicación. Estas valoraciones son orientativas y no constituyen una valoración oficial con validez legal o fiscal.
            </p>
            <p>
              Promurcia no garantiza la exactitud de las valoraciones y no aceptará ninguna responsabilidad por decisiones tomadas basándose únicamente en la información proporcionada a través de nuestro servicio de valoración.
            </p>
            
            <h2>4. Uso del sitio web</h2>
            <p>
              Al utilizar nuestro sitio web, usted acepta:
            </p>
            <ul>
              <li>No utilizar nuestro sitio web de ninguna manera que pueda dañar, desactivar, sobrecargar o deteriorar el sitio.</li>
              <li>No utilizar ningún robot, spider u otro dispositivo automático, proceso o medio para acceder a nuestro sitio web para cualquier propósito, incluido el monitoreo o la copia de cualquier material en nuestro sitio web.</li>
              <li>No utilizar nuestro sitio web para transmitir o distribuir virus informáticos u otro código malicioso.</li>
              <li>No intentar obtener acceso no autorizado a partes de nuestro sitio web, el servidor que aloja nuestro sitio o cualquier servidor, computadora o base de datos conectada a nuestro sitio web.</li>
              <li>Proporcionar información precisa y actualizada al utilizar nuestros formularios o servicios.</li>
            </ul>
            
            <h2>5. Propiedad intelectual</h2>
            <p>
              Nuestro sitio web y todo su contenido, características y funcionalidades (incluyendo pero no limitado a toda la información, software, texto, imágenes, marcas, logotipos y diseño) son propiedad de Promurcia o de sus licenciantes y están protegidos por leyes españolas e internacionales de derechos de autor, marca registrada, patente, secreto comercial y otra propiedad intelectual o derechos de propiedad.
            </p>
            <p>
              Se le concede un derecho limitado, no exclusivo, intransferible y revocable para usar nuestro sitio web únicamente para sus fines personales y no comerciales, sujeto a estos Términos y Condiciones.
            </p>
            
            <h2>6. Limitación de responsabilidad</h2>
            <p>
              En la medida permitida por la ley aplicable, Promurcia, sus empleados, agentes, directores y representantes no serán responsables por cualquier pérdida o daño, incluyendo pero no limitado a pérdida o daño indirecto o consecuente, o cualquier pérdida o daño que surja de la pérdida de datos o beneficios que surjan de o en conexión con el uso de nuestro sitio web.
            </p>
            <p>
              La información proporcionada en nuestro sitio web es solo para fines informativos generales. Aunque nos esforzamos por mantener la información actualizada y correcta, no hacemos ninguna representación o garantía de ningún tipo, expresa o implícita, sobre la integridad, precisión, fiabilidad, idoneidad o disponibilidad del sitio web o la información, productos, servicios o gráficos relacionados contenidos en el sitio web para cualquier propósito.
            </p>
            
            <h2>7. Indemnización</h2>
            <p>
              Usted acepta defender, indemnizar y mantener indemne a Promurcia, sus afiliados, licenciantes y proveedores de servicios, y sus respectivos funcionarios, directores, empleados, contratistas, agentes, licenciantes, proveedores, sucesores y cesionarios de y contra cualquier reclamación, responsabilidad, daño, juicio, premio, pérdida, costo, gasto o tarifa (incluyendo honorarios razonables de abogados) que surjan de o estén relacionados con su violación de estos Términos y Condiciones.
            </p>
            
            <h2>8. Ley aplicable y jurisdicción</h2>
            <p>
              Estos Términos y Condiciones se regirán e interpretarán de acuerdo con las leyes de España, sin tener en cuenta sus disposiciones sobre conflictos de leyes.
            </p>
            <p>
              Cualquier disputa, controversia o reclamación que surja de o en conexión con estos Términos y Condiciones, o el incumplimiento, terminación o invalidez de los mismos, será resuelta por los tribunales competentes de Murcia, España.
            </p>
            
            <h2>9. Cambios a estos términos</h2>
            <p>
              Nos reservamos el derecho, a nuestra sola discreción, de modificar o reemplazar estos Términos y Condiciones en cualquier momento. Si una revisión es material, intentaremos proporcionar un aviso de al menos 30 días antes de que los nuevos términos entren en vigor. Lo que constituye un cambio material será determinado a nuestra sola discreción.
            </p>
            <p>
              Al continuar accediendo o utilizando nuestro sitio web después de que las revisiones entren en vigor, usted acepta estar sujeto a los términos revisados. Si no está de acuerdo con los nuevos términos, deje de usar el sitio web.
            </p>
            
            <h2>10. Contacto</h2>
            <p>
              Si tiene alguna pregunta sobre estos Términos y Condiciones, por favor contáctenos a:
            </p>
            <p>
              <strong>Promurcia Inmobiliarios</strong><br />
              C/ Maestra Maria Maroto, 6, Vista Alegre, Murcia<br />
              Email: Pro@promurcia.com<br />
              Teléfono: +34 622 337 098
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;