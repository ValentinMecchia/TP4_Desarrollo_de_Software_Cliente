import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, PieChart, AlertCircle } from "lucide-react";
import Image from "next/image";

// Mock data - replace with API calls
const portfolioSummary = {
  totalValue: 125350.75,
  todayChange: 350.20,
  todayChangePercent: 0.28,
  overallReturn: 15350.75,
  overallReturnPercent: 14.00,
};

const topPerformingAsset = { name: "Tech Innovations Inc.", symbol: "TII", changePercent: 2.5, value: 25000 };
const worstPerformingAsset = { name: "Old World Oil", symbol: "OWO", changePercent: -1.2, value: 12000 };

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-headline font-bold mb-8 text-primary">My Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${portfolioSummary.totalValue.toLocaleString()}</div>
            <p className={`text-xs ${portfolioSummary.todayChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {portfolioSummary.todayChange >= 0 ? '+' : ''}${portfolioSummary.todayChange.toLocaleString()} ({portfolioSummary.todayChangePercent}%) today
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Return</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${portfolioSummary.overallReturn.toLocaleString()}</div>
            <p className="text-xs text-green-600">
              +{portfolioSummary.overallReturnPercent}% all time
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Performer (Today)</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">{topPerformingAsset.name} ({topPerformingAsset.symbol})</div>
            <p className="text-xs text-green-600">
              +{topPerformingAsset.changePercent}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Needs Attention</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
             <div className="text-lg font-semibold">{worstPerformingAsset.name} ({worstPerformingAsset.symbol})</div>
            <p className="text-xs text-red-600">
              {worstPerformingAsset.changePercent}%
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Asset Allocation</CardTitle>
            <CardDescription>Your current portfolio distribution across asset classes.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Placeholder for chart */}
            <div className="h-[300px] flex items-center justify-center bg-muted rounded-md">
              <PieChart className="h-16 w-16 text-muted-foreground" />
              <p className="ml-2 text-muted-foreground">Asset Allocation Chart Placeholder</p>
            </div>
             <Image src="https://placehold.co/600x300.png" alt="Asset Allocation Chart" width={600} height={300} className="w-full h-auto rounded-md mt-4" data-ai-hint="pie chart finance"/>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Recent Activity</CardTitle>
            <CardDescription>Latest transactions and portfolio changes.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="text-sm">Bought 10 shares of AAPL</li>
              <li className="text-sm">Sold 5 units of BTC</li>
              <li className="text-sm">Received dividend from MSFT</li>
            </ul>
             <Image src="https://placehold.co/600x300.png" alt="Recent Activity Illustration" width={600} height={300} className="w-full h-auto rounded-md mt-4" data-ai-hint="financial transactions"/>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
