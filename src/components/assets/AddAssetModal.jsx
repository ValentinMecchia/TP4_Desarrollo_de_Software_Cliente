import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { API_BASE_URL } from "@/constants/api";
import { X, Search } from "lucide-react";

export default function AddAssetModal({ open, onClose, onSelect, portfolioId }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearching(true);
    setError("");
    setResults([]);
    try {
      const res = await fetch(`${API_BASE_URL}/api/yahoo/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error("Error buscando acciones");
      const data = await res.json();
      setResults(data.quotes || []);
    } catch (err) {
      setError("No se pudieron obtener resultados.");
    } finally {
      setSearching(false);
    }
  };

  const handleAdd = async () => {
    if (!selected) return;
    if (!portfolioId) return;
    // Puedes pedir cantidad/precio aquí si lo deseas
    await onSelect(selected);
    setSelected(null);
    setQuery("");
    setResults([]);
    onClose();
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-card rounded-lg shadow-xl max-w-xl w-full p-6 relative">
        <button className="absolute top-2 right-2 text-xl" onClick={onClose}>
          <X />
        </button>
        <h2 className="text-xl font-bold mb-4">Buscar Acción</h2>
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <Input
            placeholder="Buscar por nombre o símbolo (ej: AAPL, Tesla, etc)"
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
          />
          <Button type="submit" disabled={searching || !query.trim()}>
            <Search className="h-4 w-4" />
          </Button>
        </form>
        {error && <div className="text-destructive mb-2">{error}</div>}
        {searching && <div className="text-muted-foreground mb-2">Buscando...</div>}
        <div className="max-h-64 overflow-y-auto">
          {results.map((item) => (
            <div
              key={item.symbol}
              className={`flex items-center justify-between p-2 rounded hover:bg-muted/50 cursor-pointer ${selected?.symbol === item.symbol ? "bg-primary/10" : ""}`}
              onClick={() => setSelected(item)}
            >
              <div>
                <span className="font-semibold">{item.shortname || item.symbol}</span>
                <span className="ml-2 text-xs text-muted-foreground">{item.symbol}</span>
                {item.exchange && <span className="ml-2 text-xs text-muted-foreground">{item.exchange}</span>}
              </div>
              {selected?.symbol === item.symbol && (
                <span className="text-primary font-bold">Seleccionado</span>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleAdd} disabled={!selected}>Agregar</Button>
        </div>
      </div>
    </div>
  );
}
