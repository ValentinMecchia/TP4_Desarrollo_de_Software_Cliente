import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Edit3, Trash2, ChevronRight, FolderArchive } from "lucide-react";
import { API_BASE_URL } from "@/constants/api";
import CreatePortfolioModal from "@/components/portfolios/CreatePortfolioModal";
import PortfolioDetails from "./PortfolioDetails";

const cardHoverEffect = "transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1 hover:shadow-primary/20 border border-border hover:border-primary/30";

export default function PortfoliosPage() {
	const [portfolios, setPortfolios] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showCreate, setShowCreate] = useState(false);
	const [selectedPortfolioId, setSelectedPortfolioId] = useState(null);

	// Fetch portfolios from backend
	const fetchPortfolios = async () => {
		setLoading(true);
		try {
			const res = await fetch(`${API_BASE_URL}/api/portfolios`, { credentials: "include" });
			if (!res.ok) throw new Error("Error fetching portfolios");
			const data = await res.json();
			// Soporta tanto { portfolios: [...] } como [ ... ]
			const portfoliosArr = Array.isArray(data) ? data : data.portfolios;
			setPortfolios(portfoliosArr || []);
		} catch (err) {
			setPortfolios([]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchPortfolios();
	}, []);

	const handleCreatePortfolio = () => setShowCreate(true);

	const handlePortfolioCreated = async (name) => {
		try {
			const res = await fetch(`${API_BASE_URL}/api/portfolios`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ name }),
			});
			const data = await res.json();
			if (!res.ok) {
				throw new Error(data?.message || "Error creating portfolio");
			}
			if (!data.portfolio) {
				throw new Error("La respuesta del backend no contiene el portafolio creado.");
			}
			setPortfolios((prev) => [...prev, data.portfolio]);
		} catch (err) {
			alert("Error al crear el portafolio: " + err.message);
		}
	};

	const handleEditPortfolio = (id) => {
		alert(`Editar portfolio ${id} (mock)`);
	};

	const handleDeletePortfolio = async (id) => {
		if (window.confirm("¿Seguro que deseas eliminar este portfolio?")) {
			await fetch(`${API_BASE_URL}/api/portfolios/${id}`, {
				method: "DELETE",
				credentials: "include",
			});
			setPortfolios((prev) => prev.filter((p) => p.id !== id));
		}
	};

	const handlePortfolioCardClick = (portfolio) => {
		setSelectedPortfolioId(portfolio.id);
	};

	// Refresca la lista al volver de PortfolioDetails
	const handleBackFromDetails = () => {
		setSelectedPortfolioId(null);
		fetchPortfolios();
	};

	if (loading) {
		return (
			<div className="flex flex-col items-center justify-center py-16">
				<span className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4"></span>
				<p className="text-lg text-muted-foreground">Cargando portfolios...</p>
			</div>
		);
	}

	if (selectedPortfolioId) {
		return (
			<PortfolioDetails
				portfolioId={selectedPortfolioId}
				onBack={handleBackFromDetails}
			/>
		);
	}

	return (
		<div className="container mx-auto py-8">
			<CreatePortfolioModal
				open={showCreate}
				onClose={() => setShowCreate(false)}
				onCreate={handlePortfolioCreated}
			/>
			<div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
				<h1 className="text-3xl sm:text-4xl font-headline font-bold">
					<span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary-foreground">My Portfolios</span>
				</h1>
				<Button className="shadow-lg hover:shadow-primary/40" onClick={handleCreatePortfolio}>
					<PlusCircle className="mr-2 h-5 w-5" /> Create New Portfolio
				</Button>
			</div>

			{portfolios.length === 0 ? (
				<Card className={`text-center py-12 ${cardHoverEffect}`}>
					<CardHeader>
						<FolderArchive className="h-16 w-16 text-primary mx-auto mb-4" />
						<CardTitle className="font-headline text-2xl">No Portfolios Yet</CardTitle>
						<CardDescription>Start by creating your first investment portfolio.</CardDescription>
					</CardHeader>
					<CardContent>
						<img
							src="https://placehold.co/300x200.png"
							alt="Empty state illustration"
							width={300}
							height={200}
							className="mx-auto mb-6 rounded-lg shadow-md"
							data-ai-hint="empty document"
						/>
						<Button size="lg" className="shadow-lg hover:shadow-primary/40" onClick={handleCreatePortfolio}>
							<PlusCircle className="mr-2 h-5 w-5" /> Create Portfolio
						</Button>
					</CardContent>
				</Card>
			) : (
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{portfolios.map((portfolio) => (
						<Card
							key={portfolio.id}
							className={`flex flex-col cursor-pointer ${cardHoverEffect}`}
							onClick={() => handlePortfolioCardClick(portfolio)}
						>
							<CardHeader>
								<CardTitle className="font-headline text-xl text-primary">{portfolio.name}</CardTitle>
								<CardDescription>Total Value: ${portfolio.totalValue?.toLocaleString?.() ?? portfolio.totalValue}</CardDescription>
							</CardHeader>
							<CardContent className="flex-grow">
								<p className="text-sm text-muted-foreground">Assets: {portfolio.assetCount}</p>
								<p className="text-sm text-muted-foreground mb-3">
									Last Updated: {portfolio.lastUpdated ? new Date(portfolio.lastUpdated).toLocaleDateString() : "-"}
								</p>
								<img
									src={`https://placehold.co/400x200.png?text=${portfolio.name.replace(/\s/g, "+")}&id=${portfolio.id}`}
									alt={portfolio.name}
									width={400}
									height={200}
									className="w-full h-auto rounded-md shadow-sm opacity-80"
									data-ai-hint="financial graph"
								/>
							</CardContent>
							<CardFooter className="flex justify-between items-center border-t pt-4">
								<div className="space-x-2">
									<Button variant="outline" size="icon" aria-label="Edit Portfolio" onClick={e => { e.stopPropagation(); handleEditPortfolio(portfolio.id); }}>
										<Edit3 className="h-4 w-4" />
									</Button>
									<Button variant="destructive" size="icon" aria-label="Delete Portfolio" onClick={e => { e.stopPropagation(); handleDeletePortfolio(portfolio.id); }}>
										<Trash2 className="h-4 w-4" />
									</Button>
								</div>
							</CardFooter>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}
