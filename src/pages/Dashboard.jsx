import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, PieChart, AlertCircle, Activity, BarChart3, ChevronLeft, ChevronRight, Trash2, PlusCircle } from "lucide-react";
import { API_BASE_URL } from "@/constants/api";
import { useAuth } from "@/contexts/AuthContext";
import { PieChart as RechartsPieChart, Pie, Cell, Tooltip as PieTooltip, Legend as PieLegend } from "recharts";
import { motion, AnimatePresence } from "framer-motion";

const cardHoverEffect = "transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1 hover:shadow-primary/20 border border-border hover:border-primary/30";

const PIE_COLORS = [
  "#2563eb", "#e11d48", "#10b981", "#a21caf", "#f59e42",
  "#6366f1", "#fbbf24", "#14b8a6", "#f43f5e", "#0ea5e9"
];

function AssetPieChart({ assets }) {
  if (!assets || assets.length === 0) return <div className="text-muted-foreground text-sm">Sin activos</div>;
  const data = assets
    .map(a => ({
      name: a.symbol,
      value: Number(a.quantity),
    }))
    .filter(a => a.value > 0 && !!a.name);

  if (data.length === 0) return <div className="text-muted-foreground text-sm">Sin activos</div>;

  return (
    <div className="w-full flex flex-col items-center overflow-x-auto">
      <div className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl">
        <RechartsPieChart width={320} height={220}>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
          >
            {data.map((entry, idx) => (
              <Cell key={entry.name} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
            ))}
          </Pie>
          <PieTooltip
            formatter={(value, name) => [`${value} acciones`, "Cantidad"]}
          />
          <PieLegend verticalAlign="bottom" height={36} />
        </RechartsPieChart>
      </div>
    </div>
  );
}

function PortfolioPieCarousel({ portfolios }) {
  const [current, setCurrent] = useState(0);

  if (!portfolios || portfolios.length === 0) {
    return <div className="text-muted-foreground text-sm">No tienes portafolios.</div>;
  }

  const handlePrev = () => setCurrent((prev) => (prev === 0 ? portfolios.length - 1 : prev - 1));
  const handleNext = () => setCurrent((prev) => (prev === portfolios.length - 1 ? 0 : prev + 1));

  const portfolio = portfolios[current];

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-4 mb-2">
        <button
          onClick={handlePrev}
          className="p-2 rounded-full hover:bg-muted transition"
          aria-label="Anterior"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <motion.div
          key={portfolio.id}
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.4, type: "spring" }}
          className="font-semibold text-primary text-lg"
        >
          {portfolio.name}
        </motion.div>
        <button
          onClick={handleNext}
          className="p-2 rounded-full hover:bg-muted transition"
          aria-label="Siguiente"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={portfolio.id + "-pie"}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.4, type: "spring" }}
          className="w-full"
        >
          <AssetPieChart assets={portfolio.assets || []} />
        </motion.div>
      </AnimatePresence>
      <div className="flex gap-1 mt-2">
        {portfolios.map((_, idx) => (
          <span
            key={idx}
            className={`inline-block w-2 h-2 rounded-full transition-all duration-300 ${idx === current ? "bg-primary scale-125" : "bg-muted-foreground/40"}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [portfolioSummary, setPortfolioSummary] = useState(null);
  const [topAsset, setTopAsset] = useState(null);
  const [worstAsset, setWorstAsset] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [portfolios, setPortfolios] = useState([]);
  const [activityLoading, setActivityLoading] = useState(true);

  // --- ACTIVIDAD RECIENTE: SOLO BACKEND, SOLO FECHAS REALES ---
  async function fetchRecentActivity() {
    setActivityLoading(true);
    try {
      // Usa el endpoint dedicado para actividad reciente
      const res = await fetch(`${API_BASE_URL}/api/portfolios/activity/recent`, { credentials: "include" });
      const data = await res.json();
      // data.activity es un array de objetos {type, action, symbol, name, quantity, date, portfolio}
      setRecentActivity(Array.isArray(data.activity) ? data.activity : []);
    } catch {
      setRecentActivity([]);
    }
    setActivityLoading(false);
  }

  useEffect(() => {
    async function fetchDashboard() {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/portfolios`, { credentials: "include" });
        const portfoliosArr = await res.json();
        setPortfolios(Array.isArray(portfoliosArr) ? portfoliosArr : []);

        let allAssets = [];
        let totalValue = 0;
        let totalCost = 0;
        let todayChange = 0;

        for (const portfolio of portfoliosArr) {
          if (!Array.isArray(portfolio.assets)) continue;
          for (const asset of portfolio.assets) {
            let quote = null;
            try {
              const resQuote = await fetch(`${API_BASE_URL}/api/yahoo/market/quotes/realtime/${encodeURIComponent(asset.symbol)}`);
              const dataQuote = await resQuote.json();
              const info = dataQuote?.body || {};
              let price = info.primaryData?.lastSalePrice;
              if (typeof price === "string") price = Number(price.replace(/[$,]/g, ""));
              if ((!price || isNaN(price)) && info.regularMarketPrice) price = Number(info.regularMarketPrice);

              let change = info.primaryData?.netChange;
              if (typeof change === "string") change = Number(change.replace(/[,]/g, ""));
              if ((!change || isNaN(change)) && info.regularMarketChange) change = Number(info.regularMarketChange);

              let changePercent = info.primaryData?.percentageChange;
              if (typeof changePercent === "string") changePercent = Number(changePercent.replace(/[%]/g, ""));
              if ((!changePercent || isNaN(changePercent)) && info.regularMarketChangePercent) changePercent = Number(info.regularMarketChangePercent);

              quote = {
                symbol: asset.symbol,
                name: asset.name,
                price: !isNaN(price) ? price : asset.price,
                quantity: asset.quantity,
                change: !isNaN(change) ? change : 0,
                changePercent: !isNaN(changePercent) ? changePercent : 0,
                cost: asset.price * asset.quantity,
              };
            } catch {
              quote = {
                symbol: asset.symbol,
                name: asset.name,
                price: asset.price,
                quantity: asset.quantity,
                change: 0,
                changePercent: 0,
                cost: asset.price * asset.quantity,
              };
            }
            allAssets.push(quote);
            totalValue += quote.price * quote.quantity;
            totalCost += quote.cost;
            todayChange += quote.change * quote.quantity;
          }
        }

        const validAssets = allAssets.filter(a => typeof a.changePercent === "number" && !isNaN(a.changePercent));
        let top = null;
        let worst = null;
        if (validAssets.length > 0) {
          top = validAssets.reduce((a, b) => (a.changePercent > b.changePercent ? a : b));
          worst = validAssets.reduce((a, b) => (a.changePercent < b.changePercent ? a : b));
        }

        setPortfolioSummary({
          totalValue,
          todayChange,
          todayChangePercent: totalValue > 0 ? ((todayChange / (totalValue - todayChange)) * 100).toFixed(2) : 0,
          overallReturn: totalValue - totalCost,
          overallReturnPercent: totalCost > 0 ? (((totalValue - totalCost) / totalCost) * 100).toFixed(2) : 0,
        });
        setTopAsset(top);
        setWorstAsset(worst);
      } catch {
        setPortfolioSummary({
          totalValue: 0,
          todayChange: 0,
          todayChangePercent: 0,
          overallReturn: 0,
          overallReturnPercent: 0,
        });
        setTopAsset(null);
        setWorstAsset(null);
      }
      setLoading(false);
    }
    fetchDashboard();
    fetchRecentActivity();
  }, [user]);

  if (loading) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center py-16 w-full min-h-[60vh]"
        initial={{ opacity: 0, scale: 0.95, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -40 }}
        transition={{ duration: 0.7, type: "spring" }}
      >
        <span className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4"></span>
        <p className="text-lg text-muted-foreground">Cargando dashboard...</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="w-full min-h-screen px-1 sm:px-2 md:px-4 overflow-x-auto"
      initial={{ opacity: 0, scale: 0.97, y: 60 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97, y: -60 }}
      transition={{ duration: 0.7, type: "spring" }}
    >
      <motion.h1
        className="text-2xl sm:text-4xl font-headline font-bold mb-6 sm:mb-10 text-center break-words"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: "spring" }}
      >
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary-foreground">
          Mi Dashboard
        </span>
      </motion.h1>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.13,
            },
          },
        }}
      >
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            {i === 0 && (
              <Card className={cardHoverEffect}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Valor total del portafolio</CardTitle>
                  <DollarSign className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${portfolioSummary?.totalValue?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                  <p className={`text-xs ${portfolioSummary?.todayChange >= 0 ? 'text-positive' : 'text-negative'}`}>
                    {portfolioSummary?.todayChange >= 0 ? '+' : ''}
                    ${portfolioSummary?.todayChange?.toLocaleString(undefined, { minimumFractionDigits: 2 })} ({portfolioSummary?.todayChangePercent}%) hoy
                  </p>
                </CardContent>
              </Card>
            )}
            {i === 1 && (
              <Card className={cardHoverEffect}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Retorno total</CardTitle>
                  <TrendingUp className="h-5 w-5 text-positive" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${portfolioSummary?.overallReturn?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                  <p className={`text-xs ${portfolioSummary?.overallReturn >= 0 ? 'text-positive' : 'text-negative'}`}>
                    {portfolioSummary?.overallReturn >= 0 ? '+' : ''}
                    {portfolioSummary?.overallReturnPercent}% total
                  </p>
                </CardContent>
              </Card>
            )}
            {i === 2 && (
              <Card className={cardHoverEffect}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Mejor rendimiento (hoy)</CardTitle>
                  <TrendingUp className="h-5 w-5 text-positive" />
                </CardHeader>
                <CardContent>
                  {topAsset && typeof topAsset.changePercent === "number" ? (
                    <>
                      <div className="text-lg font-semibold">{topAsset.name} ({topAsset.symbol})</div>
                      <p className={`text-xs ${topAsset.changePercent >= 0 ? "text-positive" : "text-negative"}`}>
                        {topAsset.changePercent >= 0 ? "+" : ""}
                        {topAsset.changePercent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%
                      </p>
                    </>
                  ) : (
                    <div className="text-muted-foreground text-sm">Sin datos</div>
                  )}
                </CardContent>
              </Card>
            )}
            {i === 3 && (
              <Card className={cardHoverEffect}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Peor rendimiento (hoy)</CardTitle>
                  <AlertCircle className="h-5 w-5 text-negative" />
                </CardHeader>
                <CardContent>
                  {worstAsset && typeof worstAsset.changePercent === "number" ? (
                    <>
                      <div className="text-lg font-semibold">{worstAsset.name} ({worstAsset.symbol})</div>
                      <p className={`text-xs ${worstAsset.changePercent >= 0 ? "text-positive" : "text-negative"}`}>
                        {worstAsset.changePercent >= 0 ? "+" : ""}
                        {worstAsset.changePercent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%
                      </p>
                    </>
                  ) : (
                    <div className="text-muted-foreground text-sm">Sin datos</div>
                  )}
                </CardContent>
              </Card>
            )}
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.18,
            },
          },
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -40, scale: 0.97 }}
          transition={{ duration: 0.6, type: "spring" }}
        >
          <Card className={`w-full ${cardHoverEffect}`}>
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-primary/80" /> Distribución de activos por portafolio
              </CardTitle>
              <CardDescription>Visualiza la composición de cada portafolio por cantidad de acciones.</CardDescription>
            </CardHeader>
            <CardContent>
              <PortfolioPieCarousel portfolios={portfolios} />
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -40, scale: 0.97 }}
          transition={{ duration: 0.6, type: "spring" }}
        >
          <Card className={`w-full ${cardHoverEffect}`}>
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center gap-2">
                <Activity className="h-6 w-6 text-primary/80" /> Recientemente Agregados
              </CardTitle>
              <CardDescription>Últimos movimientos en tus portafolios.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {activityLoading ? (
                  <li className="p-2">Cargando actividad...</li>
                ) : recentActivity.length === 0 ? (
                  <li className="p-2">Sin actividad reciente.</li>
                ) : (
                  <AnimatePresence>
                    {recentActivity.map((act, idx) => (
                      <motion.li
                        key={act.symbol + act.action + idx}
                        className={`flex items-center gap-2 p-2 rounded-md transition-colors
                          ${act.type === "remove"
                            ? "bg-red-100/60 dark:bg-red-900/30"
                            : "bg-muted/30 hover:bg-muted/50"}
                        `}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.4, type: "spring" }}
                      >
                        {act.type === "remove" ? (
                          <Trash2 className="h-4 w-4 text-negative" />
                        ) : (
                          <PlusCircle className="h-4 w-4 text-positive" />
                        )}
                        <span>
                          <span className="font-semibold">{act.action}</span>{" "}
                          {act.quantity} de {act.symbol} ({act.name})
                          {act.portfolio && (
                            <span className="ml-1 text-xs text-muted-foreground">
                              en <span className="font-semibold">{act.portfolio}</span>
                            </span>
                          )}
                          {act.date && (
                            <span className="ml-2 text-xs text-muted-foreground">
                              {new Date(act.date).toLocaleString()}
                            </span>
                          )}
                        </span>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                )}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
