export type HotelDetail = {
    id: number;
    name: string;
    address: string;
    city: string;
    country: string;
    description?: string | null;

    is_active: boolean;

    manager?: {
        id: number;
        name: string;
        email?: string;
    } | null;

    images?: {
        id: number;
        url: string;
    }[];

    created_at: string;
    updated_at: string;

};
