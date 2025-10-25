export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  bio: string | null;
  createdAt: Date;
}

export interface BaseEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}
