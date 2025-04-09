declare namespace google {
  namespace maps {
    // Método moderno para cargar bibliotecas de Google Maps
    function importLibrary(libraryName: string): Promise<any>;
    class Map {
      constructor(mapDiv: Element, opts?: MapOptions);
      setCenter(latLng: LatLng | LatLngLiteral): void;
      setZoom(zoom: number): void;
      getCenter(): LatLng;
      getZoom(): number;
    }

    interface MapOptions {
      center?: LatLng | LatLngLiteral;
      zoom?: number;
      mapTypeControl?: boolean;
      [key: string]: any;
    }

    class LatLng {
      constructor(lat: number, lng: number, noWrap?: boolean);
      lat(): number;
      lng(): number;
    }

    interface LatLngLiteral {
      lat: number;
      lng: number;
    }
    
    class Marker {
      constructor(opts?: MarkerOptions);
      setMap(map: Map | null): void;
      setPosition(latLng: LatLng | LatLngLiteral): void;
      getPosition(): LatLng;
      setTitle(title: string): void;
      getTitle(): string;
    }
    
    interface MarkerOptions {
      position?: LatLng | LatLngLiteral;
      map?: Map;
      title?: string;
      [key: string]: any;
    }
    
    class Geocoder {
      constructor();
      geocode(request: GeocoderRequest): Promise<GeocoderResponse>;
    }
    
    interface GeocoderRequest {
      address?: string;
      location?: LatLng | LatLngLiteral;
      [key: string]: any;
    }
    
    interface GeocoderResponse {
      results: GeocoderResult[];
      status: string;
    }
    
    interface GeocoderResult {
      address_components: GeocoderAddressComponent[];
      formatted_address: string;
      geometry: {
        location: LatLng;
        location_type: string;
        viewport: {
          northeast: LatLng;
          southwest: LatLng;
        };
      };
      place_id: string;
      types: string[];
    }
    
    interface GeocoderAddressComponent {
      long_name: string;
      short_name: string;
      types: string[];
    }

    namespace places {
      class Autocomplete {
        constructor(
          inputField: HTMLInputElement,
          opts?: AutocompleteOptions
        );
        addListener(eventName: string, handler: () => void): void;
        getPlace(): PlaceResult;
      }

      interface AutocompleteOptions {
        bounds?: any;
        componentRestrictions?: { country: string | string[] };
        fields?: string[];
        types?: string[];
      }

      interface PlaceResult {
        address_components?: AddressComponent[];
        formatted_address?: string;
        geometry?: {
          location?: LatLng;
          viewport?: any;
        };
        name?: string;
        place_id?: string;
        [key: string]: any;
      }

      interface AddressComponent {
        long_name: string;
        short_name: string;
        types: string[];
      }
    }

    namespace event {
      function clearInstanceListeners(instance: any): void;
      function addListener(instance: any, eventName: string, handler: (...args: any[]) => void): any;
    }
  }
}

interface Window {
  google?: typeof google;
  initMap?: () => void;
  initGoogleMaps?: () => void;
}