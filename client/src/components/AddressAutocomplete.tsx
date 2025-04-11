import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

interface Props {
  value: string;
  onChange: (val: string) => void;
  onPlaceSelect?: (place: any) => void;
}

const AddressAutocomplete = ({ value, onChange, onPlaceSelect }: Props) => {
  const [provincias, setProvincias] = useState<string[]>([]);
  const [municipios, setMunicipios] = useState<string[]>([]);
  const [vias, setVias] = useState<{ nv: string; tv: string }[]>([]);

  const [provincia, setProvincia] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [via, setVia] = useState("");
  const [numero, setNumero] = useState("");
  const [tipoViaSeleccionado, setTipoViaSeleccionado] = useState<string | null>(null);

  const viaDebounced = useDebounce(via, 300);

  useEffect(() => {
    fetch("/api/catastro/provincias")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.provincias)) {
          const nombresLimpios = data.provincias.map((p: string) =>
            p.trim().replace(/^[^a-zA-ZÀ-ÿ]+\s*/, "").replace(/\s+[^a-zA-ZÀ-ÿ]+$/, "")
          );
          setProvincias(nombresLimpios);
        } else {
          console.error("Formato de provincias no válido:", data);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (provincia) {
      fetch(`/api/catastro/municipios?provincia=${encodeURIComponent(provincia)}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data.municipios)) {
            const nombresLimpios = data.municipios.map((p: string) =>
              p.trim().replace(/\s+\d+(\s+\d+)*$/, "")
            );
            setMunicipios(nombresLimpios);
          } else {
            console.error("Formato de municipios no válido:", data);
          }
        })
        .catch(console.error);
    }
  }, [provincia]);

  useEffect(() => {
    if (provincia && municipio && viaDebounced.trim().length >= 3) {
      fetch(
        `/api/catastro/vias?provincia=${encodeURIComponent(provincia)}&municipio=${encodeURIComponent(municipio)}&via=${encodeURIComponent(viaDebounced)}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data.vias)) setVias(data.vias);
          else setVias([]);
        })
        .catch((err) => {
          console.error("Error cargando vías:", err);
          setVias([]);
        });
    } else {
      setVias([]);
    }
  }, [viaDebounced, municipio, provincia]);

  const buscar = async () => {
    try {
      const res = await fetch("/api/catastro/busqueda", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provincia, municipio, via, numero, tipoVia: tipoViaSeleccionado }),
      });

      const result = await res.json();

      if (result?.propiedades?.length > 0 && onPlaceSelect) {
        onChange(`${via} ${numero}, ${municipio}, ${provincia}`);
        onPlaceSelect({
          address: `${via} ${numero}, ${municipio}`,
          rc: result.propiedades[0].referenciaCatastral,
          location: null,
          propiedades: result.propiedades,
        });
      } else {
        alert("No se encontró la dirección en el Catastro.");
      }
    } catch (err) {
      console.error("Error buscando en Catastro:", err);
    }
  };

  return (
    <div className="grid gap-4">
      <Select onValueChange={setProvincia}>
        <SelectTrigger>
          <SelectValue placeholder="Provincia" />
        </SelectTrigger>
        <SelectContent>
          {provincias.map((p) => (
            <SelectItem key={p} value={p}>
              {p}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select onValueChange={setMunicipio} disabled={!provincia}>
        <SelectTrigger>
          <SelectValue placeholder="Municipio" />
        </SelectTrigger>
        <SelectContent>
          {municipios.map((m) => (
            <SelectItem key={m} value={m}>
              {m}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="relative">
        <Input
          placeholder="Nombre de la vía"
          value={via}
          onChange={(e) => setVia(e.target.value)}
        />
        {vias.length > 0 && (
          <ul className="absolute z-10 bg-white shadow border w-full mt-1 max-h-48 overflow-auto">
            {vias.map((v) => (
              <li
                key={v.nv}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setVia(v.nv);
                  setTipoViaSeleccionado(v.tv);
                  setVias([]);
                }}
              >
                {v.nv}
              </li>
            ))}
          </ul>
        )}
      </div>

      <Input
        placeholder="Número"
        value={numero}
        onChange={(e) => setNumero(e.target.value)}
      />

      <button
        type="button"
        onClick={buscar}
        className="px-4 py-2 bg-blue-600 text-white rounded-md"
      >
        Buscar en Catastro
      </button>
    </div>
  );
};

export default AddressAutocomplete;
