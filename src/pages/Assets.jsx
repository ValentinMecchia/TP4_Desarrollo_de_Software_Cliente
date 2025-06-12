import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpRight, ArrowDownRight, LineChart, WalletCards, AreaChart, Sparkles, PlusCircle, Search } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { API_BASE_URL } from "@/constants/api";

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

const assets = [
    { id: "1", name: "Tech Innovations Inc.", symbol: "TII", price: 150.75, change: 2.5, changePercent: 1.68, marketCap: "1.5T" },
    { id: "2", name: "EcoEnergy Solutions", symbol: "EES", price: 75.20, change: -0.80, changePercent: -1.05, marketCap: "500B" },
    { id: "3", name: "Global Health Corp", symbol: "GHC", price: 210.40, change: 1.15, changePercent: 0.55, marketCap: "800B" },
    { id: "4", name: "CryptoCoin Alpha", symbol: "CCA", price: 4500.00, change: 150.00, changePercent: 3.45, marketCap: "90B" },
    { id: "5", name: "Future Retail Group", symbol: "FRG", price: 32.50, change: -0.10, changePercent: -0.31, marketCap: "60B" },
    { id: "6", name: "BioSynth Pharma", symbol: "BSP", price: 180.90, change: 3.45, changePercent: 1.94, marketCap: "250B" },
];

const chartData = [
    { date: "Jan", TII: 120, EES: 80, GHC: 190 },
    { date: "Feb", TII: 130, EES: 75, GHC: 200 },
    { date: "Mar", TII: 125, EES: 70, GHC: 205 },
    { date: "Apr", TII: 140, EES: 78, GHC: 210 },
    { date: "May", TII: 150, EES: 75, GHC: 215 },
    { date: "Jun", TII: 150.75, EES: 75.20, GHC: 210.40 },
];

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

    // Buscar assets usando la API de Yahoo de tu backend
    const handleSearch = async (e) => {
        e.preventDefault();
        setSearching(true);
        setError("");
        setSearchResults([]);
        try {
            const res = await fetch(`${API_BASE_URL}/api/yahoo/search?q=${encodeURIComponent(search)}`);
            if (!res.ok) throw new Error("Error buscando acciones");
            const data = await res.json();
            setSearchResults(data.quotes || []);
        } catch (err) {
            setError("No se pudieron obtener resultados.");
        } finally {
            setSearching(false);
        }
    };

    // Cuando se hace click en agregar asset, aquí puedes abrir un modal para seleccionar portafolio/cantidad/precio
    const handleAddAssetToPortfolio = (asset) => {
        alert(`Selecciona portafolio y cantidad para ${asset.symbol}`);
    };

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
                <Button type="submit" disabled={searching || !search.trim()}>
                    <Search className="h-4 w-4" />
                    <span className="ml-2">Buscar</span>
                </Button>
            </form>

            {/* Resultados de búsqueda */}
            {searching && <div className="text-muted-foreground mb-4">Buscando...</div>}
            {error && <div className="text-destructive mb-4">{error}</div>}
            {searchResults.length > 0 && (
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
                                    <TableHead>Asset Name</TableHead>
                                    <TableHead>Symbol</TableHead>
                                    <TableHead className="text-right">Agregar</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {searchResults.map((asset) => (
                                    <TableRow key={asset.symbol}>
                                        <TableCell>{asset.shortname || asset.symbol}</TableCell>
                                        <TableCell>{asset.symbol}</TableCell>
                                        <TableCell className="text-right">
                                            <Button size="icon" variant="outline" onClick={() => handleAddAssetToPortfolio(asset)} aria-label="Agregar a portafolio">
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
                                    Asset Overview
                                </CardTitle>
                                <CardDescription>Track the real-time performance of your individual assets.</CardDescription>
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
                                        <TableHead className="text-right">Market Cap</TableHead>
                                        <TableHead className="text-right">Agregar</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {assets.map((asset) => (
                                        <AssetRow key={asset.id} asset={asset} onAdd={handleAddAssetToPortfolio} />
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <Card className={`w-full ${cardHoverEffect}`}>
                        <CardHeader className="flex flex-row items-center justify-between space-x-4 pb-4">
                            <div>
                                <CardTitle className="font-headline text-2xl flex items-center gap-2">
                                    <AreaChart className="h-7 w-7 text-primary/90" />
                                    Historical Performance
                                </CardTitle>
                                <CardDescription>Monthly performance visualization of selected assets.</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={chartConfig} className="h-[400px] w-full aspect-video">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border)/0.5)" />
                                        <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                                        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                                        <ChartTooltip content={<ChartTooltipContent />} cursor={{ fill: "hsl(var(--accent)/0.15)" }} />
                                        <ChartLegend content={<ChartLegendContent />} />
                                        <Bar dataKey="TII" fill="var(--color-TII)" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="EES" fill="var(--color-EES)" radius={[4, 4, 0, 0]} animationBegin={200} />
                                        <Bar dataKey="GHC" fill="var(--color-GHC)" radius={[4, 4, 0, 0]} animationBegin={400} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
}
