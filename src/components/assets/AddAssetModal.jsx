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

// Resultados de búsqueda con estilo moderno y soporte dark
function SearchResults({ results, onSelect, selectedSymbol }) {
  return (
    <ul className="max-h-64 overflow-y-auto divide-y divide-border rounded-lg shadow border border-border bg-muted/60 dark:bg-muted/80">
      {results.map((item) => (
        <li
          key={item.symbol}
          className={`flex items-center justify-between px-4 py-2 cursor-pointer transition-colors
            ${selectedSymbol === item.symbol
              ? "bg-primary/10 dark:bg-primary/20 font-semibold"
              : "hover:bg-muted/80 dark:hover:bg-muted/60"}
          `}
          onClick={() => onSelect(item)}
        >
          <div className="flex flex-col">
            <span className="font-bold text-primary text-base">{item.symbol}</span>
            <span className="text-xs text-muted-foreground">
              {item.longName || item.shortname || "-"}
            </span>
          </div>
          <div className="flex flex-col items-end min-w-[80px]">
            {item.regularMarketPrice !== undefined ? (
              <span className="font-semibold text-sm">
                ${item.regularMarketPrice}
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">-</span>
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
        // historyData.data.items is an array of price points
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
        date: item.date
          ? new Date(item.date * 1000).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : item.formattedDate || "",
        price: item.close ?? item.price ?? item.last ?? null,
      }))
      .filter((d) => d.price !== null);
  }

  return (
    <div className="w-full flex flex-col px-1 sm:px-2 py-2">
      <div className="flex items-center gap-2 mb-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="hover:bg-muted"
        >
          <ArrowLeft className="text-primary" />
        </Button>
        <span className="font-bold text-lg text-primary">
          {info.symbol || "-"}
        </span>
        <span className="text-sm text-muted-foreground truncate ml-2">
          {info.companyName || info.longName || "-"}
        </span>
      </div>
      {loading ? (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          <span className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full mr-3"></span>
          Cargando detalles...
        </div>
      ) : details && info.symbol ? (
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <span className="font-semibold text-xs">Precio: </span>
              <span className="text-base font-bold text-primary">
                {info.primaryData?.lastSalePrice || "-"}
              </span>
            </div>
            <div>
              <span className="font-semibold text-xs">Var: </span>
              <span
                className={
                  (info.primaryData?.netChange?.startsWith("-")
                    ? "text-red-500 dark:text-red-400"
                    : "text-green-600 dark:text-green-400") +
                  " font-semibold"
                }
              >
                {info.primaryData?.netChange || "-"}{" "}
                <span className="text-muted-foreground">
                  ({info.primaryData?.percentageChange || "-"})
                </span>
              </span>
            </div>
            <div>
              <span className="font-semibold text-xs">Exchange: </span>
              <span className="text-sm text-muted-foreground">
                {info.exchange || "-"}
              </span>
            </div>
          </div>
          <div className="mt-2">
            <span className="font-semibold text-xs block mb-1">Descripción:</span>
            <span className="text-xs text-muted-foreground">
              {info.companyName || info.longName || "-"}
            </span>
          </div>
          {chartData.length > 1 && (
            <div className="mt-2">
              <span className="font-semibold text-xs block mb-1">Gráfico (1d)</span>
              <div className="w-full h-32 bg-muted/40 rounded-lg p-1">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" minTickGap={16} fontSize={10} />
                    <YAxis domain={["auto", "auto"]} fontSize={10} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="#2563eb"
                      dot={false}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-destructive">
          No se encontraron datos para este activo.
        </div>
      )}
      {canAdd && info.symbol && (
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onBack}>
            Cancelar
          </Button>
          <Button onClick={() => onAdd(info)}>
            <PlusCircle className="mr-2 h-5 w-5" /> Agregar
          </Button>
        </div>
      )}
    </div>
  );
}

export default function AddAssetModal({ open, onClose, onSelect, portfolioId }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);

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

  const handleAdd = async (asset) => {
    if (!asset || !portfolioId) return;
    await onSelect(asset);
    setSelected(null);
    setQuery("");
    setResults([]);
    onClose();
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

            {!searching && !error && query.trim() && results.length === 0 && (
              <div className="text-muted-foreground text-center py-4">
                No hay resultados.
              </div>
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
