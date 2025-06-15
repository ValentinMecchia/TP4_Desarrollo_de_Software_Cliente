"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Newspaper, MoreVertical, Star, StarOff, Pencil, Save, X } from "lucide-react";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { API_BASE_URL } from "@/constants/api";
import { motion, AnimatePresence } from "framer-motion";

const cardHoverEffect =
  "transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1 hover:shadow-primary/20 border border-border hover:border-primary/30";

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [visibleCount, setVisibleCount] = useState(3);
  const [hiddenNews, setHiddenNews] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [editingDescId, setEditingDescId] = useState(null);
  const [descDraft, setDescDraft] = useState("");

  // Cargar favoritos desde el backend (tabla news)
  useEffect(() => {
    async function fetchFavorites() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/news`, { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setFavorites(Array.isArray(data) ? data : []);
        } else {
          setFavorites([]);
        }
      } catch {
        setFavorites([]);
      }
    }
    fetchFavorites();
  }, []);

  // Guardar favoritos en el backend
  const addFavorite = async (article) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/news`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: article.title || article.name || article.shortname || "",
          content: article.description || article.summary || article.content || "",
          image: article.imageUrl || article.image || article.thumbnail || "",
          url: article.link || article.url || "",
        }),
      });
      if (res.ok) {
        const saved = await res.json();
        setFavorites((prev) => [...prev, saved]);
      }
    } catch {
      // ignore
    }
  };

  // Eliminar favorito del backend
  const removeFavorite = async (article) => {
    // Busca por url o id
    const fav = favorites.find(
      (f) =>
        f.url === (article.link || article.url) ||
        f.id === article.id
    );
    if (!fav) return;
    try {
      await fetch(`${API_BASE_URL}/api/news/${fav.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      setFavorites((prev) => prev.filter((f) => f.id !== fav.id));
    } catch {
      // ignore
    }
  };

  // Modificar descripción favorita en backend
  const updateFavoriteDesc = async (favId, newDesc) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/news/${favId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content: newDesc }),
      });
      if (res.ok) {
        setFavorites((prev) =>
          prev.map((f) =>
            f.id === favId ? { ...f, content: newDesc } : f
          )
        );
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    const loadNews = async () => {
      setLoadingNews(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/yahoo/news`);
        const data = await res.json();
        let newsArr = [];
        if (Array.isArray(data)) {
          newsArr = data;
        } else if (Array.isArray(data.body)) {
          newsArr = data.body;
        } else if (Array.isArray(data.data?.items)) {
          newsArr = data.data.items;
        } else if (Array.isArray(data.items)) {
          newsArr = data.items;
        }
        setNews(newsArr);
      } catch {
        setNews([]);
      }
      setLoadingNews(false);
    };
    loadNews();
  }, []);

  // Filtra las noticias ocultas por el usuario
  const filteredNews = news.filter(
    (article, idx) =>
      !hiddenNews.includes(article.id || article.link || article.url || idx)
  );

  // Cuando se oculta una noticia, reemplaza solo una (la anterior oculta se vuelve visible)
  const handleHide = (article, idx) => {
    const key = article.id || article.link || article.url || idx;
    setHiddenNews([key]);
  };

  // Favoritos: agregar o quitar
  const isFavorite = (article) => {
    const url = article.link || article.url;
    return favorites.some(
      (fav) => fav.url === url
    );
  };

  const handleToggleFavorite = (article, idx) => {
    if (isFavorite(article)) {
      removeFavorite(article);
    } else {
      addFavorite(article);
    }
  };

  // Edición de descripción favorita
  const handleEditDesc = (fav) => {
    setEditingDescId(fav.id);
    setDescDraft(fav.content || "");
  };

  const handleSaveDesc = async (fav) => {
    await updateFavoriteDesc(fav.id, descDraft);
    setEditingDescId(null);
  };

  if (loadingNews) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <LoadingSpinner size={48} />
        <p className="mt-4 text-lg text-muted-foreground">
          Cargando noticias...
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <motion.h1
        className="text-3xl sm:text-4xl font-headline font-bold mb-10 flex items-center gap-3"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: "spring" }}
      >
        <Newspaper className="h-10 w-10 text-primary" />
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary-foreground">
          Noticias del Mercado
        </span>
      </motion.h1>

      {/* Sección de favoritos */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Star className="h-6 w-6 text-yellow-400" />
          Noticias Favoritas
        </h2>
        {favorites.length === 0 ? (
          <div className="text-muted-foreground text-sm mb-6">
            No tienes noticias favoritas aún.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
            <AnimatePresence>
              {favorites.map((fav, idx) => (
                <motion.div
                  key={fav.id || fav.url || idx}
                  initial={{ opacity: 0, y: 30, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -30, scale: 0.97 }}
                  transition={{ duration: 0.4, type: "spring" }}
                  layout
                >
                  <Card className={`flex flex-col relative ${cardHoverEffect}`}>
                    <CardHeader>
                      {fav.image && (
                        <motion.img
                          src={fav.image}
                          alt={fav.name}
                          width={400}
                          height={200}
                          className="w-full h-48 object-cover rounded-t-lg mb-4"
                          loading="lazy"
                          initial={{ opacity: 0, scale: 1.05 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5 }}
                        />
                      )}
                      <div className="absolute top-2 right-2 z-10 flex gap-2">
                        <button
                          className="p-1 rounded-full hover:bg-muted transition"
                          onClick={() => removeFavorite(fav)}
                          aria-label="Quitar de favoritos"
                        >
                          <StarOff className="h-5 w-5 text-yellow-400" />
                        </button>
                        {editingDescId === fav.id ? (
                          <button
                            className="p-1 rounded-full hover:bg-muted transition"
                            onClick={() => setEditingDescId(null)}
                            aria-label="Cancelar edición"
                          >
                            <X className="h-5 w-5 text-muted-foreground" />
                          </button>
                        ) : (
                          <button
                            className="p-1 rounded-full hover:bg-muted transition"
                            onClick={() => handleEditDesc(fav)}
                            aria-label="Editar descripción"
                          >
                            <Pencil className="h-5 w-5 text-primary" />
                          </button>
                        )}
                      </div>
                      <CardTitle className="font-headline text-lg leading-tight text-primary">
                        <a
                          href={fav.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {fav.name}
                        </a>
                      </CardTitle>
                      <CardDescription className="text-xs text-muted-foreground">
                        {/* Puedes agregar fecha si la guardas en el modelo */}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      {editingDescId === fav.id ? (
                        <div>
                          <textarea
                            className="w-full border rounded p-2 text-sm mb-2"
                            rows={3}
                            value={descDraft}
                            onChange={e => setDescDraft(e.target.value)}
                          />
                          <Button
                            size="sm"
                            className="mr-2"
                            onClick={() => handleSaveDesc(fav)}
                          >
                            <Save className="h-4 w-4 mr-1" /> Guardar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingDescId(null)}
                          >
                            Cancelar
                          </Button>
                        </div>
                      ) : (
                        <motion.p
                          className="text-sm text-muted-foreground mb-4 line-clamp-4"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          {fav.content || ""}
                        </motion.p>
                      )}
                    </CardContent>
                    <CardFooter className="flex flex-col sm:flex-row justify-between items-center border-t pt-4 gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="w-full sm:w-auto"
                      >
                        <a
                          href={fav.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Leer más <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Noticias normales */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {filteredNews.slice(0, visibleCount).map((article, idx) => (
            <motion.div
              key={article.id || article.link || idx}
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.97 }}
              transition={{ duration: 0.4, type: "spring" }}
              layout
            >
              <Card className={`flex flex-col relative ${cardHoverEffect}`}>
                <CardHeader>
                  {/* Imagen de la noticia */}
                  {article.imageUrl || article.image || article.thumbnail ? (
                    <motion.img
                      src={
                        article.imageUrl ||
                        article.image ||
                        article.thumbnail
                      }
                      alt={article.title}
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover rounded-t-lg mb-4"
                      loading="lazy"
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                  ) : null}
                  <div className="absolute top-2 right-2 z-10 flex gap-2">
                    <button
                      className="p-1 rounded-full hover:bg-muted transition"
                      onClick={() => handleToggleFavorite(article, idx)}
                      aria-label={isFavorite(article) ? "Quitar de favoritos" : "Agregar a favoritos"}
                    >
                      {isFavorite(article) ? (
                        <StarOff className="h-5 w-5 text-yellow-400" />
                      ) : (
                        <Star className="h-5 w-5 text-yellow-400" />
                      )}
                    </button>
                    <NewsMenu
                      onHide={() => handleHide(article, idx)}
                    />
                  </div>
                  <CardTitle className="font-headline text-lg leading-tight text-primary">
                    <a
                      href={article.link || article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {article.title}
                    </a>
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    {article.publisher || article.source || article.provider || "-"}
                    {article.pubDate || article.date
                      ? " - " +
                        new Date(
                          article.pubDate || article.date
                        ).toLocaleDateString()
                      : ""}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <motion.p
                    className="text-sm text-muted-foreground mb-4 line-clamp-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {article.summary ||
                      article.description ||
                      article.content ||
                      ""}
                  </motion.p>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row justify-between items-center border-t pt-4 gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="w-full sm:w-auto"
                  >
                    <a
                      href={article.link || article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Leer más <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {visibleCount < filteredNews.length && (
        <motion.div
          className="flex justify-center mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            variant="outline"
            onClick={() => setVisibleCount((v) => v + 3)}
            className="shadow-sm hover:shadow-accent/30"
          >
            Cargar más noticias
          </Button>
        </motion.div>
      )}
    </div>
  );
}

// Menú de 3 puntitos para cada noticia
function NewsMenu({ onHide }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        className="p-1 rounded-full hover:bg-muted transition"
        onClick={() => setOpen((v) => !v)}
        aria-label="Opciones"
        tabIndex={0}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
      >
        <MoreVertical className="h-5 w-5 text-muted-foreground" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute right-0 mt-2 w-40 bg-card border border-border rounded shadow-lg z-20"
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <button
              className="block w-full text-left px-4 py-2 text-sm hover:bg-muted/60"
              onClick={() => {
                setOpen(false);
                onHide();
              }}
            >
              No me interesa
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}