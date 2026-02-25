export interface RoomTypeDetail {
    id: number;
    name: string;
    hotel?: {
        id: number;
        name: string;
        city: string;
        country: string;
    };
    description?: string | null;
    capacity: number;
    base_price: number;
    is_active: boolean;
    updated_at: string;
    created_at: string;
}