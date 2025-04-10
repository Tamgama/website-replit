import { useEffect, useRef } from 'react';

interface DatavenuesWidgetProps {
  targetId?: string;
  color?: string;
  alt?: boolean;
}

const DatavenuesWidget = ({ 
  targetId = "dv-widget", 
  color = "#0066CC",
  alt = true 
}: DatavenuesWidgetProps) => {
  const scriptLoadedRef = useRef(false);
  
  useEffect(() => {
    // Solo cargar el script una vez
    if (scriptLoadedRef.current) return;
    
    // Crear y configurar el script
    const script = document.createElement('script');
    const token = "0195ccfb-f469-7b88-90bf-abbeb5604dfd";
    const locale = "es";
    
    // Convertir el color a formato URL-friendly
    const colorEncoded = color.replace('#', '%23');
    
    // Construir la URL con parámetros
    script.src = `https://app.datavenues.com/js/datavenues.js?tkn=${token}&target=${targetId}&locale=${locale}&color=${colorEncoded}${alt ? '&alt' : ''}`;
    script.async = true;
    
    // Manejar errores
    script.onerror = () => {
      console.error('Error al cargar el widget de Datavenues');
    };
    
    // Añadir el script al documento
    document.body.appendChild(script);
    
    // Marcar como cargado
    scriptLoadedRef.current = true;
    
    // Limpieza al desmontar
    return () => {
      // Intentar eliminar el script al desmontar el componente
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [targetId, color, alt]);
  
  return <div id={targetId} className="w-full" />;
};

export default DatavenuesWidget;