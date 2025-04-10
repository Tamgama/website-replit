import { useEffect, useRef, useState } from "react";
import { initializeMap } from "@/lib/geocoding";

interface PropertyMapProps {
  address: string;
  lat?: number;
  lng?: number;
  height?: string;
  width?: string;
  className?: string;
}

/**
 * Componente para mostrar un mapa con la ubicación de una propiedad
 * IMPORTANTE: Este componente requiere que Google Maps API esté correctamente cargada y configurada
 */
const PropertyMap = ({
  address,
  lat,
  lng,
  height = "300px",
  width = "100%",
  className = ""
}: PropertyMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  
  // Generar un ID único para el contenedor del mapa
  const mapId = useRef(`map-${Math.random().toString(36).substr(2, 9)}`);
  
  // Inicializar el mapa cuando el componente se monta
  useEffect(() => {
    // Verificar si la API de Google Maps está disponible
    if (!window.google || !window.google.maps) {
      setMapError("La API de Google Maps no está disponible. Por favor, actualiza la página.");
      return;
    }
    
    try {
      if (mapRef.current) {
        mapRef.current.id = mapId.current;
        const map = initializeMap(mapId.current);
        
        if (map) {
          setMapInstance(map);
          
          // Si se proporcionan lat y lng, centrar el mapa en esas coordenadas
          if (lat && lng) {
            const position = { lat, lng };
            map.setCenter(position);
            
            // Crear un marcador en la posición
            const newMarker = new google.maps.Marker({
              position,
              map,
              title: address
            });
            
            setMarker(newMarker);
          }
        }
      }
    } catch (error) {
      console.error("Error al inicializar el mapa:", error);
      setMapError("Ha ocurrido un error al cargar el mapa.");
    }
    
    // Limpiar cuando el componente se desmonte
    return () => {
      if (marker) {
        marker.setMap(null);
      }
    };
  }, [address, lat, lng]);
  
  // Estilo para el contenedor del mapa
  const mapStyle = {
    height,
    width
  };
  
  // Si hay un error, mostrar un mensaje
  if (mapError) {
    return (
      <div 
        className={`bg-gray-100 flex items-center justify-center ${className}`} 
        style={mapStyle}
      >
        <p className="text-gray-500 text-center p-4">{mapError}</p>
      </div>
    );
  }
  
  // Si Google Maps no está disponible, mostrar un mensaje informativo
  if (!window.google || !window.google.maps) {
    return (
      <div 
        className={`bg-gray-100 flex items-center justify-center ${className}`} 
        style={mapStyle}
      >
        <p className="text-gray-500 text-center p-4">
          El mapa no está disponible en este momento.
        </p>
      </div>
    );
  }
  
  return (
    <div 
      ref={mapRef}
      className={`rounded-md overflow-hidden ${className}`}
      style={mapStyle}
    ></div>
  );
};

export default PropertyMap;