import { useState } from "react";
import { useNavigate } from "react-router";
import Page from "@/layouts/page";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { Textarea } from "@/components/textarea";
import api from "@/services/api";

export default function NewTicket() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Enviar o ticket para o backend
      const response = await api.post("/tickets", {
        title,
        description,
      });

      // Redirecionar para a página do ticket criado
      const ticketId = response.data.data.id;
      navigate(`/tickets/${ticketId}`);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Ocorreu um erro ao criar o chamado. Tente novamente."
      );
      setIsSubmitting(false);
    }
  };

  return (
    <Page
      title="Novo chamado"
      description="Preencha o formulário abaixo para abrir um novo chamado."
      breadcrumbs={[{ label: "Chamados", to: "/" }, { label: "Novo chamado" }]}
    >
      <form className="max-w-md" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          {error && (
            <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm">
              {error}
            </div>
          )}
          <div className="grid gap-3">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              type="text"
              placeholder="Ex.: Problema com o login"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <div className="grid gap-3">
            <div className="flex items-center">
              <Label htmlFor="description">Descrição</Label>
            </div>
            <Textarea
              id="description"
              name="description"
              placeholder="Forneça uma descrição detalhada do problema para que possamos ajudá-lo da melhor forma possível"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
              className="min-h-36"
            />
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Criando chamado...
              </>
            ) : (
              "Abrir chamado"
            )}
          </Button>
        </div>
      </form>
    </Page>
  );
}
