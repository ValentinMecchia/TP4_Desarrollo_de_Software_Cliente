import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { API_BASE_URL } from "@/constants/api";
import { ChevronLeft, PlusCircle, Trash2 } from "lucide-react";
import AddAssetModal from "@/components/assets/AddAssetModal";

export default function PortfolioDetails({ portfolioId, onBack }) {
  const [portfolio, setPortfolio] = useState(null);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    async function fetchPortfolio() {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/portfolios/${portfolioId}`, { credentials: "include" });
        if (!res.ok) throw new Error("Error fetching portfolio");
        const data = await res.json();
        setPortfolio(data.portfolio);
        setAssets(data.portfolio.assets || []);
      } catch {
        setPortfolio(null);
        setAssets([]);
      } finally {
        setLoading(false);
      }
    }
    if (portfolioId) fetchPortfolio();
  }, [portfolioId]);

  const handleAddAsset = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/portfolios/${portfolioId}/assets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: newAsset.name,
          symbol: newAsset.symbol,
          quantity: Number(newAsset.quantity),
          price: Number(newAsset.price),
        }),
      });
      if (!res.ok) throw new Error("Error adding asset");
      const data = await res.json();
      setAssets((prev) => [...prev, data.asset]);
      setShowAdd(false);
      setNewAsset({ name: "", symbol: "", quantity: "", price: "" });
    } catch {
      alert("Error al agregar la acción");
    }
  };

  const handleAddAssetFromModal = async (asset) => {
    // Puedes pedir cantidad/precio aquí si lo deseas (prompt, modal, etc)
    const quantity = prompt("Cantidad a agregar:", "1");
    const price = prompt("Precio de compra:", "0");
    if (!quantity || !price) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/portfolios/${portfolioId}/assets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: asset.shortname || asset.symbol,
          symbol: asset.symbol,
          quantity: Number(quantity),
          price: Number(price),
        }),
      });
      if (!res.ok) throw new Error("Error adding asset");
      const data = await res.json();
      setAssets((prev) => [...prev, data.asset]);
    } catch {
      alert("Error al agregar la acción");
    }
  };

  const handleDeleteAsset = async (assetId) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta acción?")) return;
    await fetch(`${API_BASE_URL}/api/portfolios/${portfolioId}/assets/${assetId}`, {
      method: "DELETE",
      credentials: "include",
    });
    setAssets((prev) => prev.filter((a) => a.id !== assetId));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <span className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4"></span>
        <p className="text-lg text-muted-foreground">Cargando portafolio...</p>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="container mx-auto py-8">
        <Button variant="ghost" onClick={onBack}>
          <ChevronLeft className="mr-2 h-5 w-5" /> Volver
        </Button>
        <p className="mt-8 text-xl text-destructive">Portafolio no encontrado.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <AddAssetModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSelect={handleAddAssetFromModal}
        portfolioId={portfolioId}
      />
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ChevronLeft className="mr-2 h-5 w-5" /> Volver
      </Button>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">{portfolio.name}</CardTitle>
          <CardDescription>
            Fecha de creación: {portfolio.createdDate || "-"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Acciones</h2>
            <Button size="sm" onClick={() => setShowAddModal(true)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Agregar Acción
            </Button>
          </div>
          {assets.length === 0 ? (
            <p className="text-muted-foreground">No hay acciones en este portafolio.</p>
          ) : (
            <table className="w-full text-sm mt-2">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Nombre</th>
                  <th className="text-left py-2">Símbolo</th>
                  <th className="text-right py-2">Cantidad</th>
                  <th className="text-right py-2">Precio</th>
                  <th className="text-right py-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {assets.map((asset) => (
                  <tr key={asset.id} className="border-b">
                    <td>{asset.name}</td>
                    <td>{asset.symbol}</td>
                    <td className="text-right">{asset.quantity}</td>
                    <td className="text-right">${asset.price}</td>
                    <td className="text-right">
                      <Button
                        variant="destructive"
                        size="icon"
                        aria-label="Eliminar"
                        onClick={() => handleDeleteAsset(asset.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
