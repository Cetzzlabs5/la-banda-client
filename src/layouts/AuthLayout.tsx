import { useAuth } from "@/hooks/useAuth";
import { Outlet, Navigate } from "react-router";

export default function AuthLayout() {
    const { data, isLoading, isProfileComplete } = useAuth()

    if (isLoading) return <div>Loading...</div>

    if (data) return <Navigate to={isProfileComplete ? '/' : '/onboarding'} />

    return (
        <main className="flex min-h-screen items-center justify-center">
            <Outlet />
        </main>
    )
}
