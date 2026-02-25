export interface Hotel {
    id: number;
    name: string;
    manager_name: string | null;
    city: string;
    country: string;
    is_active: boolean;
    created_at: string;
}