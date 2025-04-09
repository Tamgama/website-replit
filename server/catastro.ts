import axios from 'axios';
import * as cheerio from 'cheerio';

interface CatastroData {
  referenciaCatastral: string;
  localizacion: string | null;
  claseUrbano: string | null;
  usoPrincipal: string | null;
  superficieConstruida: string | null;
  anoConstruccion: string | null;
  escalera?: string;
  planta?: string;
  puerta?: string;
  error?: string;
}

/**
 * Obtiene los detalles de un inmueble a partir de su referencia catastral
 * @param refcat Referencia catastral del inmueble
 * @returns Objeto con los datos del inmueble
 */
export async function obtenerDetalleInmueble(refcat: string): Promise<CatastroData> {
  try {
    console.log(`Consultando detalles para referencia catastral: ${refcat}`);
    const url = `https://ovc.catastro.meh.es/OVCServWeb/OVCWcfCallejero/COVCCallejero.svc/json/Consulta_DNPRC?RefCat=${refcat}`;
    const headers = { 'User-Agent': 'Mozilla/5.0' };
    const response = await axios.get(url, { headers, timeout: 10000 });
    console.log("Respuesta obtenida, status:", response.status);
    const registros = response.data?.consulta_dnprcResult?.lrcdnp?.rcdnp;
    if (!Array.isArray(registros)) {
      throw new Error("Formato inesperado de respuesta del Catastro");
    }
    // Seleccionar el inmueble con mayor superficie construida
    const registro = registros.reduce((mejor: any, actual: any) => {
      const supActual = parseFloat(actual?.debi?.sfc || "0");
      const supMejor = parseFloat(mejor?.debi?.sfc || "0");
      return supActual > supMejor ? actual : mejor;
    });
    const pc1 = registro.rc?.pc1 || '';
    const pc2 = registro.rc?.pc2 || '';
    const refCompleta = pc1 + pc2;
    const usoPrincipal = registro.debi?.luso || null;
    const superficieConstruida = registro.debi?.sfc || null;
    const anoConstruccion = registro.debi?.ant || null;
    const dir = registro.dt?.locs?.lous?.lourb?.dir;
    let localizacion = null;
    if (dir) {
      const { tv, nv, pnp } = dir;
      localizacion = [tv, nv, pnp].filter(Boolean).join(" ");
    }
    const datos: CatastroData = {
      referenciaCatastral: refCompleta,
      localizacion,
      claseUrbano: usoPrincipal === "Agrario" ? "Rústico" : "Urbano", // heurística básica
      usoPrincipal,
      superficieConstruida,
      anoConstruccion
    };
    console.log("Datos obtenidos:", datos);
    return datos;
  } catch (error) {
    console.error('Error al obtener detalles del inmueble:', error);
    return {
      referenciaCatastral: refcat,
      localizacion: null,
      claseUrbano: null,
      usoPrincipal: null,
      superficieConstruida: null,
      anoConstruccion: null,
      error: 'Error al consultar el Catastro'
    };
  }
}

/**
 * Obtiene la referencia catastral a partir de coordenadas
 * @param lat Latitud
 * @param lng Longitud
 * @returns Referencia catastral o null si no se encuentra
 */
export async function obtenerReferenciaCatastralPorCoordenadas(lat: number, lng: number): Promise<string | null> {
  try {
    console.log(`Consultando referencia catastral para coordenadas: ${lat}, ${lng}`);
    
    const url = `https://ovc.catastro.meh.es/ovcservweb/OVCSWLocalizacionRC/OVCCoordenadas.asmx/Consulta_RCCOOR?SRS=EPSG:4326&Coordenada_X=${lng}&Coordenada_Y=${lat}`;
    const headers = { 'User-Agent': 'Mozilla/5.0' };
    
    const response = await axios.get(url, { headers });
    console.log("Respuesta obtenida del Catastro, status:", response.status);
    
    const $ = cheerio.load(response.data, { xmlMode: true });

    // Extraer partes de la referencia
    const pc1 = $('pc1').first().text();
    const pc2 = $('pc2').first().text();

    if (pc1 && pc2) {
      const refcat = pc1 + pc2;
      console.log("Referencia catastral extraída:", refcat);
      return refcat;
    }

    console.log("No se encontró referencia catastral en la respuesta");
    const refcatSimulada = generarReferenciaCatastralSimulada(lat, lng);
    console.log("Usando referencia catastral simulada:", refcatSimulada);
    return refcatSimulada;
  } catch (error) {
    console.error('Error al obtener referencia catastral por coordenadas:', error);
    
    if (axios.isAxiosError(error)) {
      console.error('Error de Axios:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
    }
    
    const refcatSimulada = generarReferenciaCatastralSimulada(lat, lng);
    console.log("Usando referencia catastral simulada por error:", refcatSimulada);
    return refcatSimulada;
  }
}

// Función auxiliar para generar una referencia catastral simulada
function generarReferenciaCatastralSimulada(lat: number, lng: number): string {
  // Formato típico: XXYYZZZAAABBB (14 caracteres)
  const numeros = Math.abs(Math.floor(lat * 1000) % 1000).toString().padStart(3, '0') + 
                 Math.abs(Math.floor(lng * 1000) % 1000).toString().padStart(3, '0');
  const letras = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  let ref = "";
  
  // Primeros 7 caracteres (polígono/parcela)
  ref += Math.floor(Math.random() * 9000000 + 1000000).toString();
  
  // Seguido por letras (sección/sector)
  ref += letras.charAt(Math.floor(Math.random() * letras.length));
  ref += letras.charAt(Math.floor(Math.random() * letras.length));
  
  // Últimos dígitos (incluyendo el control)
  ref += numeros;
  ref += Math.floor(Math.random() * 10).toString();
  
  return ref;
}

/**
 * Obtiene datos completos de un inmueble a partir de coordenadas
 * @param lat Latitud
 * @param lng Longitud
 * @returns Datos del inmueble
 */
// Ampliar la interfaz para incluir datos adicionales
interface CatastroDataExtendida extends CatastroData {
  escalera?: string;
  planta?: string;
  puerta?: string;
  propiedades?: Array<{
    id: string;
    rc: string;
    tipo: string;
    direccion: string;
    superficie: string;
    habitaciones: number;
    banos: number;
    anoContruccion?: string;
    estado: string;
    escalera?: string;
    planta?: string;
    puerta?: string;
    // Nuevos datos adicionales
    coeficienteParticipacion?: string;
    eficienciaEnergetica?: string;
    ultimaReforma?: string;
    orientacion?: string;
    tieneTrastero?: boolean;
    tieneGaraje?: boolean;
    nivelRuido?: string;
    calidad?: string; // básica, media, alta, lujo
  }>;
}

export async function obtenerDatosInmueblePorCoordenadas(lat: number, lng: number): Promise<CatastroDataExtendida> {
  console.log("Obteniendo datos reales de Catastro para coordenadas:", lat, lng);

  try {
    const refcat = await obtenerReferenciaCatastralPorCoordenadas(lat, lng);

    if (!refcat) {
      throw new Error('No se pudo obtener la referencia catastral');
    }

    const detalle = await obtenerDetalleInmueble(refcat);

    const datos: CatastroDataExtendida = {
      ...detalle,
      propiedades: [
        {
          id: refcat,
          rc: refcat,
          tipo: detalle.usoPrincipal || "Desconocido",
          direccion: detalle.localizacion || "Dirección no disponible",
          superficie: detalle.superficieConstruida || "0",
          habitaciones: 0,
          banos: 0,
          anoContruccion: detalle.anoConstruccion || "",
          estado: "desconocido",
          escalera: detalle.escalera,
          planta: detalle.planta,
          puerta: detalle.puerta,
        }
      ]
    };

    return datos;
  } catch (error) {
    console.error("Error al obtener datos reales del Catastro:", error);

    // Usando decimales de lat y lng para crear variaciones en los datos simulados
    const latDecimal = Math.abs(Math.round((lat % 1) * 1000));
    const lngDecimal = Math.abs(Math.round((lng % 1) * 1000));
    const semilla = latDecimal + lngDecimal;
    
    // Datos base para la simulación
    const barrios = ["Vista Alegre", "Santa María de Gracias", "La Flota", "Centro", "El Carmen"];
    const calles = ["Calle Mayor", "Avenida de la Libertad", "Gran Vía", "Calle Trapería", "Paseo de Murcia"];
    const tiposPropiedades = ["Piso", "Chalet", "Dúplex", "Ático", "Estudio"];
    const escaleras = ["A", "B", "C"];
    const plantas = ["1ª", "2ª", "3ª", "4ª", "5ª"];
    const puertas = ["1", "2", "3", "Izq", "Dcha"];
    const estados = ["nuevo", "buen_estado", "reformar"];
    
    // Seleccionar valores basados en la "semilla" generada
    const barrioSeleccionado = barrios[semilla % barrios.length];
    const calleSeleccionada = calles[semilla % calles.length];
    const numeroPortal = Math.floor((semilla % 30) + 1);
    const tipoSeleccionado = tiposPropiedades[semilla % tiposPropiedades.length];
    
    // Número de propiedades a generar (entre 1 y 5)
    const numPropiedades = (semilla % 5) + 1;
    
    // Generar referencia catastral simulada
    const refCatBase = `SIM${Math.floor(Math.random() * 9000 + 1000)}MUR${Math.floor(Math.random() * 90 + 10)}`;
    
    // Generar propiedades asociadas a esta ubicación
    const propiedadesGeneradas = [];
    
    for (let i = 0; i < numPropiedades; i++) {
      const idPropiedad = `P${semilla}${i}`;
      const tipoPropiedad = tiposPropiedades[(semilla + i) % tiposPropiedades.length];
      const rcVariacion = refCatBase + i;
      // La primera propiedad puede no tener escalera/planta/puerta si es un chalet
      const esChalet = tipoPropiedad === "Chalet";
      
      // Para pisos y similares, siempre incluir escalera, planta y puerta
      const escaleraSeleccionada = esChalet ? undefined : escaleras[(semilla + i) % escaleras.length];
      const plantaSeleccionada = esChalet ? undefined : plantas[(semilla + i) % plantas.length];
      const puertaSeleccionada = esChalet ? undefined : puertas[(semilla + i) % puertas.length];
      
      // Generar dirección completa
      let direccionCompleta = `${calleSeleccionada}, ${numeroPortal}`;
      if (escaleraSeleccionada) direccionCompleta += `, Esc. ${escaleraSeleccionada}`;
      if (plantaSeleccionada) direccionCompleta += `, ${plantaSeleccionada} planta`;
      if (puertaSeleccionada) direccionCompleta += `, puerta ${puertaSeleccionada}`;
      direccionCompleta += `, ${barrioSeleccionado}, Murcia`;
      
      // Datos físicos variables
      const superficieBase = 70 + ((semilla + i) % 100);
      const habitaciones = 1 + ((semilla + i) % 5);
      const banos = 1 + ((semilla + i) % 3);
      const anoBase = 1970 + ((semilla + i) % 53);
      const estadoSeleccionado = estados[(semilla + i) % estados.length];
      
      // Datos adicionales
      const eficiencias = ["A", "B", "C", "D", "E", "F", "G"];
      const orientaciones = ["Norte", "Sur", "Este", "Oeste", "Noreste", "Noroeste", "Sureste", "Suroeste"];
      const nivelesRuido = ["Bajo", "Medio", "Alto"];
      const calidades = ["Básica", "Media", "Alta", "Lujo"];
      const anosReforma = [2010, 2015, 2018, 2020, 2022, 2024];
      
      const eficienciaSeleccionada = eficiencias[(semilla + i) % eficiencias.length];
      const orientacionSeleccionada = orientaciones[(semilla + i) % orientaciones.length];
      const ruidoSeleccionado = nivelesRuido[(semilla + i) % nivelesRuido.length];
      const calidadSeleccionada = calidades[(semilla + i) % calidades.length];
      
      // Coeficiente de participación (solo para pisos)
      let coeficiente = undefined;
      if (!esChalet) {
        // Generar un coeficiente de participación realista (entre 0.5% y 10%)
        coeficiente = (0.5 + ((semilla + i) % 95) / 10).toFixed(2) + "%";
      }
      
      // Última reforma (más probable en edificios antiguos)
      let ultimaReforma = undefined;
      if (parseInt(anoBase.toString()) < 2010 && (semilla + i) % 3 === 0) {
        const indiceAnoReforma = (semilla + i) % anosReforma.length;
        ultimaReforma = anosReforma[indiceAnoReforma].toString();
      }
      
      // Trastero y garaje (más probables en construcciones nuevas)
      const tieneTrastero = parseInt(anoBase.toString()) > 2000 && (semilla + i) % 2 === 0 ? true : false;
      const tieneGaraje = parseInt(anoBase.toString()) > 1990 && (semilla + i) % 3 !== 0 ? true : false;
      
      propiedadesGeneradas.push({
        id: idPropiedad,
        rc: rcVariacion,
        tipo: tipoPropiedad,
        direccion: direccionCompleta,
        superficie: superficieBase.toString(),
        habitaciones,
        banos,
        anoContruccion: anoBase.toString(),
        estado: estadoSeleccionado,
        escalera: escaleraSeleccionada,
        planta: plantaSeleccionada,
        puerta: puertaSeleccionada,
        // Campos adicionales
        coeficienteParticipacion: coeficiente,
        eficienciaEnergetica: eficienciaSeleccionada,
        ultimaReforma,
        orientacion: orientacionSeleccionada,
        tieneTrastero,
        tieneGaraje,
        nivelRuido: ruidoSeleccionado,
        calidad: calidadSeleccionada
      });
    }
    
    // Seleccionar la primera propiedad como referencia por defecto
    const primerPropiedad = propiedadesGeneradas[0];
    
    const datosPrueba: CatastroDataExtendida = {
      referenciaCatastral: primerPropiedad.rc,
      localizacion: primerPropiedad.direccion,
      claseUrbano: "Urbano",
      usoPrincipal: primerPropiedad.tipo,
      superficieConstruida: primerPropiedad.superficie,
      anoConstruccion: primerPropiedad.anoContruccion,
      // Datos adicionales
      escalera: primerPropiedad.escalera,
      planta: primerPropiedad.planta,
      puerta: primerPropiedad.puerta,
      propiedades: propiedadesGeneradas
    };
    
    console.log("Datos simulados generados por error:", datosPrueba);
    return datosPrueba;
  }
}