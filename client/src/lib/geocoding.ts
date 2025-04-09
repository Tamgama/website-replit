/**
 * Utilidades para interactuar con la API de Geocoding de Google Maps
 * Basado en ejemplos oficiales de Google
 */

/**
 * Geocodifica una dirección para obtener sus coordenadas
 * @param address La dirección a geocodificar
 * @returns Una promesa que se resuelve con las coordenadas {lat, lng} o null si hubo un error
 */
export async function geocodeAddress(address: string): Promise<{lat: number, lng: number} | null> {
  // Verificar que Google Maps esté disponible
  if (!window.google || !window.google.maps || !window.google.maps.Geocoder) {
    console.error("API de Google Maps no disponible");
    return null;
  }

  try {
    const geocoder = new google.maps.Geocoder();
    const result = await geocoder.geocode({ address });
    
    if (result.results && result.results.length > 0) {
      const location = result.results[0].geometry.location;
      return {
        lat: location.lat(),
        lng: location.lng()
      };
    }
    return null;
  } catch (error) {
    console.error("Error al geocodificar la dirección:", error);
    return null;
  }
}

/**
 * Realiza geocodificación inversa para obtener una dirección a partir de coordenadas
 * @param lat Latitud
 * @param lng Longitud
 * @returns Una promesa que se resuelve con la dirección formateada o null si hubo un error
 */
export async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  // Verificar que Google Maps esté disponible
  if (!window.google || !window.google.maps || !window.google.maps.Geocoder) {
    console.error("API de Google Maps no disponible");
    return null;
  }

  try {
    const geocoder = new google.maps.Geocoder();
    const result = await geocoder.geocode({ 
      location: { lat, lng } 
    });
    
    if (result.results && result.results.length > 0) {
      return result.results[0].formatted_address;
    }
    return null;
  } catch (error) {
    console.error("Error al realizar geocodificación inversa:", error);
    return null;
  }
}

/**
 * Inicializa un mapa centrado en Murcia (para usar cuando tengamos la clave API correcta)
 * @param mapElementId El id del elemento HTML donde se mostrará el mapa
 * @returns El objeto de mapa creado o null si hubo un error
 */
export function initializeMap(mapElementId: string): google.maps.Map | null {
  // Verificar que Google Maps esté disponible
  if (!window.google || !window.google.maps || !window.google.maps.Map) {
    console.error("API de Google Maps no disponible");
    return null;
  }

  try {
    // Coordenadas aproximadas de Murcia
    const murciaCoordinates = { lat: 37.9922, lng: -1.1307 };
    
    const mapElement = document.getElementById(mapElementId);
    if (!mapElement) {
      console.error(`Elemento con id '${mapElementId}' no encontrado`);
      return null;
    }
    
    const map = new google.maps.Map(mapElement, {
      center: murciaCoordinates,
      zoom: 13,
      mapTypeControl: false,
    });
    
    return map;
  } catch (error) {
    console.error("Error al inicializar el mapa:", error);
    return null;
  }
}