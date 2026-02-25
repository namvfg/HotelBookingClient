export interface UserDetail {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    role: "admin" | "user" | "manager";

    avatar_url: string | null;
    avatar_public_id: string | null;

    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
}