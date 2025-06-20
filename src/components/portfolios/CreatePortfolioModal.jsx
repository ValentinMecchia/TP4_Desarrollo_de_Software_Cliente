import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CreatePortfolioModal({ open, onClose, onCreate }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    const handleCreate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onCreate({ name, description });
            setName("");
            setDescription("");

            // Espera un frame para evitar desmontar el modal antes de que el form se procese
            requestAnimationFrame(() => {
                onClose();
            });
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Crear Portafolio</DialogTitle>
                    <DialogDescription className="sr-only">
                        Formulario para crear un nuevo portafolio de inversión
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreate} className="space-y-4">
                    <Input
                        placeholder="Nombre del portafolio"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <Input
                        placeholder="Descripción (opcional)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading || !name.trim()}
                        >
                            {loading ? "Creando..." : "Crear"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
