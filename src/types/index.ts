export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  image: string;
  capacity: number;
  registeredUsers: string[];
  totalParticipants: number;
  createdBy: string;
}

export interface Ticket {
  ticketId: string;
  eventId: string;
  userId: string;
  createdAt: string;
  status: 'active' | 'cancelled' | 'used';
  event?: {
    title: string;
    date: string;
    location: string;
    category: string;
  };
  user?: {
    fullName: string;
    username: string;
  };
}

export interface User {
  id: string;
  fullName: string;
  username: string;
  email: string;
}

export type ErrorWithMessage = {
  message: string;
  [key: string]: unknown;
};

export function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
}

export function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
  if (isErrorWithMessage(maybeError)) return maybeError;

  try {
    return {
      message: JSON.stringify(maybeError),
      error: maybeError
    };
  } catch {
    return {
      message: String(maybeError),
      error: maybeError
    };
  }
}

export function getErrorMessage(error: unknown): string {
  return toErrorWithMessage(error).message;
} 