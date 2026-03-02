import { useAuth } from "@/hooks/useAuth"

export default function ProfileView() {
    const { data, isLoading } = useAuth()

    if (isLoading) return <div>Loading...</div>

    if (data) return (
        <div>
            <h1>Perfil</h1>
            <p>Nombre: {data.name}</p>
            <p>Apellido: {data.lastName}</p>
            <p>Email: {data.email}</p>
        </div>
    )
}
