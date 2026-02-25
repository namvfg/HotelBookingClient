export interface RoomDetail {
    id: number;
    room_code: string;
    hotel?: {
        id: number;
        name: string;
        city: string;
        country: string;
    };
    room_type?: {
        id: number;
        name: string;
        base_price: number;
        capacity: number;
    };

    images?: {
        id: number;
        url: string;
    }[];
    created_at: string;
    updated_at: string;
}