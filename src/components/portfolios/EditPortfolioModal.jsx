import React, { useState, useEffect } from "react";
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
import { API_BASE_URL } from "@/constants/api";

export default function EditPortfolioModal({ open, onClose, onEdit, portfolio }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setName(portfolio?.name || "");
        setDescription(portfolio?.description || "");
    }, [portfolio]);

    const handleEdit = async (e) => {
        e.preventDefault(); // ¡importante!
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/portfolios/${portfolio.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ name, description }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error || "Error al editar el portafolio");
            onEdit(data);
            onClose();
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar Portafolio</DialogTitle>
                    <DialogDescription className="sr-only">
                        Formulario para editar un portafolio existente
                    </DialogDescription>
                </DialogHeader>

                {/* FORMULARIO DENTRO DEL DIALOG CONTENT */}
                <form onSubmit={handleEdit} className="space-y-4">
                    <Input
                        placeholder="Nombre"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                    />
                    <Input
                        placeholder="Descripción"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
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
                        <Button type="submit" disabled={loading}>
                            {loading ? "Guardando..." : "Guardar"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
