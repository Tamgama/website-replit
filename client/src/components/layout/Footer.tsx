import { Link } from "wouter";
import Logo from "./Logo";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Logo and brief */}
            <div className="md:col-span-2">
              <div className="mb-4">
                <Logo variant="light" />
              </div>
              <p className="text-gray-300 mb-6">
                Inmobiliaria en Murcia especializada en saber cuánto cuesta tu casa. Valoramos tu propiedad <strong>100% GRATIS y en solo 3 MINUTOS</strong>. 
                Expertos en los barrios de Vista Alegre, Santa María de Gracias 
                y La Flota para vender vivienda al mejor precio.
              </p>
            </div>
            
            {/* Links 1 */}
            <div>
              <h3 className="font-heading font-semibold text-lg mb-4">
                Enlaces Rápidos
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-gray-300 hover:text-white">
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link href="/valoracion" className="text-gray-300 hover:text-white">
                    Valoración
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="text-gray-300 hover:text-white">
                    Iniciar Sesión
                  </Link>
                </li>
                <li>
                  <Link href="/#contact" className="text-gray-300 hover:text-white">
                    Contacto
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Links 2 */}
            <div>
              <h3 className="font-heading font-semibold text-lg mb-4">Legal</h3>
              <ul className="space-y-2">

                <li>
                  <Link href="/privacidad" className="text-gray-300 hover:text-white">
                    Política de Privacidad
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="text-gray-300 hover:text-white">
                    Política de Cookies
                  </Link>
                </li>
                <li>
                  <Link href="/terminos" className="text-gray-300 hover:text-white">
                    Términos y Condiciones
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm space-y-3">
            <p className="text-base">
              <strong>Promurcia Inmobiliarios</strong> | 
              C/ Maestra Maria Maroto, 6, Vista Alegre, Murcia | 
              <a href="mailto:Pro@promurcia.com" className="hover:text-white">pro@promurcia.com</a> | 
              <a href="tel:+34622337098" className="hover:text-white"> +34 622 337 098</a>
            </p>
            <p>&copy; 2025 Promurcia Inmobiliarios. Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

const Logo: React.FC<{ variant?: 'light' | 'dark' | 'negative' }> = ({ variant = 'dark' }) => {
  return (
    <div className="inline-flex items-center">
      {/* Usamos la imagen del logo real de Promurcia */}
      <img 
        src="public/images/logo-promurcia.png" 
        alt="Promurcia" 
        className="h-10 md:h-12" 
      />
    </div>
  );
};

export default Footer;
