import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getUserProfile, updateUserProfile } from "@/API/UserAPI";
import type { UpdateProfileDataType } from "@/types/user";
import { toastApiError } from "@/utils/apiError";

export default function ProfileView() {
    const queryClient = useQueryClient();

    // 1. Fetching Global (Localizado aquí según requerimiento)
    const { data: profile, isLoading, isError } = useQuery({
        queryKey: ['userProfile'],
        queryFn: getUserProfile,
        retry: 1,
        refetchOnWindowFocus: false,
    });

    // 2. Definición del Formulario
    const { register, handleSubmit, reset, formState: { errors } } = useForm<UpdateProfileDataType>({
        defaultValues: {
            name: "",
            lastName: "",
            birthdate: ""
        }
    });

    // 3. Inicializar valores por defecto cuando llega la data
    useEffect(() => {
        if (profile) {
            reset({
                name: profile.name,
                lastName: profile.lastName,
                // Formateamos la fecha si existe para el input type="date"
                birthdate: profile.birthdate ? new Date(profile.birthdate).toISOString().split('T')[0] : ""
            });
        }
    }, [profile, reset]);

    // 4. Mutación para actualizar
    const { mutate, isPending } = useMutation({
        mutationFn: updateUserProfile,
        onSuccess: (data) => {
            toast.success(data);
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
            queryClient.invalidateQueries({ queryKey: ['session'] }); // Por si la sesión global usa info de profile
        },
        onError: toastApiError
    });

    const onSubmit = (formData: UpdateProfileDataType) => {
        mutate(formData);
    };

    if (isLoading) return <div className="p-8 text-center text-gray-500">Cargando perfil...</div>;
    if (isError) return <div className="p-8 text-center text-red-500">Error al cargar el perfil.</div>;

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Perfil de Usuario</h1>
                <p className="text-gray-500 mt-2">Mantén tus datos actualizados para disfrutar de todos los beneficios.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="font-semibold text-gray-700">Nombre</label>
                    <input
                        id="name"
                        type="text"
                        {...register("name")}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-shadow"
                        placeholder="Ingresa tu nombre"
                    />
                    {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="lastName" className="font-semibold text-gray-700">Apellido</label>
                    <input
                        id="lastName"
                        type="text"
                        {...register("lastName")}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-shadow"
                        placeholder="Ingresa tu apellido"
                    />
                    {errors.lastName && <span className="text-red-500 text-sm">{errors.lastName.message}</span>}
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="birthdate" className="font-semibold text-gray-700">Fecha de Nacimiento</label>
                    <input
                        id="birthdate"
                        type="date"
                        {...register("birthdate")}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-shadow"
                    />
                    {errors.birthdate && <span className="text-red-500 text-sm">{errors.birthdate.message}</span>}
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPending ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </form>
        </div>
    );
}
