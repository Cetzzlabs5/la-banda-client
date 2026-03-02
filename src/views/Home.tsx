import { testAPI } from "@/API/TestAPI"
import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router"

export default function Home() {

    const { data, isLoading, error } = useQuery({
        queryKey: ['test'],
        queryFn: testAPI
    })

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Error: {error.message}</div>

    if (data) return (
        <div>
            {data}
            <Link to="/register">Register</Link>
        </div>
    )
}
