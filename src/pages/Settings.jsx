import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { UserCircle, Bell, ShieldCheck, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { API_BASE_URL } from "@/constants/api";
import { motion, AnimatePresence } from "framer-motion";

const cardHoverEffect =
  "transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1 hover:shadow-primary/20 border border-border hover:border-primary/30";

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.nickName || user.username || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg("");
    setErrorMsg("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username: name }),
      });
      if (!res.ok) throw new Error("No se pudo actualizar el nombre");
      setSuccessMsg("Nombre actualizado correctamente.");
    } catch (err) {
      setErrorMsg("Error al actualizar el nombre.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "¿Seguro que deseas eliminar tu cuenta? Esta acción es irreversible."
      )
    )
      return;
    setDeleting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/${user.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("No se pudo eliminar la cuenta");
      await signOut();
    } catch (err) {
      setErrorMsg("Error al eliminar la cuenta.");
      setDeleting(false);
    }
  };

  if (!user) {
    return (
      <motion.div
        className="container mx-auto py-8 max-w-3xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        <p className="text-lg text-muted-foreground">Cargando usuario...</p>
      </motion.div>
    );
  }

  return (
    <>
      <motion.h2
        className="text-3xl sm:text-4xl font-headline font-bold mb-10"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.7, type: "spring" }}
      >
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary-foreground">
          Configuración
        </span>
      </motion.h2>
      <motion.div
        className="container mx-auto py-8 max-w-3xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        <Card className={`mb-8 ${cardHoverEffect}`}>
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-2">
              <UserCircle className="h-6 w-6 text-primary/80" />
              Información de perfil
            </CardTitle>
            <CardDescription>Gestiona tus datos personales.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre de usuario</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-base"
                  disabled={saving}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  disabled
                  className="text-base"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  El correo no se puede modificar.
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="shadow-lg hover:shadow-primary/40"
                  disabled={saving}
                >
                  {saving ? "Guardando..." : "Guardar cambios"}
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  className="flex items-center gap-2"
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                >
                  <Trash2 className="h-4 w-4" />
                  {deleting ? "Eliminando..." : "Eliminar cuenta"}
                </Button>
              </div>
              {successMsg && (
                <div className="text-green-600 text-sm">{successMsg}</div>
              )}
              {errorMsg && (
                <div className="text-red-600 text-sm">{errorMsg}</div>
              )}
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
}
