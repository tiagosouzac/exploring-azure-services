// Tipos para usuários
export interface User {
  id: string;
  name: string;
  email: string;
  role: "CLIENTE" | "ATENDENTE";
  createdAt: string;
}

// Tipos para tickets
export type TicketStatus = "ABERTO" | "CONCLUIDO";

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  createdAt: string;
  closedAt?: string;
  userId: string;
  user: User;
  messages: Message[];
  _count?: {
    messages: number;
  };
}

// Tipos para mensagens
export interface Message {
  id: string;
  content: string;
  createdAt: string;
  ticketId: string;
  userId: string;
  user: User;
  attachments: Attachment[];
}

// Tipos para anexos
export interface Attachment {
  id: string;
  filename: string;
  path: string;
  mimetype: string;
  size: number;
  createdAt: string;
  messageId: string;
}

// Interface para respostas da API
export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}
