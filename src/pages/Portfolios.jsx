import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  PlusCircle,
  Edit3,
  Trash2,
  ChevronRight,
  FolderArchive,
} from "lucide-react";
import { API_BASE_URL } from "@/constants/api";
import CreatePortfolioModal from "@/components/portfolios/CreatePortfolioModal";
import EditPortfolioModal from "@/components/portfolios/EditPortfolioModal";
import PortfolioDetails from "./PortfolioDetails";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

const cardHoverEffect =
  "transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1 hover:shadow-primary/20 border border-border hover:border-primary/30";

export default function PortfoliosPage() {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState(null);
  const [editPortfolio, setEditPortfolio] = useState(null);

  // Calcula el totalValue para cada portafolio sumando assets * precio actual
  const [portfoliosWithValue, setPortfoliosWithValue] = useState([]);

  // Fetch portfolios from backend
  const fetchPortfolios = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/portfolios`, {
        credentials: "include",
      });
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

  useEffect(() => {
    async function enrichPortfolios() {
      if (!portfolios || portfolios.length === 0) {
        setPortfoliosWithValue([]);
        return;
      }
      // Para cada portafolio, suma el valor de sus assets con cotización en tiempo real
      const enriched = await Promise.all(
        portfolios.map(async (portfolio) => {
          if (!Array.isArray(portfolio.assets) || portfolio.assets.length === 0) {
            return { ...portfolio, totalValue: 0 };
          }
          const assetsWithPrice = await Promise.all(
            portfolio.assets.map(async (asset) => {
              try {
                const res = await fetch(
                  `${API_BASE_URL}/api/yahoo/market/quotes/realtime/${encodeURIComponent(
                    asset.symbol
                  )}`
                );
                const data = await res.json();
                const info = data?.body || {};
                let price = info.primaryData?.lastSalePrice;
                if (typeof price === "string")
                  price = Number(price.replace(/[$,]/g, ""));
                if ((!price || isNaN(price)) && info.regularMarketPrice)
                  price = Number(info.regularMarketPrice);
                return {
                  ...asset,
                  realtimePrice: !isNaN(price) ? price : asset.price,
                };
              } catch {
                return { ...asset, realtimePrice: asset.price };
              }
            })
          );
          const totalValue = assetsWithPrice.reduce(
            (acc, asset) => acc + (Number(asset.realtimePrice) || 0) * (asset.quantity || 1),
            0
          );
          return { ...portfolio, totalValue };
        })
      );
      setPortfoliosWithValue(enriched);
    }
    enrichPortfolios();
  }, [JSON.stringify(portfolios)]);

  const handleCreatePortfolio = () => setShowCreate(true);

  const handlePortfolioCreated = async ({ name, description }) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/portfolios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, description }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Error creating portfolio");
      }
      if (!data.portfolio) {
        throw new Error(
          "La respuesta del backend no contiene el portafolio creado."
        );
      }
      setPortfolios((prev) => [...prev, data.portfolio]);
    } catch (err) {
      alert("Error al crear el portafolio: " + err.message);
    }
  };

  const handleEditPortfolio = (portfolio) => {
    setEditPortfolio(portfolio);
  };

  const handlePortfolioEdited = async (updatedPortfolio) => {
    setEditPortfolio(null);
    setPortfolios((prev) =>
      prev.map((p) => (p.id === updatedPortfolio.id ? updatedPortfolio : p))
    );
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

  // Nuevo: loading visual para portfoliosWithValue
  const isEnriching = loading || portfoliosWithValue.length === 0;

  // Solo mostrar el mensaje de "no tienes ningún portafolio" si NO está cargando y portfolios y portfoliosWithValue están vacíos
  const showNoPortfolios =
    !loading &&
    portfolios.length === 0 &&
    portfoliosWithValue.length === 0;

  if (loading && portfoliosWithValue.length === 0) {
    return (
      <AnimatePresence>
        <motion.div
          className="flex flex-col items-center justify-center min-h-[60vh] w-full"
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -40, scale: 0.97 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          <span className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mb-4"></span>
          <p className="text-lg text-muted-foreground">Cargando portfolios...</p>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (selectedPortfolioId) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -40, scale: 0.97 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          <PortfolioDetails
            portfolioId={selectedPortfolioId}
            onBack={handleBackFromDetails}
          />
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <motion.div
      className="container mx-auto py-4 px-2 sm:px-4"
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -40, scale: 0.97 }}
      transition={{ duration: 0.5, type: "spring" }}
    >
      <CreatePortfolioModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreate={handlePortfolioCreated}
      />
      {editPortfolio && (
        <EditPortfolioModal
          open={!!editPortfolio}
          portfolio={editPortfolio}
          onClose={() => setEditPortfolio(null)}
          onEdit={handlePortfolioEdited}
        />
      )}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-headline font-bold text-center w-full sm:w-auto">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary-foreground">
            Mis Portafolios
          </span>
        </h1>
        <Button
          className="shadow-lg hover:shadow-primary/40 w-full sm:w-auto"
          onClick={handleCreatePortfolio}
        >
          <PlusCircle className="mr-2 h-5 w-5" /> Crear Portafiolio
        </Button>
      </div>

      {showNoPortfolios ? (
        <Card className={`text-center py-12 ${cardHoverEffect}`}>
          <CardHeader>
            <FolderArchive className="h-16 w-16 text-primary mx-auto mb-4" />
            <CardTitle className="font-headline text-2xl">
              Todavía no tienes ningún portafolio
            </CardTitle>
            <CardDescription>
              Comienza a creando tu primer portafolio aqui
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              size="lg"
              className="shadow-lg hover:shadow-primary/40 w-full sm:w-auto"
              onClick={handleCreatePortfolio}
            >
              <PlusCircle className="mr-2 h-5 w-5" /> Crear Portafolio
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-4 sm:gap-6">
          {loading && portfoliosWithValue.length > 0 && (
            <div className="flex items-center gap-2 mb-4 text-muted-foreground">
              <span className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></span>
              Actualizando portfolios...
            </div>
          )}
          {portfoliosWithValue.map((portfolio) => (
            <Card
              key={portfolio.id}
              className={`flex flex-col sm:flex-row w-full cursor-pointer ${cardHoverEffect} items-center ${loading ? "opacity-60 pointer-events-none grayscale" : ""}`}
              onClick={() => handlePortfolioCardClick(portfolio)}
            >
              <div className="flex flex-col flex-1 px-3 py-3 sm:px-6 sm:py-4 w-full">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <CardTitle className="font-headline text-lg sm:text-xl text-primary break-words max-w-full">
                    {portfolio.name}
                  </CardTitle>
                  <div className="flex flex-row flex-wrap gap-2 sm:gap-6 mt-2 sm:mt-0">
                    <div>
                      <span className="inline-block text-xs text-muted-foreground mr-1">
                        Valor total
                      </span>
                      <span className="font-semibold text-base">
                        $
                        {portfolio.totalValue !== undefined
                          ? Number(portfolio.totalValue).toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })
                          : ""}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label="Edit Portfolio"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditPortfolio(portfolio);
                      }}
                      disabled={loading}
                      className="hidden sm:inline-flex"
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      aria-label="Delete Portfolio"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePortfolio(portfolio.id);
                      }}
                      disabled={loading}
                      className="hidden sm:inline-flex"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Ver detalles"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePortfolioCardClick(portfolio);
                      }}
                      disabled={loading}
                      className="hidden sm:inline-flex"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription className="mt-1 mb-2 break-words max-w-full">
                  {portfolio.description ? (
                    <span className="text-muted-foreground">
                      {portfolio.description}
                    </span>
                  ) : (
                    <span className="italic text-muted-foreground">
                      Sin descripción
                    </span>
                  )}
                </CardDescription>
                {/* Botones para mobile */}
                <div className="flex flex-row gap-2 mt-2 sm:hidden w-full">
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="Edit Portfolio"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditPortfolio(portfolio);
                    }}
                    disabled={loading}
                    className="flex-1"
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    aria-label="Delete Portfolio"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePortfolio(portfolio.id);
                    }}
                    disabled={loading}
                    className="flex-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Ver detalles"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePortfolioCardClick(portfolio);
                    }}
                    disabled={loading}
                    className="flex-1"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  );
}
