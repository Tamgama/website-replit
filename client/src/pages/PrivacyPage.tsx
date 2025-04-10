import { useEffect } from "react";

const PrivacyPage = () => {
  useEffect(() => {
    document.title = "Política de Privacidad | Promurcia";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary-dark mb-8">
            Política de Privacidad
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <p>
              <strong>Última actualización:</strong> 21 de marzo de 2023
            </p>
            
            <h2>1. Introducción</h2>
            <p>
              En Promurcia Inmobiliarios (en adelante, "Promurcia"), con domicilio en C/ Maestra Maria Maroto, 6, Vista Alegre, Murcia, 
              respetamos su privacidad y estamos comprometidos con la protección de sus datos personales. Esta política de privacidad 
              describe cómo recopilamos y tratamos su información personal a través de nuestro sitio web promurcia.com, 
              incluidos los datos que proporciona cuando solicita una valoración inmobiliaria, utiliza nuestros servicios, 
              o se suscribe a nuestras comunicaciones.
            </p>
            
            <h2>2. Responsable del tratamiento</h2>
            <p>
              <strong>Promurcia Inmobiliarios</strong><br />
              C/ Maestra Maria Maroto, 6, Vista Alegre, Murcia<br />
              Email: Pro@promurcia.com<br />
              Teléfono: +34 622 337 098
            </p>
            
            <h2>3. Información que recopilamos</h2>
            <p>Podemos recopilar, utilizar, almacenar y transferir diferentes tipos de datos personales sobre usted:</p>
            <ul>
              <li><strong>Datos de identidad:</strong> nombre, apellidos.</li>
              <li><strong>Datos de contacto:</strong> dirección de correo electrónico, número de teléfono, dirección postal.</li>
              <li><strong>Datos técnicos:</strong> dirección IP, datos de inicio de sesión, tipo y versión del navegador, configuración de zona horaria, tipos y versiones de plugins, sistema operativo y plataforma.</li>
              <li><strong>Datos de perfil:</strong> preferencias, comentarios y respuestas a encuestas.</li>
              <li><strong>Datos de uso:</strong> información sobre cómo utiliza nuestro sitio web y servicios.</li>
              <li><strong>Datos de marketing y comunicaciones:</strong> sus preferencias para recibir marketing de nosotros.</li>
              <li><strong>Datos inmobiliarios:</strong> información sobre su propiedad cuando solicita una valoración, como ubicación, características, metros cuadrados, etc.</li>
            </ul>
            
            <h2>4. Cómo recopilamos su información personal</h2>
            <p>Utilizamos diferentes métodos para recopilar datos de y sobre usted, entre ellos:</p>
            <ul>
              <li><strong>Interacciones directas:</strong> puede proporcionarnos sus datos de identidad, contacto y financieros al rellenar formularios o al comunicarse con nosotros por correo postal, teléfono, correo electrónico o de otra manera.</li>
              <li><strong>Tecnologías o interacciones automatizadas:</strong> mientras interactúa con nuestro sitio web, podemos recopilar automáticamente datos técnicos sobre su equipo, acciones y patrones de navegación mediante cookies y otras tecnologías similares.</li>
              <li><strong>Terceros:</strong> podemos recibir datos personales sobre usted de diversos terceros, como proveedores de servicios técnicos, de pago y de entrega, proveedores de análisis, proveedores de información de búsqueda.</li>
            </ul>
            
            <h2>5. Finalidades del tratamiento de datos</h2>
            <p>Utilizamos sus datos personales solo cuando la ley nos lo permite. Más comúnmente, utilizaremos sus datos personales en las siguientes circunstancias:</p>
            <ul>
              <li>Para proporcionar el servicio de valoración inmobiliaria solicitado.</li>
              <li>Para procesar y responder a sus consultas, solicitudes o reclamaciones.</li>
              <li>Para mejorar nuestro sitio web, productos y servicios.</li>
              <li>Para enviarle información que ha solicitado o que pueda ser de su interés, si ha dado su consentimiento para ello.</li>
              <li>Para cumplir con obligaciones legales o normativas.</li>
              <li>Para administrar y proteger nuestro negocio y este sitio web (incluida la solución de problemas, análisis de datos, pruebas, mantenimiento del sistema, soporte, informes y alojamiento de datos).</li>
            </ul>
            
            <h2>6. Base legal para el tratamiento</h2>
            <p>Nos basamos en las siguientes bases legales para procesar sus datos personales:</p>
            <ul>
              <li><strong>Consentimiento:</strong> cuando ha dado su consentimiento para el tratamiento de sus datos personales para uno o varios fines específicos.</li>
              <li><strong>Ejecución de un contrato:</strong> cuando el tratamiento es necesario para la ejecución de un contrato del que usted es parte o para la aplicación de medidas precontractuales adoptadas a petición suya.</li>
              <li><strong>Obligación legal:</strong> cuando el tratamiento es necesario para el cumplimiento de una obligación legal aplicable al responsable del tratamiento.</li>
              <li><strong>Interés legítimo:</strong> cuando el tratamiento es necesario para la satisfacción de intereses legítimos perseguidos por Promurcia, siempre que no prevalezcan los intereses o los derechos y libertades fundamentales del interesado.</li>
            </ul>
            
            <h2>7. Conservación de sus datos</h2>
            <p>
              Conservaremos sus datos personales solo durante el tiempo necesario para cumplir con los fines para los que los recopilamos, incluidos los fines de satisfacer cualquier requisito legal, contable o de presentación de informes.
            </p>
            <p>
              Para determinar el período de conservación apropiado para los datos personales, consideramos la cantidad, naturaleza y sensibilidad de los datos personales, el riesgo potencial de daño por uso o divulgación no autorizados, los fines para los que procesamos sus datos personales y si podemos lograr esos fines a través de otros medios, y los requisitos legales aplicables.
            </p>
            
            <h2>8. Derechos de los interesados</h2>
            <p>Bajo ciertas circunstancias, usted tiene derechos en relación con sus datos personales bajo las leyes de protección de datos. Estos incluyen el derecho a:</p>
            <ul>
              <li>Solicitar acceso a sus datos personales.</li>
              <li>Solicitar la rectificación de sus datos personales.</li>
              <li>Solicitar la supresión de sus datos personales.</li>
              <li>Oponerse al tratamiento de sus datos personales.</li>
              <li>Solicitar la limitación del tratamiento de sus datos personales.</li>
              <li>Solicitar la portabilidad de sus datos personales.</li>
              <li>Retirar el consentimiento en cualquier momento.</li>
            </ul>
            <p>
              Si desea ejercer cualquiera de estos derechos, por favor contáctenos a través de Pro@promurcia.com.
            </p>
            
            <h2>9. Seguridad de los datos</h2>
            <p>
              Hemos implementado medidas de seguridad adecuadas para evitar que sus datos personales se pierdan, utilicen o accedan accidentalmente de forma no autorizada, se alteren o divulguen. Además, limitamos el acceso a sus datos personales a aquellos empleados, agentes, contratistas y otros terceros que tengan una necesidad comercial de conocer.
            </p>
            
            <h2>10. Cambios a esta política de privacidad</h2>
            <p>
              Podemos actualizar esta política de privacidad de vez en cuando publicando una nueva versión en nuestro sitio web. Debe consultar esta página ocasionalmente para asegurarse de que está satisfecho con cualquier cambio.
            </p>
            
            <h2>11. Contacto</h2>
            <p>
              Si tiene alguna pregunta sobre esta política de privacidad o nuestras prácticas de privacidad, por favor contáctenos a:
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

export default PrivacyPage;