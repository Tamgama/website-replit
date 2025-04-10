import { useEffect, useRef, useState } from 'react';
import { Building } from 'lucide-react';
import { Play, Pause } from 'lucide-react';

// Declarar variable global para el acceso a la API key
declare global {
  interface Window {
    GOOGLE_MAPS_API_KEY?: string;
  }
}

interface AerialViewProps {
  address: string;
  className?: string;
}

/**
 * Componente que muestra una vista aérea de una dirección utilizando Google Aerial View API
 */
const AerialView = ({ address, className = "" }: AerialViewProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasTriedLoadingRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(error => {
        console.error("Error reproduciendo video:", error);
      });
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    if (!address || hasTriedLoadingRef.current || !videoRef.current) return;
    
    // Marcar que ya hemos intentado cargar para no repetir innecesariamente
    hasTriedLoadingRef.current = true;

    const initAerialView = async () => {
      try {
        const displayEl = videoRef.current;
        if (!displayEl) return;

        // Evento para detectar cuando el video ha cargado
        displayEl.addEventListener('loadeddata', () => {
          setVideoLoaded(true);
        });

        // Inicializar con una imagen estática como fallback
        displayEl.poster = `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(address)}&zoom=16&size=600x400&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`;

        // Limpiar cualquier mensaje anterior
        if (containerRef.current) {
          const existingInfo = containerRef.current.querySelector(".aerial-info-message");
          if (existingInfo) {
            existingInfo.remove();
          }
        }

        // Mensaje por defecto
        let infoMessage = "Vista aérea personalizada de Promurcia";
        
        // Intentar obtener el video de la API a través de nuestro servidor
        try {
          const response = await fetch(`/api/aerial-view?address=${encodeURIComponent(address)}`);
          if (response.ok) {
            const result = await response.json();
            console.log("Respuesta del servidor para vista aérea:", result);
            
            // Comprobar el estado de la respuesta
            if (result.success) {
              if (result.state === "PROCESSING") {
                console.log("Video en procesamiento");
                infoMessage = "Video aéreo en procesamiento, por favor vuelve más tarde";
              } else if (result.url) {
                // Si tenemos una URL, la establecemos como fuente del video
                displayEl.src = result.url;
                displayEl.load();
                // Iniciar la reproducción automáticamente cuando el video esté cargado
                displayEl.addEventListener('loadeddata', () => {
                  displayEl.play().then(() => {
                    setIsPlaying(true);
                  }).catch(err => {
                    console.error("Error al reproducir automáticamente:", err);
                  });
                });
                // Según el origen del video, mostramos un mensaje diferente
                if (result.url.includes('google') || result.provider === 'google') {
                  infoMessage = "© Copyright 2023 Google LLC. All Rights Reserved. Apache-2.0";
                } else {
                  infoMessage = "© Vista exclusiva de Promurcia";
                }
              }
            } else {
              // Mensaje de error
              infoMessage = result.message || "No se pudo obtener la vista aérea";
            }
          }
        } catch (error) {
          console.error("Error al solicitar vista aérea:", error);
          infoMessage = "Error al solicitar vista aérea";
        }
        
        // Añadir mensaje informativo
        if (containerRef.current) {
          const infoElement = document.createElement('div');
          infoElement.className = "aerial-info-message absolute bottom-2 left-2 right-2 bg-black/70 text-white p-2 text-xs rounded";
          infoElement.innerHTML = infoMessage;
          containerRef.current.appendChild(infoElement);
        }

      } catch (error) {
        console.error("Error inicializando la vista aérea:", error);
      }
    };

    initAerialView();
  }, [address]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden rounded-lg bg-gray-100 h-56 ${className}`}>
      <video 
        ref={videoRef}
        controls={false}
        autoPlay
        playsInline
        loop
        muted
        className="w-full h-full object-cover"
        poster={`https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(address)}&zoom=16&size=600x400&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`}
      >
        Tu navegador no soporta la reproducción de video.
      </video>
      <div className="absolute top-2 left-2 flex items-center bg-white/80 px-2 py-1 rounded-md text-xs">
        <Building className="h-3 w-3 mr-1 text-blue-600" />
        <span>Visualización aérea</span>
      </div>
      
      {/* Control discreto en la esquina para pausar/reanudar */}
      <div 
        className="absolute bottom-2 right-2 bg-black/30 hover:bg-black/50 rounded-full p-2 cursor-pointer transition-colors z-10"
        onClick={togglePlayPause}
      >
        {isPlaying ? (
          <Pause className="h-4 w-4 text-white" />
        ) : (
          <Play className="h-4 w-4 text-white" />
        )}
      </div>
    </div>
  );
};

export default AerialView;