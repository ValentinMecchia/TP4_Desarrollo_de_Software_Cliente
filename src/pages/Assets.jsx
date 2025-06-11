import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpRight, ArrowDownRight, LineChart, WalletCards, AreaChart, Sparkles } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";

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
    return (
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-10">
                <Sparkles className="h-10 w-10 text-primary animate-pulse" />
                <h1 className="text-3xl sm:text-4xl font-headline font-bold">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary-foreground">
                        Asset Performance Matrix
                    </span>
                </h1>
            </div>

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
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {assets.map((asset) => (
                                <TableRow key={asset.id}>
                                    <TableCell>{asset.name}</TableCell>
                                    <TableCell>{asset.symbol}</TableCell>
                                    <TableCell className="text-right">${asset.price.toLocaleString()}</TableCell>
                                    <TableCell className={`text-right ${asset.change >= 0 ? 'text-positive' : 'text-negative'}`}>
                                        <span className="inline-flex items-center">
                                            {asset.change >= 0
                                                ? <ArrowUpRight className="h-4 w-4 mr-1" />
                                                : <ArrowDownRight className="h-4 w-4 mr-1" />}
                                            {asset.changePercent.toFixed(2)}%
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">{asset.marketCap}</TableCell>
                                </TableRow>
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
                    <div className="mt-8 flex flex-col items-center justify-center bg-muted/30 dark:bg-muted/20 rounded-lg p-8 min-h-[150px] border border-dashed border-border/70 text-center shadow-inner">
                        <LineChart className="h-12 w-12 text-primary/70 mb-4 opacity-80" />
                        <p className="text-xl font-semibold text-foreground/80">Advanced Analytics Interface</p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Detailed historical data streams and predictive modeling are under development.
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Si necesitas mostrar una imagen, usa:
            <img
              src="https://placehold.co/600x300.png"
              alt="Asset Allocation Chart"
              width={600}
              height={300}
              className="w-full h-auto rounded-md mt-4 opacity-70"
              data-ai-hint="pie chart finance"
            />
            */}
        </div>
    );
}
