import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu } from "lucide-react";
import { useMobileMenu } from "@/hooks/use-mobile-menu";
import Logo from "./Logo";

const Header = () => {
  const [location] = useLocation();
  const { isMenuOpen, toggleMenu, closeMenu } = useMobileMenu();
  
  const isActive = (path: string) => {
    return location === path || location === (path === "/valoracion" ? "/" : undefined);
  };

  return (
    <header className="sticky top-0 bg-white shadow-md z-50">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <Link 
            href="/"
            className="cursor-pointer"
          >
            <Logo variant="dark" />
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-3">
          <Link 
            href="/valoracion"
            className="py-2 px-5 font-bold rounded-md transition-colors duration-200 bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
          >
            Valorar mi vivienda
          </Link>
          <Link 
            href="/login"
            className="py-2 px-3 font-medium text-gray-700 hover:text-blue-600 transition-colors border border-gray-300 rounded-md shadow-sm"
          >
            <span className="realtime-indicator-right">Área Cliente</span>
          </Link>
          <Link 
            href="/ventas-secretas"
            className="py-2 px-3 font-medium text-gray-700 hover:text-blue-600 transition-colors flex items-center"
          >
            <span className="w-2 h-2 bg-blue-600 rounded-full mr-1"></span>
            Ventas Secretas
          </Link>
        </nav>
        
        {/* Mobile menu button */}
        <button 
          type="button" 
          className="md:hidden bg-blue-600 text-white p-2 rounded-md focus:outline-none hover:bg-blue-700 transition-colors duration-200" 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <Menu size={24} />
        </button>
      </div>
      
      {/* Mobile navigation menu */}
      <div className={`md:hidden bg-white w-full shadow-lg ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="container mx-auto px-4 py-3 flex flex-col space-y-2">
          <Link 
            href="/valoracion"
            className="py-3 px-4 font-bold rounded-md text-center bg-blue-600 text-white"
            onClick={closeMenu}
          >
            Valorar mi vivienda
          </Link>
          <Link 
            href="/login"
            className="py-3 px-4 rounded-md text-center border border-gray-300 bg-white shadow-sm text-gray-700"
            onClick={closeMenu}
          >
            <span className="realtime-indicator-right">Área Cliente</span>
          </Link>
          <Link 
            href="/ventas-secretas"
            className="py-3 px-4 rounded-md text-center border border-gray-200 flex items-center justify-center"
            onClick={closeMenu}
          >
            <span className="w-2 h-2 bg-blue-600 rounded-full mr-1"></span>
            Ventas Secretas
          </Link>
        </div>
      </div>
    </header>
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

export default Header;
