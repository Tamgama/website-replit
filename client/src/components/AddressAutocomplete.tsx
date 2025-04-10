import { useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onPlaceSelect?: (place: google.maps.places.PlaceResult & { 
    location?: { lat: number, lng: number } 
  }) => void;
  placeholder?: string;
  className?: string;
}

const AddressAutocomplete = ({
  value,
  onChange,
  onPlaceSelect,
  placeholder = "Introduce tu dirección...",
  className = "pl-10 py-6 text-base rounded-md"
}: AddressAutocompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  // Inicializar Google Places Autocomplete API (enfoque tradicional)
  useEffect(() => {
    // Verificar si Google Maps API está disponible
    if (window.google && window.google.maps && window.google.maps.places) {
      // Crear el objeto de autocompletado
      if (inputRef.current && !autocompleteRef.current) {
        const options: google.maps.places.AutocompleteOptions = {
          componentRestrictions: { country: 'es' }, // Restringir a España
          fields: ['address_components', 'formatted_address', 'geometry', 'name']
        };
        
        const autocomplete = new google.maps.places.Autocomplete(inputRef.current, options);
        autocompleteRef.current = autocomplete;
        
        // Manejar el evento cuando se selecciona un lugar
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          
          if (place) {
            // Actualizar el valor de la dirección si está disponible
            if (place.formatted_address) {
              onChange(place.formatted_address);
            } else if (place.name) {
              onChange(place.name);
            }
            
            // Si tenemos geometría, podemos extraer las coordenadas
            if (onPlaceSelect && place.geometry && place.geometry.location) {
              try {
                // Extraer coordenadas lat/lng y agregarlas al objeto place
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();
                
                console.log(`Coordenadas capturadas: Lat ${lat}, Lng ${lng}`);
                
                const placeWithLocation = {
                  ...place,
                  location: { lat, lng }
                };
                
                onPlaceSelect(placeWithLocation);
              } catch (error) {
                console.error("Error al extraer coordenadas:", error);
              }
            } else {
              console.warn("No se pudieron obtener coordenadas para esta dirección");
            }
          }
        });
        
        console.log("Google Places Autocomplete inicializado correctamente");
      }
    } else {
      console.log("Google Maps Places API no está disponible");
    }
    
    // Limpieza al desmontar el componente
    return () => {
      if (autocompleteRef.current && window.google && window.google.maps) {
        // Limpiar listeners si es posible
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
        autocompleteRef.current = null;
      }
    };
  }, [onChange, onPlaceSelect]);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <Input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={className}
      />
    </div>
  );
};

export default AddressAutocomplete;