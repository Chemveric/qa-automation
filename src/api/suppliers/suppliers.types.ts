export interface SuppliersSearchRequest {
  query?: string;
  filters?: {
    productTypes?: string[];
  };
  limit?: number;
  nextCursor?: string;
  beforeCursor?: string;
  sortField?: string;
  sortDir?: string;
}
