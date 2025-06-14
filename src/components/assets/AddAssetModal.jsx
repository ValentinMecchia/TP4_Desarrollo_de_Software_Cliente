import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Search, ArrowLeft, PlusCircle } from "lucide-react";
import { API_BASE_URL } from "@/constants/api";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";



function SearchResults({ results, onSelect, selectedSymbol }) {
  // Ya no solicita a la API para el precio, solo muestra el que viene en results
  // Ordenar por score descendente si existe
  const sortedResults = [...results].sort((a, b) => {
    const scoreA = typeof a.score === "number" ? a.score : -Infinity;
    const scoreB = typeof b.score === "number" ? b.score : -Infinity;
    return scoreB - scoreA;
  });

  return (
    <ul className="max-h-64 overflow-y-auto divide-y divide-border rounded-lg border">
      {sortedResults.map((item) => (
        <li
          key={item.symbol}
          className={`flex items-center justify-between px-4 py-2 cursor-pointer transition-colors
            ${
              selectedSymbol === item.symbol
                ? "bg-primary/10 dark:bg-primary/20 font-semibold"
                : "hover:bg-muted/80 dark:hover:bg-muted/60"
            }`}
          onClick={() => onSelect(item)}
        >
          <div className="flex flex-col">
            <span className="font-bold text-primary text-base">
              {item.symbol}
            </span>
            <span className="text-xs text-muted-foreground">
              {item.longName || item.shortname || "-"}
            </span>
          </div>
          <div className="flex flex-col items-end min-w-[80px]">
            {item.regularMarketPrice !== undefined ? (
              <span className="font-normal text-sm text-muted-foreground">
                {item.regularMarketPrice !== null ? item.regularMarketPrice : ""}
              </span>
            ) : (
              <span className="text-xs text-muted-foreground"></span>
            )}
            {item.regularMarketChange !== undefined &&
              item.regularMarketChangePercent !== undefined && (
                <span
                  className={`text-xs ${
                    item.regularMarketChange >= 0
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-500 dark:text-red-400"
                  }`}
                >
                  {item.regularMarketChange >= 0 ? "+" : ""}
                  {item.regularMarketChange} ({item.regularMarketChangePercent}
                  %)
                </span>
              )}
          </div>
        </li>
      ))}
    </ul>
  );
}

// Componente comprimido con gráfico para detalles
function AssetDetailsCompact({ symbol, onBack, onAdd, canAdd }) {
  const [details, setDetails] = useState(null);
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(1);

  useEffect(() => {
    if (!symbol) {
      setDetails(null);
      setPrices([]);
      return;
    }
    setLoading(true);
    Promise.all([
      fetch(
        `${API_BASE_URL}/api/yahoo/market/quotes/realtime/${encodeURIComponent(
          symbol
        )}`
      ).then((res) => res.json()),
      fetch(
        `${API_BASE_URL}/api/yahoo/market/quotes/history/${encodeURIComponent(
          symbol
        )}`
      ).then((res) => res.json()),
    ])
      .then(([summaryData, historyData]) => {
        setDetails(summaryData?.body || {});
        const arr =
          Array.isArray(historyData?.data?.items) ||
          Array.isArray(historyData?.body)
            ? historyData.data?.items || historyData.body
            : [];
        setPrices(arr);
      })
      .catch(() => {
        setDetails(null);
        setPrices([]);
      })
      .finally(() => setLoading(false));
  }, [symbol]);

  const info = details || {};
  let chartData = [];
  if (Array.isArray(prices)) {
    chartData = prices
      .map((item) => ({
        date: item.timestamp
          ? new Date(item.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })
          : item.formattedDate || "",
        price: item.close ?? item.price ?? item.last ?? null,
      }))
      .filter((d) => d.price !== null);
  }

  // Calcula el precio unitario y variación
  const pricePerUnit =
    Number(info.primaryData?.lastSalePrice) ||
    Number(info.regularMarketPrice) ||
    0;
  const variation =
    Number(info.primaryData?.netChange) ||
    Number(info.regularMarketChange) ||
    0;

  return (
    <div className="w-full flex flex-col px-1 sm:px-2 py-2">
      <div className="flex items-center gap-2 mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="hover:bg-muted"
        >
          <ArrowLeft className="text-primary" />
        </Button>
        <div className="flex flex-col flex-1">
          <span className="font-bold text-xl text-primary">
            {info.symbol || ""}
          </span>
          <span className="text-sm text-muted-foreground truncate">
            {info.companyName || info.longName || ""}
          </span>
        </div>
      </div>
      {loading ? (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          <span className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full mr-3"></span>
          Cargando detalles...
        </div>
      ) : details && info.symbol ? (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-muted rounded-lg p-3 border border-border flex flex-col items-start">
              <span className="uppercase text-[10px] text-muted-foreground tracking-widest">
                Exchange
              </span>
              <span className="text-base font-semibold text-primary">
                {info.exchange || "-"}
              </span>
            </div>
            <div className="bg-muted rounded-lg p-3 border border-border flex flex-col items-start">
              <span className="uppercase text-[10px] text-muted-foreground tracking-widest">
                Precio actual
              </span>
              <span className="text-lg font-bold text-primary">
                {info.primaryData?.lastSalePrice || "-"}
              </span>
            </div>
            <div className="bg-muted rounded-lg p-3 border border-border flex flex-col items-start">
              <span className="uppercase text-[10px] text-muted-foreground tracking-widest">
                Variación diaria
              </span>
              <span
                className={
                  (info.primaryData?.netChange?.startsWith("-")
                    ? "text-red-500 dark:text-red-400"
                    : "text-green-600 dark:text-green-400") +
                  " text-base font-semibold"
                }
              >
                {"$" + (info.primaryData?.netChange || "-")}{" "}
                <span className="text-muted-foreground">
                  ({info.primaryData?.percentageChange || "-"})
                </span>
              </span>
            </div>
          </div>
          {chartData.length > 1 && (
            <div className="mt-2">
              <span className="font-semibold text-xs block mb-1">
                Evolución diaria (últimas cotizaciones)
              </span>
              <div className="w-full h-40 bg-muted/40 rounded-lg p-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{ top: 10, right: 30, left: 10, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" />
                    <XAxis
                      dataKey="date"
                      minTickGap={16}
                      fontSize={12}
                      tick={{ fill: "#64748b" }}
                      tickLine={false}
                      axisLine={{ stroke: "#cbd5e1" }}
                      label={{
                        value: "Hora de cotización",
                        position: "insideBottom",
                        offset: -10,
                        fill: "#64748b",
                        fontSize: 12,
                      }}
                    />
                    <YAxis
                      domain={["auto", "auto"]}
                      fontSize={12}
                      tick={{ fill: "#64748b" }}
                      tickLine={false}
                      axisLine={{ stroke: "#cbd5e1" }}
                      width={50}
                      label={{
                        value: "Precio ($)",
                        angle: -90,
                        position: "insideLeft",
                        offset: 0,
                        fill: "#64748b",
                        fontSize: 12,
                        style: { textAnchor: "middle" },
                      }}
                      labelProps={{
                        style: { textAnchor: "middle" },
                      }}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#1e293b",
                        border: "none",
                        borderRadius: "8px",
                        color: "#fff",
                        fontSize: "12px",
                      }}
                      labelStyle={{ color: "#fff" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="#2563eb"
                      strokeWidth={2.5}
                      dot={false}
                      activeDot={{ r: 5, fill: "#2563eb", stroke: "#fff", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
          {canAdd && info.symbol && (
            <div className="flex flex-col sm:flex-row items-center gap-2 mt-4 justify-between">
              <Input
                type="number"
                min={0.01}
                step="any"
                value={amount}
                onChange={e => {
                  // Permite borrar el input y escribir cualquier valor válido
                  const val = e.target.value;
                  if (val === "" || isNaN(Number(val))) {
                    setAmount("");
                  } else {
                    setAmount(Number(val));
                  }
                }}
                className="w-24"
                placeholder="Cantidad"
              />
              <div className="flex gap-2 w-full sm:w-auto">
                <Button variant="outline" onClick={onBack}>
                  Cancelar
                </Button>
                <Button
                  onClick={() => {
                    // Solo permite cantidades mayores a 0 y no vacío
                    if (amount > 0) {
                      onAdd({
                        ...info,
                        amount,
                        pricePerUnit: pricePerUnit.toFixed(2),
                        variation: variation.toFixed(2),
                        totalValue: (pricePerUnit * amount).toFixed(2),
                      });
                    }
                  }}
                  disabled={amount === "" || Number(amount) <= 0}
                >
                  <PlusCircle className="mr-2 h-5 w-5" /> Agregar
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-destructive">
          No se encontraron datos para este activo.
        </div>
      )}
    </div>
  );
}

export default function AddAssetModal({
  open,
  onClose,
  onSelect,
  portfolioId,
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);

  // Guardar asset en la base de datos y notificar al padre para que recargue el portafolio
  const handleAdd = async (asset) => {
    if (!asset || !portfolioId) return;
    try {
      await fetch(`${API_BASE_URL}/api/portfolios/${portfolioId}/assets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(asset),
      });
      if (onSelect) onSelect(asset); // Notifica al padre para que recargue el portafolio
    } catch (err) {
      // Manejo simple de error
    }
    setSelected(null);
    setQuery("");
    setResults([]);
    onClose();
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    setError("");
    setResults([]);
    setSelected(null);

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/yahoo/search/${encodeURIComponent(query.trim())}`
      );
      const data = await res.json();

      const arr = Array.isArray(data?.body)
        ? data.body
        : Array.isArray(data?.data?.items)
        ? data.data.items
        : Array.isArray(data?.items)
        ? data.items
        : [];

      const normalized = arr
        .map((item) => ({
          symbol: item.symbol || item.ticker || item.code || "",
          longName: item.longname || item.name || item.shortname || "",
          shortname: item.shortname || item.name || item.longname || "",
          regularMarketPrice:
            item.regularMarketPrice ?? item.price ?? undefined,
          regularMarketChange: item.regularMarketChange ?? undefined,
          regularMarketChangePercent:
            item.regularMarketChangePercent ?? undefined,
        }))
        .filter((item) => item.symbol);

      setResults(normalized);
    } catch (err) {
      setError("Error buscando activos.");
    } finally {
      setSearching(false);
    }
  };

  const handleBackToSearch = () => setSelected(null);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-card rounded-lg shadow-xl max-w-xl w-full p-6 relative overflow-hidden">
        <button
          className="absolute top-2 right-2 text-xl"
          onClick={onClose}
          aria-label="Cerrar"
        >
          <X />
        </button>

        <h2 className="text-xl font-bold mb-4">Buscar Acción</h2>

        {!selected ? (
          <>
            <form onSubmit={handleSearch} className="flex gap-2 mb-4">
              <Input
                placeholder="Buscar por nombre o símbolo (ej: AAPL, Tesla, etc)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
              <Button type="submit" disabled={searching || !query.trim()}>
                <Search className="h-4 w-4" />
              </Button>
            </form>

            {error && <div className="text-destructive mb-2">{error}</div>}

            {searching && (
              <div className="text-muted-foreground mb-2">Buscando...</div>
            )}

            {results.length > 0 && (
              <SearchResults
                results={results}
                onSelect={setSelected}
                selectedSymbol={selected?.symbol}
              />
            )}

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
            </div>
          </>
        ) : (
          <AssetDetailsCompact
            symbol={selected.symbol}
            onBack={handleBackToSearch}
            onAdd={handleAdd}
            canAdd={true}
          />
        )}
      </div>
    </div>
  );
}
