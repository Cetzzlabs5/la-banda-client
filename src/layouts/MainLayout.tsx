import { useAuth } from "@/hooks/useAuth";
import { Outlet, Navigate } from "react-router";

export default function MainLayout() {
    const { data, isLoading } = useAuth()

    if (isLoading) return <div>Loading...</div>

    if (!data) return <Navigate to="/login" />

    return (
        <div>
            <Outlet />
        </div>
    )
}
