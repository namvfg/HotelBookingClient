export interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    avatar_url: string;
    role: "admin" | "user" | "manager";
    created_at: string;
}