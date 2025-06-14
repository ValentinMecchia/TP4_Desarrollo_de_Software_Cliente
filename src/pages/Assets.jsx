import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpRight, ArrowDownRight, LineChart, WalletCards, AreaChart, Sparkles, PlusCircle, Search } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { LineChart as RechartsLineChart, Line, Tooltip, ResponsiveContainer, CartesianGrid, XAxis, YAxis } from "recharts";
import { Bar, BarChart } from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { API_BASE_URL } from "@/constants/api";
import AddAssetModal from "@/components/assets/AddAssetModal";

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

// Componente reutilizable para mostrar un asset y agregarlo a portafolio(s)
function AssetRow({ asset, onAdd }) {
    return (
        <TableRow>
            <TableCell>{asset.name}</TableCell>
            <TableCell>{asset.symbol}</TableCell>
            <TableCell className="text-right">${asset.price?.toLocaleString?.() ?? asset.price}</TableCell>
            <TableCell className={`text-right ${asset.change >= 0 ? 'text-positive' : 'text-negative'}`}>
                <span className="inline-flex items-center">
                    {asset.change >= 0
                        ? <ArrowUpRight className="h-4 w-4 mr-1" />
                        : <ArrowDownRight className="h-4 w-4 mr-1" />}
                    {asset.changePercent?.toFixed?.(2) ?? asset.changePercent}%
                </span>
            </TableCell>
            <TableCell className="text-right">{asset.marketCap}</TableCell>
            <TableCell className="text-right">
                <Button size="icon" variant="outline" onClick={() => onAdd(asset)} aria-label="Agregar a portafolio">
                    <PlusCircle className="h-5 w-5" />
                </Button>
            </TableCell>
        </TableRow>
    );
}




const chartConfig = {
    TII: { label: "TII", color: "hsl(var(--chart-1))" },
    EES: { label: "EES", color: "hsl(var(--chart-2))" },
    GHC: { label: "GHC", color: "hsl(var(--chart-3))" },
};

const cardHoverEffect = "transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1 hover:shadow-primary/20 border border-border hover:border-primary/30";

export default function AssetsPage() {
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [error, setError] = useState("");
    const [assets, setAssets] = useState([]);
    const [loadingAssets, setLoadingAssets] = useState(true);
    const [errorAssets, setErrorAssets] = useState("");
    const [selectedAssetDetail, setSelectedAssetDetail] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedSymbol, setSelectedSymbol] = useState(null);
    const [trendingAssets, setTrendingAssets] = useState([]);
    const [weeklyChartData, setWeeklyChartData] = useState([]);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/assets`)
            .then(res => { if (!res.ok) throw new Error("No se pudieron cargar los assets"); return res.json(); })
            .then(data => { setAssets(data); setLoadingAssets(false); })
            .catch(err => { setErrorAssets(err.message); setLoadingAssets(false); });
    }, []);

    useEffect(() => {
        // Cargar tendencias: Apple, Tesla, Microsoft
        const symbols = ["AAPL", "TSLA", "MSFT"];
        Promise.all(
            symbols.map(async (symbol) => {
                try {
                    const res = await fetch(`${API_BASE_URL}/api/yahoo/market/quotes/realtime/${symbol}`);
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
                    return { symbol, name: symbol };
                }
            })
        ).then(setTrendingAssets);

        // Obtener precios históricos de los últimos 7 días para AAPL, TSLA, MSFT
        (async () => {
            const dias = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
            const allSeries = await Promise.all(
                symbols.map(async (symbol) => {
                    try {
                        const res = await fetch(`${API_BASE_URL}/api/yahoo/history/${symbol}?range=7d&interval=1d`);
                        const data = await res.json();
                        // Yahoo suele devolver un array de precios en data.body o data.data/items
                        const arr =
                            Array.isArray(data?.data?.items)
                                ? data.data.items
                                : Array.isArray(data?.body)
                                    ? data.body
                                    : [];
                        // Solo días con precio válido
                        return arr
                            .filter(item => item.close !== undefined && item.close !== null)
                            .map((item) => ({
                                date: item.date
                                    ? dias[new Date(item.date * 1000).getDay()]
                                    : item.formattedDate || "",
                                [symbol]: item.close,
                            }));
                    } catch {
                        return [];
                    }
                })
            );
            // Combinar por fecha
            const merged = {};
            allSeries.forEach((series) => {
                series.forEach((point) => {
                    if (!point.date) return;
                    if (!merged[point.date]) merged[point.date] = { date: point.date };
                    Object.entries(point).forEach(([k, v]) => {
                        if (k !== "date") merged[point.date][k] = v;
                    });
                });
            });
            // Solo los días de lunes a viernes y ordenados
            const diasOrden = ["Lun", "Mar", "Mié", "Jue", "Vie"];
            const mergedArr = diasOrden
                .map((d) => merged[d])
                .filter(row =>
                    row &&
                    (row.AAPL !== undefined || row.TSLA !== undefined || row.MSFT !== undefined)
                );
            setWeeklyChartData(mergedArr);
        })();
    }, []);

    useEffect(() => {
        if (!search.trim()) {
            setSearchResults([]);
            setError("");
        }
    }, [search]);



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
                        // Usa el endpoint de AddAssetModal y chequea la estructura real
                        const quoteRes = await fetch(`${API_BASE_URL}/api/yahoo/market/quotes/realtime/${encodeURIComponent(symbol)}`);
                        if (!quoteRes.ok) return enriched;
                        const quoteData = await quoteRes.json();
                        const info = quoteData?.body || {};
                        // Si no hay primaryData, intenta con regularMarketPrice
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

    const fetchAssetDetail = async (symbol) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/yahoo/quote/${symbol}`);
            if (!res.ok) throw new Error("No se pudo obtener detalle del asset");
            const data = await res.json();
            setSelectedAssetDetail(data);
        } catch (err) {
            console.error(err);
            alert("❌ Error al obtener los datos del asset.");
        }
    };


    // Cuando se hace click en agregar asset, aquí puedes abrir un modal para seleccionar portafolio/cantidad/precio
    const handleAddAssetToPortfolio = async (asset) => {
        // 1️⃣ Abrir un modal para seleccionar portafolio, cantidad y precio
        const portfolioId = prompt("✏️ Ingresa el ID de tu portafolio:");
        if (!portfolioId) return alert("Operación cancelada.");

        const qtyStr = prompt(`¿Cuántas unidades de ${asset.symbol} querés agregar?`);
        const quantity = parseFloat(qtyStr);
        if (isNaN(quantity) || quantity <= 0) {
            return alert("Cantidad inválida.");
        }

        const priceStr = prompt(`¿A qué precio compraste ${asset.symbol}?`, asset.regularMarketPrice ?? "");
        const price = parseFloat(priceStr);
        if (isNaN(price) || price <= 0) {
            return alert("Precio inválido.");
        }

        // 2️⃣ Enviar la petición al backend
        try {
            const res = await fetch(
                `${API_BASE_URL}/api/portfolios/${portfolioId}/assets`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        symbol: asset.symbol,
                        name: asset.shortname || asset.longName || asset.symbol,
                        price,
                        quantity
                    })
                }
            );
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const saved = await res.json();
            alert(`✅ Agregaste ${saved.symbol} x${saved.quantity} al portafolio ${portfolioId}`);
        } catch (err) {
            console.error(err);
            alert("❌ Error al agregar el asset a tu portafolio.");
        }
    };
    if (loadingAssets) return <p className="p-4">Cargando assets...</p>;
    if (errorAssets) return <p className="p-4 text-red-500">Error: {errorAssets}</p>;

    // Agrega el gráfico de precios de Apple al render principal
    return (
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
            {/* Barra de búsqueda de ancho completo */}
            <form onSubmit={handleSearch} className="flex w-full gap-2 mb-8">
                <Input
                    placeholder="Buscar asset por nombre o símbolo (ej: AAPL, Tesla, etc)"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="flex-1"
                />
                <Button type="submit" disabled={!search.trim()}>
                    <Search className="h-4 w-4" />
                    <span className="ml-2">Buscar</span>
                </Button>
            </form>

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
                portfolioId={null} // No necesitas portfolioId aquí
            />

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
                                    <TableHead className="text-right">Agregar</TableHead>
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
                                                variant="outline"
                                                onClick={() => handleAddAssetToPortfolio(asset)}
                                                aria-label="Agregar a portafolio"
                                            >
                                                <PlusCircle className="h-5 w-5" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}



            {/* Asset Overview local (mock) solo si no hay búsqueda activa */}
            {searchResults.length === 0 && (
                <>
                    <Card className={`mb-8 w-full ${cardHoverEffect}`}>
                        <CardHeader className="flex flex-row items-center justify-between space-x-4 pb-4">
                            <div>
                                <CardTitle className="font-headline text-2xl flex items-center gap-2">
                                    <WalletCards className="h-7 w-7 text-primary/90" />
                                    Assets en tendencia
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
                                        {/* <TableHead className="text-right">Market Cap</TableHead> */}
                                        <TableHead className="text-right">Agregar</TableHead>
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
                                            {/* <TableCell className="text-right">
                                                {asset.marketCap !== undefined && asset.marketCap !== null
                                                    ? `$${Number(asset.marketCap).toLocaleString()}`
                                                    : "-"}
                                            </TableCell> */}
                                            <TableCell className="text-right">
                                                <Button
                                                    size="icon"
                                                    variant="outline"
                                                    onClick={() => handleAddAssetToPortfolio(asset)}
                                                    aria-label="Agregar a portafolio"
                                                >
                                                    <PlusCircle className="h-5 w-5" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                    


                    
                    {/* Gráfico de precios intradiario de Apple */}
                    <Card className="mb-8 w-full">
                        <CardHeader>
                            <CardTitle>Gráfico de precios intradiario de la accion mas operada del dia:(AAPL)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <AssetPriceChart />
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
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
