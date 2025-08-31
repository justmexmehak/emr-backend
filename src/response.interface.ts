export interface ApiResponse<T = any> {
  data: T | null; // Allow null for error cases
  message: string;
  status: number; // HTTP status codes (200, 201, 400, 404, 500, etc.)
}

export interface PaginationResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
