export interface QueryType {
    page?: number;
    limit?: number;
    sortBy?: 'asc' | 'desc';
    sortType?: string;
    search?: string
}