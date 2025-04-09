/**
 * Utilidades para interactuar con la API del Catastro Español
 * 
 * Este módulo proporciona funciones para consultar el servicio web del Catastro
 * y obtener información de propiedades a partir de coordenadas geográficas.
 */

// Definición de interfaces para los datos del Catastro
export interface CatastroParcel {
  rc: string;                // Referencia catastral
  area: string;              // Superficie en metros cuadrados
  address: string;           // Dirección completa
  buildingType: string;      // Tipo de inmueble (Urbano, Rústico, etc.)
  constructionYear?: string; // Año de construcción (si está disponible)
}

export interface CatastroBuilding {
  rc: string;                 // Referencia catastral del inmueble
  area: string;               // Superficie en metros cuadrados
  constructionYear?: string;  // Año de construcción
  use: string;                // Uso (Residencial, Comercial, etc.)
  floors: string;             // Número de plantas
  condition?: string;         // Estado de conservación
}

export interface CatastroResponse {
  success: boolean;
  message?: string;
  parcels?: CatastroParcel[];
  buildings?: CatastroBuilding[];
}

// URL base para las peticiones a la API del Catastro
const CATASTRO_OVC_API_URL = "https://ovc.catastro.meh.es/ovcservweb/OVCSWLocalizacionRC";
const CATASTRO_INSPIRE_API_URL = "http://ovc.catastro.meh.es/INSPIRE/wfsCP.aspx";

/**
 * Consulta la información catastral a partir de coordenadas
 * 
 * @param lat Latitud en formato decimal
 * @param lng Longitud en formato decimal
 * @returns Promesa que se resuelve con un objeto CatastroResponse
 */
export async function getParcelsByCoordinates(lat: number, lng: number): Promise<CatastroResponse> {
  try {
    // Ahora llamamos a nuestra API que se conecta con el Catastro
    const url = `/api/catastro/coordinates?lat=${lat}&lng=${lng}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || `Error al consultar el Catastro: ${response.status} ${response.statusText}`
      };
    }
    
    const data = await response.json();
    
    // Si la petición fue exitosa pero no hay datos
    if (!data.success) {
      return {
        success: false,
        message: data.message || "No se pudieron obtener datos del Catastro"
      };
    }
    
    // Transformar los datos recibidos al formato esperado
    const catastroData = data.data;
    
    // Crear el objeto parcela a partir de los datos recibidos
    const parcelData: CatastroParcel = {
      rc: catastroData.referenciaCatastral,
      area: catastroData.superficieConstruida || "100", // Valor por defecto si no hay dato
      address: catastroData.localizacion || "Dirección no disponible",
      buildingType: catastroData.claseUrbano || "Urbano",
      constructionYear: catastroData.anoConstruccion || undefined
    };
    
    return {
      success: true,
      parcels: [parcelData],
      message: "Información de parcela recuperada con éxito"
    };
    
  } catch (error) {
    console.error("Error en la consulta al Catastro:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
}

/**
 * Obtiene información detallada de los inmuebles en una parcela
 * 
 * @param rc Referencia catastral de la parcela
 * @returns Promesa que se resuelve con un objeto CatastroResponse
 */
export async function getBuildingsByParcelRC(rc: string): Promise<CatastroResponse> {
  try {
    // Llamamos a nuestra API que conecta con el Catastro
    const url = `/api/catastro/refcat/${rc}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || `Error al consultar el Catastro: ${response.status} ${response.statusText}`
      };
    }
    
    const data = await response.json();
    
    // Si la petición fue exitosa pero no hay datos
    if (!data.success) {
      return {
        success: false,
        message: data.message || "No se pudieron obtener datos del Catastro"
      };
    }
    
    // Transformar los datos recibidos al formato esperado
    const catastroData = data.data;
    
    // Crear el objeto inmueble a partir de los datos recibidos
    const buildingData: CatastroBuilding = {
      rc: catastroData.referenciaCatastral,
      area: catastroData.superficieConstruida || "100", // Valor por defecto si no hay dato
      constructionYear: catastroData.anoConstruccion || "2000",
      use: catastroData.usoPrincipal || "Residencial",
      floors: "1", // Este dato no está disponible en nuestra API actual
      condition: "Normal" // Este dato no está disponible en nuestra API actual
    };
    
    return {
      success: true,
      buildings: [buildingData],
      message: "Información de inmueble recuperada con éxito"
    };
    
  } catch (error) {
    console.error("Error al obtener datos de inmuebles:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
}

/**
 * Calcula una valoración estimada basada en los datos del Catastro y factores adicionales
 * 
 * @param parcel Datos de la parcela
 * @param building Datos del inmueble
 * @param additionalFactors Factores adicionales que pueden afectar la valoración
 * @returns Estimación del valor en euros
 */
export function calculateEstimatedValue(
  parcel: CatastroParcel, 
  building: CatastroBuilding, 
  additionalFactors?: {
    neighborhood: string;
    condition: string;
    amenities: string[];
  }
): number {
  // Base de precio por metro cuadrado según el barrio
  const basePrice: {[key: string]: number} = {
    'Vista Alegre': 1850,
    'Santa María de Gracias': 1750,
    'La Flota': 1900,
    'default': 1600
  };
  
  // Obtener el precio base según el barrio o usar el predeterminado
  const neighborhood = additionalFactors?.neighborhood || 'default';
  let pricePerSquareMeter = basePrice[neighborhood] || basePrice.default;
  
  // Ajustar según antigüedad
  const constructionYear = parseInt(building.constructionYear || '2000');
  const currentYear = new Date().getFullYear();
  const age = currentYear - constructionYear;
  
  if (age < 5) {
    pricePerSquareMeter *= 1.2; // Nuevo: +20%
  } else if (age < 15) {
    pricePerSquareMeter *= 1.1; // Relativamente nuevo: +10% 
  } else if (age > 40) {
    pricePerSquareMeter *= 0.85; // Antiguo: -15%
  }
  
  // Ajustar según estado de conservación
  const condition = additionalFactors?.condition || building.condition || 'Normal';
  if (condition === 'Excelente') {
    pricePerSquareMeter *= 1.15;
  } else if (condition === 'Malo') {
    pricePerSquareMeter *= 0.8;
  }
  
  // Calcular valoración base
  const area = parseInt(building.area);
  let estimatedValue = area * pricePerSquareMeter;
  
  // Ajustar por comodidades
  if (additionalFactors?.amenities) {
    if (additionalFactors.amenities.includes('Piscina')) estimatedValue *= 1.1;
    if (additionalFactors.amenities.includes('Garaje')) estimatedValue *= 1.05;
    if (additionalFactors.amenities.includes('Terraza')) estimatedValue *= 1.03;
  }
  
  // Redondear a un número entero
  return Math.round(estimatedValue);
}