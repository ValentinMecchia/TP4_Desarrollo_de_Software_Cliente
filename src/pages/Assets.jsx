import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpRight, ArrowDownRight, LineChart, WalletCards, AreaChart, Sparkles, PlusCircle, Search, Star, StarOff, Pencil, Save, X } from "lucide-react";
import { ResponsiveContainer, LineChart as RechartsLineChart, Line, Tooltip, CartesianGrid, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { API_BASE_URL } from "@/constants/api";
import AddAssetModal from "@/components/assets/AddAssetModal";
import { motion, AnimatePresence } from "framer-motion";

const cardHoverEffect = "transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1 hover:shadow-primary/20 border border-border hover:border-primary/30";

// Vista compacta de detalles de asset (similar a AssetDetailsCompact del modal)
function AssetDetailsCompact({ symbol, onBack }) {
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!symbol) {
            setDetails(null);
            return;
        }
        setLoading(true);
        fetch(`${API_BASE_URL}/api/yahoo/market/quotes/realtime/${encodeURIComponent(symbol)}`)
            .then(res => res.json())
            .then(data => setDetails(data?.body || {}))
            .catch(() => setDetails(null))
            .finally(() => setLoading(false));
    }, [symbol]);

    const info = details || {};

    return (
        <div className="w-full flex flex-col px-1 sm:px-2 py-2">
            <Button variant="ghost" size="sm" onClick={onBack} className="mb-2 w-fit">
                Volver
            </Button>
            {loading ? (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                    <span className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full mr-3"></span>
                    Cargando detalles...
                </div>
            ) : info.symbol ? (
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
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center text-destructive">
                    No se encontraron datos para este activo.
                </div>
            )}
        </div>
    );
}

// Favoritos de acciones
function FavoriteAssetsSection({ favorites, onRemove, onEditComment, editingId, commentDraft, setCommentDraft, setEditingId, handleSaveComment }) {
  return (
    <Card className={`mb-8 w-full ${cardHoverEffect}`}>
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
          <Star className="h-7 w-7 text-yellow-400" />
          Acciones Favoritas
        </CardTitle>
        <CardDescription>
          Guarda tus acciones favoritas y deja un comentario personal.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {favorites.length === 0 ? (
          <div className="text-muted-foreground text-sm mb-6">
            No tienes acciones favoritas aún.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Símbolo</TableHead>
                <TableHead>Comentario</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {favorites.map((fav, idx) => (
                <TableRow key={fav.id || fav.symbol || idx}>
                  <TableCell>{fav.name || fav.symbol}</TableCell>
                  <TableCell>{fav.symbol || fav.url}</TableCell>
                  <TableCell>
                    {editingId === fav.id ? (
                      <div className="flex flex-col gap-2">
                        <Input
                          value={commentDraft}
                          onChange={e => setCommentDraft(e.target.value)}
                          className="w-full"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleSaveComment(fav)}>
                            <Save className="h-4 w-4 mr-1" /> Guardar
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span>{fav.comment || fav.content || <span className="italic text-muted-foreground">Sin comentario</span>}</span>
                        <Button size="icon" variant="ghost" onClick={() => onEditComment(fav)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => onRemove(fav)}
                      aria-label="Eliminar favorito"
                    >
                      <StarOff className="h-5 w-5 text-yellow-400" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

export default function AssetsPage() {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [commentDraft, setCommentDraft] = useState("");
  const [selectedSymbol, setSelectedSymbol] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [trendingAssets, setTrendingAssets] = useState([]);
  const [trendingError, setTrendingError] = useState("");

  // Cargar favoritos desde el backend
  useEffect(() => {
    async function fetchFavorites() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/assets/favorites`, { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setFavorites(Array.isArray(data) ? data : []);
        } else {
          setFavorites([]);
        }
      } catch {
        setFavorites([]);
      }
    }
    fetchFavorites();
  }, []);

  // Guardar favorito en el backend
  const addFavorite = async (asset) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/assets/favorites`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          symbol: asset.symbol,
          name: asset.name || asset.shortname || asset.longName || "",
        }),
      });
      if (res.ok) {
        const saved = await res.json();
        setFavorites((prev) => [...prev, saved]);
      }
    } catch {
      // ignore
    }
  };

  // Eliminar favorito del backend
  const removeFavorite = async (fav) => {
    try {
      await fetch(`${API_BASE_URL}/api/assets/favorites/${fav.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      setFavorites((prev) => prev.filter((f) => f.id !== fav.id));
    } catch {
      // ignore
    }
  };

  // Editar comentario de favorito
  const handleEditComment = (fav) => {
    setEditingId(fav.id);
    setCommentDraft(fav.comment || fav.content || "");
  };

  const handleSaveComment = async (fav) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/assets/favorites/${fav.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ comment: commentDraft }),
      });
      if (res.ok) {
        setFavorites((prev) =>
          prev.map((f) =>
            f.id === fav.id ? { ...f, comment: commentDraft } : f
          )
        );
      }
    } catch {
      // ignore
    }
    setEditingId(null);
  };

  // Buscar assets usando la API de Yahoo de tu backend
  const handleSearch = async (e) => {
    e.preventDefault();
    setSearching(true);
    setError("");
    setSearchResults([]);
    try {
      const res = await fetch(`${API_BASE_URL}/api/yahoo/search/${encodeURIComponent(search.trim())}`);
      const data = await res.json();

      const arr = Array.isArray(data?.body)
        ? data.body
        : Array.isArray(data?.data?.items)
          ? data.data.items
          : Array.isArray(data?.items)
            ? data.items
            : [];

      // Enriquecer cada asset con cotización usando el endpoint correcto
      const enrichedResults = await Promise.all(
        arr.map(async (item) => {
          const symbol = item.symbol || item.ticker || item.code || "";
          let enriched = {
            symbol,
            longName: item.longname || item.name || item.shortname || "",
            shortname: item.shortname || item.name || item.longname || "",
          };
          try {
            const quoteRes = await fetch(`${API_BASE_URL}/api/yahoo/market/quotes/realtime/${encodeURIComponent(symbol)}`);
            if (!quoteRes.ok) return enriched;
            const quoteData = await quoteRes.json();
            const info = quoteData?.body || {};
            let price = info.primaryData?.lastSalePrice;
            if (typeof price === "string") price = Number(price.replace(/[$,]/g, ""));
            if ((!price || isNaN(price)) && info.regularMarketPrice) price = Number(info.regularMarketPrice);

            let change = info.primaryData?.netChange;
            if (typeof change === "string") change = Number(change.replace(/[,]/g, ""));
            if ((!change || isNaN(change)) && info.regularMarketChange) change = Number(info.regularMarketChange);

            let changePercent = info.primaryData?.percentageChange;
            if (typeof changePercent === "string") changePercent = Number(changePercent.replace(/[%]/g, ""));
            if ((!changePercent || isNaN(changePercent)) && info.regularMarketChangePercent) changePercent = Number(info.regularMarketChangePercent);

            return {
              ...enriched,
              regularMarketPrice: !isNaN(price) ? price : undefined,
              regularMarketChange: !isNaN(change) ? change : undefined,
              regularMarketChangePercent: !isNaN(changePercent) ? changePercent : undefined,
              exchange: info.exchange || item.exchDisp || item.exchange,
            };
          } catch {
            return enriched;
          }
        })
      );
      setSearchResults(enrichedResults);
    } catch (err) {
      setError("No se pudieron obtener resultados.");
    } finally {
      setSearching(false);
    }
  };

  // Trending assets (máximo 5 para evitar rate limit)
  useEffect(() => {
    // Limita a 5 símbolos populares
    const symbols = ["AAPL", "TSLA", "MSFT", "GOOGL", "AMZN"];
    Promise.all(
      symbols.map(async (symbol) => {
        try {
          const res = await fetch(`${API_BASE_URL}/api/yahoo/market/quotes/realtime/${symbol}`);
          if (res.status === 429) {
            setTrendingError("Límite de consultas alcanzado. Intenta más tarde.");
            return null;
          }
          const data = await res.json();
          const info = data?.body || {};
          let price = info.primaryData?.lastSalePrice;
          if (typeof price === "string") price = Number(price.replace(/[$,]/g, ""));
          if ((!price || isNaN(price)) && info.regularMarketPrice) price = Number(info.regularMarketPrice);

          let change = info.primaryData?.netChange;
          if (typeof change === "string") change = Number(change.replace(/[,]/g, ""));
          if ((!change || isNaN(change)) && info.regularMarketChange) change = Number(info.regularMarketChange);

          let changePercent = info.primaryData?.percentageChange;
          if (typeof changePercent === "string") changePercent = Number(changePercent.replace(/[%]/g, ""));
          if ((!changePercent || isNaN(changePercent)) && info.regularMarketChangePercent) changePercent = Number(info.regularMarketChangePercent);

          return {
            symbol,
            name: info.companyName || symbol,
            price: !isNaN(price) ? price : undefined,
            change: !isNaN(change) ? change : undefined,
            changePercent: !isNaN(changePercent) ? changePercent : undefined,
          };
        } catch {
          setTrendingError("No se pudieron cargar las acciones en tendencia.");
          return null;
        }
      })
    ).then(results => {
      setTrendingAssets(results.filter(Boolean));
    });
  }, []);

  // Favorito: ¿es favorito?
  const isFavorite = (asset) => {
    return favorites.some(f => f.symbol === asset.symbol);
  };

  // Guardar como favorito desde búsqueda o trending
  const handleToggleFavorite = (asset) => {
    if (isFavorite(asset)) {
      const fav = favorites.find(f => f.symbol === asset.symbol);
      if (fav) removeFavorite(fav);
    } else {
      addFavorite(asset);
    }
  };

  return (
    <motion.div
      className="container mx-auto py-8 px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -40, scale: 0.97 }}
      transition={{ duration: 0.5, type: "spring" }}
    >
      {/* Favoritos */}
      <FavoriteAssetsSection
        favorites={favorites}
        onRemove={removeFavorite}
        onEditComment={handleEditComment}
        editingId={editingId}
        commentDraft={commentDraft}
        setCommentDraft={setCommentDraft}
        setEditingId={setEditingId}
        handleSaveComment={handleSaveComment}
      />

      {/* Barra de búsqueda */}
      <form onSubmit={handleSearch} className="flex w-full gap-2 mb-8">
        <Input
          placeholder="Buscar asset por nombre o símbolo (ej: AAPL, Tesla, etc)"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={!search.trim() || searching}>
          <Search className="h-4 w-4" />
          <span className="ml-2">Buscar</span>
        </Button>
      </form>

      {/* Indicador de búsqueda */}
      {searching && (
        <div className="flex items-center gap-2 mb-4 text-primary">
          <span className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></span>
          Buscando...
        </div>
      )}

      {/* Detalle compacto si hay símbolo seleccionado */}
      {selectedSymbol && (
        <Card className="mb-8 w-full">
          <CardHeader>
            <CardTitle>Detalles del Asset</CardTitle>
          </CardHeader>
          <CardContent>
            <AssetDetailsCompact
              symbol={selectedSymbol}
              onBack={() => setSelectedSymbol(null)}
            />
          </CardContent>
        </Card>
      )}

      <AddAssetModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSelect={() => setShowAddModal(false)}
        portfolioId={null}
      />

      {/* Resultados de búsqueda */}
      {searchResults.length > 0 && !selectedSymbol && (
        <Card className={`mb-8 w-full ${cardHoverEffect}`}>
          <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center gap-2">
              <Sparkles className="h-7 w-7 text-primary/90" />
              Resultados de búsqueda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Símbolo</TableHead>
                  <TableHead className="text-right">Precio</TableHead>
                  <TableHead className="text-right">Var</TableHead>
                  <TableHead className="text-right">Exchange</TableHead>
                  <TableHead className="text-right">Favorito</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {searchResults.map((asset) => (
                  <TableRow key={asset.symbol}>
                    <TableCell>{asset.shortname || asset.longName || asset.symbol}</TableCell>
                    <TableCell>{asset.symbol}</TableCell>
                    <TableCell className="text-right">
                      {asset.regularMarketPrice !== undefined && asset.regularMarketPrice !== null && !isNaN(asset.regularMarketPrice)
                        ? `$${Number(asset.regularMarketPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        : "-"
                      }
                    </TableCell>
                    <TableCell className={`text-right ${asset.regularMarketChange !== undefined && asset.regularMarketChange !== null && !isNaN(asset.regularMarketChange) && asset.regularMarketChange >= 0
                      ? "text-positive"
                      : "text-negative"
                    }`}>
                      {asset.regularMarketChange !== undefined && asset.regularMarketChange !== null && !isNaN(asset.regularMarketChange)
                        ? `${Number(asset.regularMarketChange).toFixed(2)} (${asset.regularMarketChangePercent !== undefined && asset.regularMarketChangePercent !== null && !isNaN(asset.regularMarketChangePercent)
                          ? Number(asset.regularMarketChangePercent).toFixed(2)
                          : "-"
                        }%)`
                        : "-"}
                    </TableCell>
                    <TableCell className="text-right">{asset.exchange || "-"}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleToggleFavorite(asset)}
                        aria-label={isFavorite(asset) ? "Quitar de favoritos" : "Agregar a favoritos"}
                      >
                        {isFavorite(asset) ? (
                          <StarOff className="h-5 w-5 text-yellow-400" />
                        ) : (
                          <Star className="h-5 w-5 text-yellow-400" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Acciones en tendencia */}
      <Card className={`mb-8 w-full ${cardHoverEffect}`}>
        <CardHeader className="flex flex-row items-center justify-between space-x-4 pb-4">
          <div>
            <CardTitle className="font-headline text-2xl flex items-center gap-2">
              <WalletCards className="h-7 w-7 text-primary/90" />
              Acciones en tendencia
            </CardTitle>
            <CardDescription>
              Sigue en tiempo real las acciones que son tendencias en el mercado
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset Name</TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Change (24h)</TableHead>
                <TableHead className="text-right">Favorito</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trendingAssets.map(asset => (
                <TableRow key={asset.symbol}>
                  <TableCell>{asset.name}</TableCell>
                  <TableCell>{asset.symbol}</TableCell>
                  <TableCell className="text-right">
                    {asset.price !== undefined && asset.price !== null && !isNaN(asset.price)
                      ? `$${Number(asset.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                      : "-"
                    }
                  </TableCell>
                  <TableCell className={`text-right ${asset.change !== undefined && asset.change !== null && !isNaN(asset.change) && asset.change >= 0
                    ? "text-positive"
                    : "text-negative"
                  }`}>
                    {asset.change !== undefined && asset.change !== null && !isNaN(asset.change)
                      ? `${Number(asset.change).toFixed(2)} (${asset.changePercent !== undefined && asset.changePercent !== null && !isNaN(asset.changePercent)
                        ? Number(asset.changePercent).toFixed(2)
                        : "-"
                      }%)`
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleToggleFavorite(asset)}
                      aria-label={isFavorite(asset) ? "Quitar de favoritos" : "Agregar a favoritos"}
                    >
                      {isFavorite(asset) ? (
                        <StarOff className="h-5 w-5 text-yellow-400" />
                      ) : (
                        <Star className="h-5 w-5 text-yellow-400" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function AssetPriceChart() {
    const symbol = "AAPL"; // activo fijo para probar Apple
    const [prices, setPrices] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchPrices() {
            setLoading(true);
            try {
                const res = await fetch(
                    `${API_BASE_URL}/api/yahoo/market/quotes/history/${encodeURIComponent(symbol)}`
                );
                const historyData = await res.json();

                // Extraer array de precios
                let arr = [];
                if (Array.isArray(historyData?.data?.items)) {
                    arr = historyData.data.items;
                } else if (Array.isArray(historyData?.body)) {
                    arr = historyData.body;
                } else if (Array.isArray(historyData)) {
                    arr = historyData;
                }

                // Preparar datos para gráfico
                const chartData = arr
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

                setPrices(chartData);
            } catch {
                setPrices([]);
            } finally {
                setLoading(false);
            }
        }

        fetchPrices();
    }, [symbol]);

    return (
        <div>
            <h2>Gráfico de precios para {symbol}</h2>
            {loading ? (
                <p>Cargando gráfico...</p>
            ) : prices.length > 1 ? (
                <div style={{ width: "100%", height: 240 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <RechartsLineChart data={prices}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="date"
                                minTickGap={16}
                                fontSize={10}
                                label={{ value: "Hora", position: "insideBottomRight", offset: -5 }}
                                tick={{ fontSize: 10 }}
                                interval="preserveStartEnd"
                                ticks={
                                    prices.length > 0
                                        ? [
                                            prices[0].date,
                                            prices[Math.floor(prices.length / 2)].date,
                                            prices[prices.length - 1].date
                                        ]
                                        : []
                                }
                            />
                            <YAxis
                                domain={["auto", "auto"]}
                                fontSize={10}
                                label={{ value: "Precio", angle: -90, position: "insideLeft", offset: 10 }}
                            />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="price"
                                stroke="#2563eb"
                                dot={false}
                                strokeWidth={2}
                            />
                        </RechartsLineChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <p>No hay datos para mostrar.</p>
            )}
        </div>
    );
}
