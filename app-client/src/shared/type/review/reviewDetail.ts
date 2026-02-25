export interface ReviewDetail {
    id: number;
    user?: {
        id: number;
        name: string;
        avatar_url: string;
    };
    hotel?: {
        id: number;
        name: string;
        city: string;
        country: string;
    };
    rating: number;
    comment?: string | null;
    created_at: string;
    updated_at: string;
}