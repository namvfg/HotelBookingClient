export function getRoleBadge(role: string) {
    switch (role) {
        case "admin":
            return "bg-red-100 text-red-700 ring-red-200";
        case "staff":
            return "bg-blue-100 text-blue-700 ring-blue-200";
        case "manager":
            return "bg-purple-100 text-purple-700 ring-purple-200";
        case "user":
        default:
            return "bg-slate-100 text-slate-700 ring-slate-200";
    }
}