
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, PieChart, AlertCircle, Activity, BarChart3 } from "lucide-react";
import Image from "next/image";

const portfolioSummary = {
  totalValue: 125350.75,
  todayChange: 350.20,
  todayChangePercent: 0.28,
  overallReturn: 15350.75,
  overallReturnPercent: 14.00,
};

const topPerformingAsset = { name: "Tech Innovations Inc.", symbol: "TII", changePercent: 2.5, value: 25000 };
const worstPerformingAsset = { name: "Old World Oil", symbol: "OWO", changePercent: -1.2, value: 12000 };

const cardHoverEffect = "transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1 hover:shadow-primary/20 border border-border hover:border-primary/30";

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl sm:text-4xl font-headline font-bold mb-10">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary-foreground">
          My Dashboard
        </span>
      </h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className={cardHoverEffect}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Portfolio Value</CardTitle>
            <DollarSign className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${portfolioSummary.totalValue.toLocaleString()}</div>
            <p className={`text-xs ${portfolioSummary.todayChange >= 0 ? 'text-positive' : 'text-negative'}`}>
              {portfolioSummary.todayChange >= 0 ? '+' : ''}${portfolioSummary.todayChange.toLocaleString()} ({portfolioSummary.todayChangePercent}%) today
            </p>
          </CardContent>
        </Card>
        <Card className={cardHoverEffect}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overall Return</CardTitle>
            <TrendingUp className="h-5 w-5 text-positive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${portfolioSummary.overallReturn.toLocaleString()}</div>
            <p className="text-xs text-positive">
              +{portfolioSummary.overallReturnPercent}% all time
            </p>
          </CardContent>
        </Card>
        <Card className={cardHoverEffect}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Top Performer (Today)</CardTitle>
            <TrendingUp className="h-5 w-5 text-positive" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">{topPerformingAsset.name} ({topPerformingAsset.symbol})</div>
            <p className="text-xs text-positive">
              +{topPerformingAsset.changePercent}%
            </p>
          </CardContent>
        </Card>
        <Card className={cardHoverEffect}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Needs Attention</CardTitle>
            <AlertCircle className="h-5 w-5 text-negative" />
          </CardHeader>
          <CardContent>
             <div className="text-lg font-semibold">{worstPerformingAsset.name} ({worstPerformingAsset.symbol})</div>
            <p className="text-xs text-negative">
              {worstPerformingAsset.changePercent}%
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Card className={`w-full ${cardHoverEffect}`}>
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-primary/80" /> Asset Allocation
            </CardTitle>
            <CardDescription>Your current portfolio distribution across asset classes.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center bg-muted/50 rounded-lg p-4 border border-dashed border-border/60">
              <PieChart className="h-16 w-16 text-primary/70" />
              <p className="ml-4 text-muted-foreground text-center">Asset Allocation Chart <br/> (Placeholder - Coming Soon)</p>
            </div>
             <Image src="https://placehold.co/600x300.png" alt="Asset Allocation Chart" width={600} height={300} className="w-full h-auto rounded-md mt-4 opacity-70" data-ai-hint="pie chart finance"/>
          </CardContent>
        </Card>
        <Card className={`w-full ${cardHoverEffect}`}>
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-2">
             <Activity className="h-6 w-6 text-primary/80" /> Recent Activity
            </CardTitle>
            <CardDescription>Latest transactions and portfolio changes.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2 p-2 bg-muted/30 rounded-md hover:bg-muted/50 transition-colors"> <TrendingUp className="h-4 w-4 text-positive"/> Bought 10 shares of AAPL</li>
              <li className="flex items-center gap-2 p-2 bg-muted/30 rounded-md hover:bg-muted/50 transition-colors"> <TrendingUp className="h-4 w-4 text-negative transform rotate-90"/> Sold 5 units of BTC</li>
              <li className="flex items-center gap-2 p-2 bg-muted/30 rounded-md hover:bg-muted/50 transition-colors"> <DollarSign className="h-4 w-4 text-primary"/> Received dividend from MSFT</li>
            </ul>
             <Image src="https://placehold.co/600x300.png" alt="Recent Activity Illustration" width={600} height={300} className="w-full h-auto rounded-md mt-4 opacity-70" data-ai-hint="financial transactions"/>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
