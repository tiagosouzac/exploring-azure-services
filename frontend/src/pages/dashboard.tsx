import { useEffect, useState } from "react";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/card";
import Page from "@/layouts/page";
import { Clock, Eye, MessageSquareText } from "lucide-react";
import { Link } from "react-router";
import api from "@/services/api";
import { Ticket } from "@/utils/types";
import { useAuth } from "@/context/AuthContext";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Dashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAttendant } = useAuth();

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      setError(null);

      try {
        const endpoint = isAttendant ? "/tickets" : "/tickets";
        const response = await api.get(endpoint);
        setTickets(response.data.data);
      } catch (err: any) {
        console.error("Erro ao carregar chamados:", err);
        setError(
          err.response?.data?.message ||
            "Não foi possível carregar os chamados. Tente novamente mais tarde."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [isAttendant]);

  return (
    <Page
      title={isAttendant ? "Todos os chamados" : "Meus chamados"}
      description="Aqui você pode visualizar e acompanhar os chamados abertos."
      breadcrumbs={[{ label: "Chamados" }]}
    >
      {loading && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(23rem,1fr))] gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="gap-4">
              <CardHeader>
                <div className="flex justify-between items-center gap-2">
                  <div className="h-6 w-3/4 bg-muted animate-pulse rounded"></div>
                  <div className="h-6 w-20 bg-muted animate-pulse rounded"></div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="h-4 w-full bg-muted animate-pulse rounded"></div>
                  <div className="h-4 w-full bg-muted animate-pulse rounded"></div>
                  <div className="h-4 w-2/3 bg-muted animate-pulse rounded"></div>
                </div>
                <div className="flex items-end justify-between">
                  <div className="space-y-1">
                    <div className="h-4 w-32 bg-muted animate-pulse rounded"></div>
                    <div className="h-4 w-28 bg-muted animate-pulse rounded"></div>
                  </div>
                  <div className="h-8 w-24 bg-muted animate-pulse rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="bg-destructive/15 text-destructive p-4 rounded-md">
          {error}
          <Button
            className="ml-4"
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
          >
            Tentar novamente
          </Button>
        </div>
      )}

      {!loading && !error && tickets.length === 0 && (
        <div className="text-center py-12">
          <h2 className="text-lg font-medium mb-2">
            Nenhum chamado encontrado
          </h2>
          <p className="text-muted-foreground mb-6">
            {isAttendant
              ? "Não há chamados registrados no sistema."
              : "Você ainda não abriu nenhum chamado."}
          </p>
          {!isAttendant && (
            <Link to="/tickets/new">
              <Button>Abrir novo chamado</Button>
            </Link>
          )}
        </div>
      )}

      {!loading && !error && tickets.length > 0 && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(23rem,1fr))] gap-4">
          {tickets.map((ticket) => (
            <Card key={ticket.id} className="gap-4">
              <CardHeader>
                <div className="flex justify-between items-center gap-2">
                  <CardTitle className="line-clamp-1">{ticket.title}</CardTitle>
                  <Badge
                    className={
                      ticket.status === "CONCLUIDO" ? "bg-green-500" : ""
                    }
                  >
                    {ticket.status === "ABERTO" ? "Em aberto" : "Concluído"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="line-clamp-3">
                  {ticket.description}
                </CardDescription>

                <div className="flex items-end justify-between">
                  <div className="space-y-1">
                    <div className="text-muted-foreground flex items-center gap-2">
                      <Clock size={16} />
                      <span className="text-sm">
                        Aberto em{" "}
                        {format(new Date(ticket.createdAt), "dd/MM/yyyy", {
                          locale: ptBR,
                        })}
                      </span>
                    </div>

                    <div className="text-muted-foreground flex items-center gap-2">
                      <MessageSquareText size={16} />
                      <span className="text-sm">
                        {ticket._count?.messages ||
                          ticket.messages?.length ||
                          0}{" "}
                        mensagens
                      </span>
                    </div>
                  </div>

                  <Link to={`/tickets/${ticket.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2" size={16} />
                      Ver chamado
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </Page>
  );
}
