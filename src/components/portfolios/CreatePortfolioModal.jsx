import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function CreatePortfolioModal({ open, onClose, onCreate }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onCreate(name);
      setName("");
      onClose();
    } catch (err) {
      alert("Error al crear el portafolio");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <form onSubmit={handleSubmit} className="bg-card rounded-lg shadow-xl max-w-md w-full p-6 space-y-4">
        <h2 className="text-xl font-bold mb-2">Crear Portafolio</h2>
        <div>
          <label className="block mb-1">Nombre</label>
          <input
            className="w-full border rounded px-2 py-1"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            autoFocus
          />
        </div>
        <div className="flex gap-2 mt-4">
          <Button type="submit" disabled={loading || !name.trim()}>
            {loading ? "Creando..." : "Crear"}
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}
