import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpRight, ArrowDownRight, LineChart } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import Image from "next/image";

// Mock data - replace with API calls
const assets = [
  { id: "1", name: "Tech Innovations Inc.", symbol: "TII", price: 150.75, change: 2.5, changePercent: 1.68, marketCap: "1.5T" },
  { id: "2", name: "EcoEnergy Solutions", symbol: "EES", price: 75.20, change: -0.80, changePercent: -1.05, marketCap: "500B" },
  { id: "3", name: "Global Health Corp", symbol: "GHC", price: 210.40, change: 1.15, changePercent: 0.55, marketCap: "800B" },
  { id: "4", name: "CryptoCoin Alpha", symbol: "CCA", price: 4500.00, change: 150.00, changePercent: 3.45, marketCap: "90B" },
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


export default function AssetsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-headline font-bold mb-8 text-primary">Asset Performance</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="font-headline">Asset Overview</CardTitle>
          <CardDescription>Track the performance of your individual assets.</CardDescription>
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
                  <TableCell className="font-medium">{asset.name}</TableCell>
                  <TableCell>{asset.symbol}</TableCell>
                  <TableCell className="text-right">${asset.price.toLocaleString()}</TableCell>
                  <TableCell className={`text-right font-medium ${asset.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    <span className="inline-flex items-center">
                      {asset.change >= 0 ? <ArrowUpRight className="h-4 w-4 mr-1" /> : <ArrowDownRight className="h-4 w-4 mr-1" />}
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
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Historical Performance</CardTitle>
          <CardDescription>Monthly performance of selected assets.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="TII" fill="var(--color-TII)" radius={4} />
                <Bar dataKey="EES" fill="var(--color-EES)" radius={4} />
                <Bar dataKey="GHC" fill="var(--color-GHC)" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div className="mt-4 flex items-center justify-center bg-muted rounded-md p-4">
            <LineChart className="h-8 w-8 text-muted-foreground" />
            <p className="ml-2 text-muted-foreground">Detailed historical chart coming soon.</p>
            <Image src="https://placehold.co/700x350.png" alt="Historical Performance Chart" width={700} height={350} className="w-full h-auto rounded-md mt-2" data-ai-hint="stock chart graph"/>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
