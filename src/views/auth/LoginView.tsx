import { useForm } from "react-hook-form"
import type { LoginFormDataType } from "@/types/auth"
import { toastApiError } from "@/utils/apiError"
import { toast } from "sonner"
import { useMutation } from "@tanstack/react-query"
import { login } from "@/API/AuthAPI"
import { useNavigate } from "react-router"

export default function LoginView() {
    const navigate = useNavigate()
    const defaultValues: LoginFormDataType = {
        email: '',
        password: ''
    }

    const { register, handleSubmit } = useForm<LoginFormDataType>({ defaultValues })

    const { mutate } = useMutation({
        mutationFn: login,
        onSuccess: () => {
            toast.success('Login exitoso')
            navigate('/bar')
        },
        onError: toastApiError
    })

    const onSubmit = (data: LoginFormDataType) => mutate(data)

    return (
        <div>
            <h1>Inicia Sesión</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input type="email"
                    placeholder="Email"
                    {...register('email')} />
                <input type="password"
                    placeholder="Password"
                    {...register('password')} />
                <button type="submit">Login</button>
            </form>
        </div>
    )
}
