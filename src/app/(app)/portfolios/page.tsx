import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Edit3, Trash2, ChevronRight } from "lucide-react";
import Image from "next/image";

// Mock data - replace with API calls
const portfolios = [
  { id: "1", name: "Long Term Growth", totalValue: 75000, assetCount: 5, lastUpdated: "2024-07-20" },
  { id: "2", name: "Crypto Speculation", totalValue: 25000, assetCount: 3, lastUpdated: "2024-07-18" },
  { id: "3", name: "Retirement Fund", totalValue: 25350.75, assetCount: 8, lastUpdated: "2024-07-21" },
];

export default function PortfoliosPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-headline font-bold text-primary">My Portfolios</h1>
        <Button>
          <PlusCircle className="mr-2 h-5 w-5" /> Create New Portfolio
        </Button>
      </div>

      {portfolios.length === 0 ? (
        <Card className="text-center py-12">
          <CardHeader>
            <CardTitle className="font-headline">No Portfolios Yet</CardTitle>
            <CardDescription>Start by creating your first investment portfolio.</CardDescription>
          </CardHeader>
          <CardContent>
            <Image src="https://placehold.co/300x200.png" alt="Empty state illustration" width={300} height={200} className="mx-auto mb-4 rounded-md" data-ai-hint="empty document"/>
            <Button size="lg">
              <PlusCircle className="mr-2 h-5 w-5" /> Create Portfolio
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {portfolios.map((portfolio) => (
            <Card key={portfolio.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="font-headline text-xl text-primary">{portfolio.name}</CardTitle>
                <CardDescription>Total Value: ${portfolio.totalValue.toLocaleString()}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">Assets: {portfolio.assetCount}</p>
                <p className="text-sm text-muted-foreground">Last Updated: {portfolio.lastUpdated}</p>
                <Image src={`https://placehold.co/400x200.png?id=${portfolio.id}`} alt={portfolio.name} width={400} height={200} className="w-full h-auto rounded-md mt-4" data-ai-hint="financial graph"/>
              </CardContent>
              <CardFooter className="flex justify-between items-center border-t pt-4">
                <div className="space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Button variant="ghost" size="sm">
                  View Details <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
