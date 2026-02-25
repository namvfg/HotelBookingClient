export type UserFormState = {
    name: string;
    email: string;
    phone: string;
    role: "admin" | "user" | "manager";
    password: string;
    password_confirmation: string;
};