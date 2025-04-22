import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import Page from "@/layouts/page";
import {
  Clock,
  MessageSquareText,
  Paperclip,
  Send,
  CheckSquare,
} from "lucide-react";
import api from "@/services/api";
import { Ticket as TicketType } from "@/utils/types";
import { useAuth } from "@/context/AuthContext";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Ticket() {
  const { id } = useParams<{ id: string }>();
  const { user, isAttendant } = useAuth();
  const [ticket, setTicket] = useState<TicketType | null>(null);
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchTicket = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        const response = await api.get(`/tickets/${id}`);
        setTicket(response.data.data);
      } catch (err: any) {
        console.error("Erro ao carregar o chamado:", err);
        setError(
          err.response?.data?.message ||
            "Não foi possível carregar o chamado. Tente novamente mais tarde."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [ticket?.messages]);

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles([...files, ...selectedFiles]);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!message.trim() && files.length === 0) return;

    setSending(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("content", message);
      formData.append("ticketId", id!);

      files.forEach((file) => {
        formData.append("attachments", file);
      });

      const response = await api.post("/messages", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (ticket) {
        setTicket({
          ...ticket,
          messages: [...ticket?.messages, response.data.data],
        });
      }

      setMessage("");
      setFiles([]);
    } catch (err: any) {
      console.error("Erro ao enviar mensagem:", err);
      setError(
        err.response?.data?.message ||
          "Não foi possível enviar a mensagem. Tente novamente."
      );
    } finally {
      setSending(false);
    }
  };

  const handleCloseTicket = async () => {
    if (!isAttendant || !id) return;

    try {
      const response = await api.patch(`/tickets/${id}/status`, {
        status: "CONCLUIDO",
      });

      console.log("Chamado fechado com sucesso:", response.data);

      setTicket({
        ...ticket!,
        ...response.data.data,
      });
    } catch (err: any) {
      console.error("Erro ao fechar o chamado:", err);
      setError(
        err.response?.data?.message ||
          "Não foi possível fechar o chamado. Tente novamente."
      );
    }
  };

  if (loading) {
    return (
      <Page
        breadcrumbs={[
          { label: "Chamados", to: "/" },
          { label: "Carregando..." },
        ]}
      >
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
        </div>
      </Page>
    );
  }

  if (error || !ticket) {
    return (
      <Page breadcrumbs={[{ label: "Chamados", to: "/" }, { label: "Erro" }]}>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="bg-destructive/15 text-destructive p-4 rounded-md max-w-lg mx-auto text-center mb-4">
            {error || "Chamado não encontrado."}
          </div>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Tentar novamente
          </Button>
        </div>
      </Page>
    );
  }

  return (
    <Page
      breadcrumbs={[{ label: "Chamados", to: "/" }, { label: ticket.title }]}
    >
      <div className="max-w-5xl divide-x flex flex-col md:flex-row flex-1">
        <div className="flex-1 space-y-4 pr-0 md:pr-10 pb-6 md:pb-0">
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-6">
              <Badge
                className={ticket.status === "CONCLUIDO" ? "bg-green-500" : ""}
              >
                {ticket.status === "ABERTO" ? "Em aberto" : "Concluído"}
              </Badge>
            </div>

            <h1 className="text-2xl font-semibold tracking-tight">
              {ticket.title}
            </h1>

            <div className="max-h-96 overflow-y-auto pr-4 -mr-4">
              <p className="text-muted-foreground whitespace-pre-wrap">
                {ticket.description}
              </p>
            </div>
          </div>

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
                  {ticket?.messages?.length} mensagens
                </span>
              </div>
            </div>
          </div>

          {isAttendant && ticket.status === "ABERTO" && (
            <div className="mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCloseTicket}
                disabled={sending}
              >
                <CheckSquare className="mr-1" size={16} />
                Concluir chamado
              </Button>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col pl-0 md:pl-10 gap-4">
          <div
            ref={messagesContainerRef}
            className="flex flex-1 flex-col p-4 rounded-md bg-neutral-50 overflow-y-auto max-h-[500px]"
          >
            {ticket?.messages?.length === 0 ? (
              <p className="text-sm text-muted-foreground my-auto text-center">
                Ainda não há mensagens nesta conversa. Assim que você enviar uma
                mensagem, ela aparecerá aqui.
              </p>
            ) : (
              ticket?.messages?.map((msg) => (
                <div
                  key={msg.id}
                  className={`mb-4 max-w-[85%] ${
                    msg.userId === user?.id ? "self-end" : "self-start"
                  }`}
                >
                  <div
                    className={`rounded-lg p-3 ${
                      msg.userId === user?.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary"
                    }`}
                  >
                    <div className="text-xs font-medium mb-1">
                      {msg.user.name} •{" "}
                      {format(new Date(msg.createdAt), "dd/MM/yyyy HH:mm", {
                        locale: ptBR,
                      })}
                    </div>
                    <div className="whitespace-pre-wrap">{msg.content}</div>

                    {msg.attachments.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {msg.attachments.map((attachment) => (
                          <a
                            key={attachment.id}
                            href={attachment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs hover:underline"
                          >
                            <Paperclip size={12} />
                            {attachment.filename} (
                            {Math.round(attachment.size / 1024)} KB)
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {ticket.status === "ABERTO" && (
            <form className="space-y-2" onSubmit={handleSendMessage}>
              {files.length > 0 && (
                <div className="flex flex-wrap gap-2 p-2 bg-muted rounded-md">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 bg-background rounded px-2 py-1 text-xs"
                    >
                      <Paperclip size={12} />
                      <span className="truncate max-w-[120px]">
                        {file.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-1">
                <Input
                  id="message"
                  name="message"
                  placeholder="Envie uma mensagem"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={sending}
                />

                <div className="flex items-center gap-1">
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                    multiple
                  />

                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleFileButtonClick}
                    disabled={sending}
                  >
                    <Paperclip />
                  </Button>

                  <Button
                    type="submit"
                    size="icon"
                    disabled={
                      sending || (!message.trim() && files.length === 0)
                    }
                  >
                    {sending ? (
                      <span className="animate-spin">⏳</span>
                    ) : (
                      <Send />
                    )}
                  </Button>
                </div>
              </div>

              {error && <div className="text-sm text-destructive">{error}</div>}
            </form>
          )}

          {ticket.status === "CONCLUIDO" && (
            <div className="p-3 bg-neutral-50 text-muted-foreground rounded-md text-sm text-center">
              Este chamado foi concluído em{" "}
              {ticket.closedAt
                ? format(new Date(ticket.closedAt), "dd/MM/yyyy", {
                    locale: ptBR,
                  })
                : "data não disponível"}
              .
            </div>
          )}
        </div>
      </div>
    </Page>
  );
}
