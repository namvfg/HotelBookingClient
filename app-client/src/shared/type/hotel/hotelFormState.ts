export type HotelFormState = {
    name: string;
    address: string;
    city: string;
    country: string;
    description: string;
    manager_id?: string; // chỉ dùng khi admin
};