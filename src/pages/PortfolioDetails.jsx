import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/constants/api";
import { ChevronLeft, PlusCircle, Trash2, Pencil } from "lucide-react";
import AddAssetModal from "@/components/assets/AddAssetModal";
import { motion, AnimatePresence } from "framer-motion";

export default function PortfolioDetails({ portfolioId, onBack }) {
  const [portfolio, setPortfolio] = useState(null);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    async function fetchPortfolio() {
      setLoading(true);
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/portfolios/${portfolioId}`,
          { credentials: "include" }
        );
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

  const handleAddAssetFromModal = async (asset) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/portfolios/${portfolioId}/assets`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            name: asset.shortname || asset.symbol,
            symbol: asset.symbol,
            quantity: Number(asset.amount),
            price: Number(asset.pricePerUnit),
          }),
        }
      );
      if (!res.ok) throw new Error("Error adding asset");
      // Recarga el portafolio completo para reflejar los cambios
      const updated = await fetch(
        `${API_BASE_URL}/api/portfolios/${portfolioId}`,
        { credentials: "include" }
      );
      const updatedData = await updated.json();
      setPortfolio(updatedData.portfolio);
      setAssets(updatedData.portfolio.assets || []);
    } catch {
      alert("Error al agregar la acción");
    }
  };

  // Eliminar asset por symbol (no por id)
  const handleDeleteAsset = async (symbol) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta acción?")) return;
    await fetch(
      `${API_BASE_URL}/api/portfolios/${portfolioId}/assets/${symbol}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );
    // Recarga el portafolio completo para reflejar los cambios
    const updated = await fetch(
      `${API_BASE_URL}/api/portfolios/${portfolioId}`,
      { credentials: "include" }
    );
    const updatedData = await updated.json();
    setPortfolio(updatedData.portfolio);
    setAssets(updatedData.portfolio.assets || []);
  };

  // Nueva función para editar cantidad de un asset
  const handleEditAssetQuantity = async (symbol, currentQuantity) => {
    const newQtyStr = window.prompt(
      `Modificar cantidad para ${symbol}:`,
      currentQuantity
    );
    if (newQtyStr === null) return; // Cancelado
    const newQuantity = parseFloat(newQtyStr.replace(",", "."));
    if (isNaN(newQuantity) || newQuantity <= 0) {
      alert("Cantidad inválida.");
      return;
    }
    try {
      // Busca el asset actual para mantener el resto de los datos
      const asset = assets.find((a) => a.symbol === symbol);
      if (!asset) return;
      const res = await fetch(
        `${API_BASE_URL}/api/portfolios/${portfolioId}/assets`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            ...asset,
            quantity: newQuantity,
          }),
        }
      );
      if (!res.ok) throw new Error("Error actualizando cantidad");
      // Recarga el portafolio completo para reflejar los cambios
      const updated = await fetch(
        `${API_BASE_URL}/api/portfolios/${portfolioId}`,
        { credentials: "include" }
      );
      const updatedData = await updated.json();
      setPortfolio(updatedData.portfolio);
      setAssets(updatedData.portfolio.assets || []);
    } catch {
      alert("Error al modificar la cantidad");
    }
  };

  // Evita duplicados en assets por symbol (solo uno por symbol)
  const uniqueAssets = Array.isArray(assets)
    ? assets.filter(
        (asset, idx, arr) =>
          arr.findIndex((a) => a.symbol === asset.symbol) === idx
      )
    : [];

  // Enriquecer assets con cotización en tiempo real
  const [enrichedAssets, setEnrichedAssets] = useState([]);
  const [enriching, setEnriching] = useState(false);

  useEffect(() => {
    async function fetchQuotes() {
      if (!uniqueAssets || uniqueAssets.length === 0) {
        setEnrichedAssets([]);
        return;
      }
      setEnriching(true);
      const results = await Promise.all(
        uniqueAssets.map(async (asset) => {
          try {
            const res = await fetch(
              `${API_BASE_URL}/api/yahoo/market/quotes/realtime/${encodeURIComponent(
                asset.symbol
              )}`
            );
            const data = await res.json();
            const info = data?.body || {};
            let price = info.primaryData?.lastSalePrice;
            if (typeof price === "string")
              price = Number(price.replace(/[$,]/g, ""));
            if ((!price || isNaN(price)) && info.regularMarketPrice)
              price = Number(info.regularMarketPrice);

            let change = info.primaryData?.netChange;
            if (typeof change === "string")
              change = Number(change.replace(/[,]/g, ""));
            if ((!change || isNaN(change)) && info.regularMarketChange)
              change = Number(info.regularMarketChange);

            let changePercent = info.primaryData?.percentageChange;
            if (typeof changePercent === "string")
              changePercent = Number(changePercent.replace(/[%]/g, ""));
            if (
              (!changePercent || isNaN(changePercent)) &&
              info.regularMarketChangePercent
            )
              changePercent = Number(info.regularMarketChangePercent);

            return {
              ...asset,
              realtimePrice: !isNaN(price) ? price : asset.price,
              realtimeChange: !isNaN(change) ? change : 0,
              realtimeChangePercent: !isNaN(changePercent) ? changePercent : 0,
              companyName: info.companyName || asset.name,
            };
          } catch {
            return {
              ...asset,
              realtimePrice: asset.price,
              realtimeChange: 0,
              realtimeChangePercent: 0,
            };
          }
        })
      );
      setEnrichedAssets(results);
      setEnriching(false);
    }
    fetchQuotes();
    // eslint-disable-next-line
  }, [JSON.stringify(uniqueAssets)]);

  // Calcula totales usando los precios en tiempo real
  const total = enrichedAssets.reduce(
    (acc, asset) =>
      acc + (Number(asset.realtimePrice) || 0) * (asset.quantity || 1),
    0
  );
  const totalChange = enrichedAssets.reduce(
    (acc, asset) =>
      acc + (Number(asset.realtimeChange) || 0) * (asset.quantity || 1),
    0
  );
  const totalChangePercent =
    total > 0
      ? ((totalChange / (total - totalChange)) * 100).toFixed(2)
      : "0.00";

  if (loading) {
    return (
      <AnimatePresence>
        <motion.div
          className="flex flex-col items-center justify-center py-16"
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -40, scale: 0.97 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          <span className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4"></span>
          <p className="text-lg text-muted-foreground">Cargando portafolio...</p>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (!portfolio) {
    return (
      <AnimatePresence>
        <motion.div
          className="container mx-auto py-8"
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -40, scale: 0.97 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          <Button variant="ghost" onClick={onBack}>
            <ChevronLeft className="mr-2 h-5 w-5" /> Volver
          </Button>
          <p className="mt-8 text-xl text-destructive">
            Portafolio no encontrado.
          </p>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <motion.div
      className="container mx-auto py-8 max-w-5xl"
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -40, scale: 0.97 }}
      transition={{ duration: 0.5, type: "spring" }}
    >
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
          <CardTitle className="font-headline text-2xl">
            {portfolio.name}
          </CardTitle>
          <CardDescription>
            Fecha de creación: {portfolio.createdDate || "-"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-4">
            <div>
              <span className="font-bold text-lg">Total invertido: </span>
              <span className="text-xl font-bold text-primary">
                $
                {total.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            <div>
              <span className="font-semibold">Variación diaria: </span>
              <span
                className={
                  totalChange >= 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-500 dark:text-red-400"
                }
              >
                {totalChange >= 0 ? "$" : "$"}
                {totalChange.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                ({totalChangePercent}%)
              </span>
            </div>
            <Button size="sm" onClick={() => setShowAddModal(true)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Agregar Acción
            </Button>
          </div>
          <div>
            <span className="font-semibold">Acciones en portafolio:</span>
            {enriching && (
              <span className="ml-2 text-xs text-muted-foreground">
                Actualizando cotizaciones...
              </span>
            )}
            <div className="overflow-x-auto mt-2 rounded-md">
              <table className="w-full text-sm rounded border">
                <thead>
                  <tr className="border-b bg-muted">
                    <th className="text-left py-2 px-2">Símbolo</th>
                    <th className="text-left py-2 px-2">Nombre</th>
                    <th className="text-right py-2 px-2">Cantidad</th>
                    <th className="text-right py-2 px-2">Precio unitario</th>
                    <th className="text-right py-2 px-2">Variación</th>
                    <th className="text-right py-2 px-2">Total</th>
                    <th className="text-right py-2 px-2">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {enrichedAssets.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="text-center py-4 text-muted-foreground"
                      >
                        No hay acciones en este portafolio.
                      </td>
                    </tr>
                  ) : (
                    enrichedAssets.map((asset) => (
                      <tr
                        key={asset.symbol}
                        className="border-b bg-muted/50 hover:bg-muted/80 transition"
                      >
                        <td className="py-2 px-2 font-bold">{asset.symbol}</td>
                        <td className="py-2 px-2">
                          {asset.companyName || asset.name || "-"}
                        </td>
                        <td className="py-2 px-2 text-right">
                          {asset.quantity}
                        </td>
                        <td className="py-2 px-2 text-right">
                          {asset.realtimePrice !== undefined &&
                          asset.realtimePrice !== null
                            ? `$${Number(asset.realtimePrice).toLocaleString(
                                undefined,
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }
                              )}`
                            : "-"}
                        </td>
                        <td
                          className={`py-2 px-2 text-right ${
                            Number(asset.realtimeChange) >= 0
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-500 dark:text-red-400"
                          }`}
                        >
                          {Number(asset.realtimeChange) >= 0 ? "+" : ""}
                          ${Number(asset.realtimeChange).toLocaleString(
                            undefined,
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}{" "}
                          (
                          {Number(asset.realtimeChangePercent).toLocaleString(
                            undefined,
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}
                          %)
                        </td>
                        <td className="py-2 px-2 text-right">
                          {asset.realtimePrice !== undefined &&
                          asset.realtimePrice !== null
                            ? `$${(
                                Number(asset.realtimePrice) *
                                (asset.quantity || 1)
                              ).toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}`
                            : "-"}
                        </td>
                        <td className="py-2 px-2 text-right flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="icon"
                            aria-label="Editar cantidad"
                            onClick={() =>
                              handleEditAssetQuantity(
                                asset.symbol,
                                asset.quantity
                              )
                            }
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            aria-label="Eliminar"
                            onClick={() => handleDeleteAsset(asset.symbol)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
