import { useEffect } from "react";

const CookiesPage = () => {
  useEffect(() => {
    document.title = "Política de Cookies | Promurcia";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary-dark mb-8">
            Política de Cookies
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <p>
              <strong>Última actualización:</strong> 21 de marzo de 2023
            </p>
            
            <h2>1. Introducción</h2>
            <p>
              La presente Política de Cookies explica qué son las cookies, cómo Promurcia Inmobiliarios (en adelante, "Promurcia") 
              utiliza las cookies y tecnologías similares en su sitio web promurcia.com, y qué opciones tiene usted en relación con ellas.
            </p>
            <p>
              Esta Política de Cookies debe leerse junto con nuestra Política de Privacidad y nuestros Términos y Condiciones.
            </p>
            
            <h2>2. ¿Qué son las cookies?</h2>
            <p>
              Las cookies son pequeños archivos de texto que se almacenan en su dispositivo (ordenador, tablet o móvil) cuando visita 
              un sitio web. Las cookies son ampliamente utilizadas por los propietarios de sitios web para hacer que sus sitios funcionen, 
              o funcionen de manera más eficiente, así como para proporcionar información a los propietarios del sitio.
            </p>
            <p>
              Las cookies establecidas por el propietario del sitio web (en este caso, Promurcia) se denominan "cookies propias". 
              Las cookies establecidas por partes distintas del propietario del sitio web se denominan "cookies de terceros". 
              Las cookies de terceros permiten que se proporcionen funciones o características de terceros en o a través del sitio web 
              (por ejemplo, publicidad, contenido interactivo y análisis).
            </p>
            
            <h2>3. Tipos de cookies que utilizamos</h2>
            <p>
              Utilizamos los siguientes tipos de cookies en nuestro sitio web:
            </p>
            <ul>
              <li>
                <strong>Cookies estrictamente necesarias:</strong> Estas cookies son esenciales para que usted pueda navegar por el sitio web y utilizar sus funciones. Sin estas cookies, no se pueden proporcionar servicios básicos como la seguridad, la navegación y el acceso a áreas seguras del sitio web.
              </li>
              <li>
                <strong>Cookies de rendimiento:</strong> Estas cookies recopilan información sobre cómo los visitantes utilizan un sitio web, por ejemplo, qué páginas visitan los usuarios con más frecuencia, y si reciben mensajes de error de páginas web. Estas cookies no recopilan información que identifique a un visitante. Toda la información que recopilan estas cookies es agregada y, por lo tanto, anónima. Solo se utilizan para mejorar el funcionamiento de un sitio web.
              </li>
              <li>
                <strong>Cookies de funcionalidad:</strong> Estas cookies permiten que el sitio web recuerde las elecciones que hace (como su nombre de usuario, idioma o la región en la que se encuentra) y proporcione características mejoradas y más personales. Estas cookies también pueden utilizarse para recordar los cambios que ha realizado en el tamaño del texto, las fuentes y otras partes de las páginas web que puede personalizar.
              </li>
              <li>
                <strong>Cookies de orientación y publicidad:</strong> Estas cookies se utilizan para entregar anuncios que son más relevantes para usted y sus intereses. También se utilizan para limitar el número de veces que ve un anuncio, así como para ayudar a medir la efectividad de una campaña publicitaria.
              </li>
            </ul>
            
            <h2>4. Cookies específicas que utilizamos</h2>
            <p>
              A continuación, se detallan las cookies específicas que utilizamos y su finalidad:
            </p>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2">Nombre</th>
                  <th className="border border-gray-300 p-2">Proveedor</th>
                  <th className="border border-gray-300 p-2">Finalidad</th>
                  <th className="border border-gray-300 p-2">Duración</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-2">_ga</td>
                  <td className="border border-gray-300 p-2">Google Analytics</td>
                  <td className="border border-gray-300 p-2">Registra una identificación única que se utiliza para generar datos estadísticos sobre cómo utiliza el visitante el sitio web.</td>
                  <td className="border border-gray-300 p-2">2 años</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2">_gid</td>
                  <td className="border border-gray-300 p-2">Google Analytics</td>
                  <td className="border border-gray-300 p-2">Registra una identificación única que se utiliza para generar datos estadísticos sobre cómo utiliza el visitante el sitio web.</td>
                  <td className="border border-gray-300 p-2">24 horas</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2">_gat</td>
                  <td className="border border-gray-300 p-2">Google Analytics</td>
                  <td className="border border-gray-300 p-2">Se utiliza para limitar la velocidad de las solicitudes.</td>
                  <td className="border border-gray-300 p-2">1 minuto</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2">session</td>
                  <td className="border border-gray-300 p-2">Promurcia</td>
                  <td className="border border-gray-300 p-2">Mantiene el estado de la sesión del visitante en las solicitudes de página.</td>
                  <td className="border border-gray-300 p-2">Sesión</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2">cookie_consent</td>
                  <td className="border border-gray-300 p-2">Promurcia</td>
                  <td className="border border-gray-300 p-2">Almacena las preferencias de consentimiento de cookies del usuario.</td>
                  <td className="border border-gray-300 p-2">1 año</td>
                </tr>
              </tbody>
            </table>
            
            <h2>5. Gestión de cookies</h2>
            <p>
              La mayoría de los navegadores le permiten rechazar o aceptar cookies. Los siguientes enlaces proporcionan información sobre cómo controlar las cookies en los navegadores más comunes:
            </p>
            <ul>
              <li>
                <a href="https://support.google.com/chrome/answer/95647?hl=es" target="_blank" rel="noopener noreferrer">Google Chrome</a>
              </li>
              <li>
                <a href="https://support.microsoft.com/es-es/help/17442/windows-internet-explorer-delete-manage-cookies" target="_blank" rel="noopener noreferrer">Internet Explorer</a>
              </li>
              <li>
                <a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a>
              </li>
              <li>
                <a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">Safari</a>
              </li>
              <li>
                <a href="https://support.microsoft.com/es-es/help/4468242/microsoft-edge-browsing-data-and-privacy" target="_blank" rel="noopener noreferrer">Microsoft Edge</a>
              </li>
              <li>
                <a href="https://help.opera.com/en/latest/web-preferences/#cookies" target="_blank" rel="noopener noreferrer">Opera</a>
              </li>
            </ul>
            
            <p>
              Tenga en cuenta que la restricción de cookies puede afectar a la funcionalidad de nuestro sitio web y puede impedir que utilice ciertas características.
            </p>
            
            <h2>6. Tecnologías similares</h2>
            <p>
              Además de las cookies, también podemos utilizar otras tecnologías similares para almacenar y recuperar información en su navegador o dispositivo:
            </p>
            <ul>
              <li>
                <strong>Web beacons:</strong> También conocidos como "clear gifs" o "pixel tags", son pequeñas imágenes gráficas transparentes que se utilizan para recopilar información sobre el uso del sitio web, las respuestas a campañas por correo electrónico y otras estadísticas.
              </li>
              <li>
                <strong>Almacenamiento local de HTML5:</strong> Los sitios web pueden almacenar datos en el navegador del usuario utilizando el almacenamiento local de HTML5. Estos datos no tienen fecha de vencimiento y permanecen en el navegador hasta que se eliminan manualmente.
              </li>
              <li>
                <strong>Objectos compartidos locales Flash:</strong> También conocidos como "Flash cookies", se utilizan para recopilar información sobre sus acciones en sitios web que utilizan Flash.
              </li>
            </ul>
            
            <h2>7. Cambios a nuestra Política de Cookies</h2>
            <p>
              Podemos actualizar nuestra Política de Cookies de vez en cuando. Cualquier cambio que realicemos en nuestra Política de Cookies en el futuro se publicará en esta página y, cuando sea apropiado, se le notificará cuando visite nuestro sitio web.
            </p>
            
            <h2>8. Contacto</h2>
            <p>
              Si tiene alguna pregunta sobre nuestra Política de Cookies, por favor contáctenos a:
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

export default CookiesPage;