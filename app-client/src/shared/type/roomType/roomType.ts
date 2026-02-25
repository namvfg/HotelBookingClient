export interface RoomType {
    id: number;
    name: string;
    hotel_name: string | null;
    capacity: number;
    base_price: number;
    is_active: boolean;
    created_at: string;
}