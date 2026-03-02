import { Register } from "@/API/AuthAPI"
import type { Auth } from "@/types/auth"
import { toastApiError } from "@/utils/apiError"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export default function RegisterView() {
    const defaultValues: Auth = {
        name: "",
        lastName: "",
        password: "",
        confirmPassword: "",
        email: ""
    }

    const { register, handleSubmit } = useForm<Auth>({ defaultValues })

    const { mutate } = useMutation({
        mutationFn: Register,
        onError: toastApiError,
        onSuccess: (data) => {
            toast.success(data)
        }
    })

    const onSubmit = (formData: Auth) => {
        mutate(formData)
    }


    return (
        <section>

            <h1>Crea tu cuenta</h1>

            <form onSubmit={handleSubmit(onSubmit)}>
                <input type="text" placeholder="Nombre" {...register("name")} />
                <input type="text" placeholder="Apellido" {...register("lastName")} />
                <input type="email" placeholder="Email" {...register("email")} />
                <input type="password" placeholder="Password" {...register("password")} />
                <input type="password" placeholder="Confirm Password" {...register("confirmPassword")} />
                {/* <input type="date" placeholder="Fecha de nacimiento" {...register("birthdate")} /> */}
                <button type="submit">Registrarse</button>
            </form>

        </section>
    )
}
