import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getUserProfile, updateUserProfile } from "@/API/UserAPI";
import type { UpdateProfileDataType } from "@/types/user";
import { toastApiError } from "@/utils/apiError";
import { motion } from "motion/react";
import { User, Calendar, Type, ArrowLeft, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useNavigate } from "react-router";

export default function ProfileView() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { data: profile, isLoading, isError } = useQuery({
        queryKey: ['userProfile'],
        queryFn: getUserProfile,
        retry: 1,
        refetchOnWindowFocus: false,
    });

    const { register, handleSubmit, reset, formState: { errors } } = useForm<UpdateProfileDataType>({
        defaultValues: {
            name: "",
            lastName: "",
            birthdate: ""
        }
    });

    useEffect(() => {
        if (profile) {
            reset({
                name: profile.name,
                lastName: profile.lastName,
                birthdate: profile.birthdate ? new Date(profile.birthdate).toISOString().split('T')[0] : ""
            });
        }
    }, [profile, reset]);

    const { mutate, isPending } = useMutation({
        mutationFn: updateUserProfile,
        onSuccess: (data) => {
            toast.success(data || "Perfil actualizado exitosamente");
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
            queryClient.invalidateQueries({ queryKey: ['session'] });
        },
        onError: toastApiError
    });

    const onSubmit = (formData: UpdateProfileDataType) => {
        mutate(formData);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center flex-1 h-full min-h-[100dvh]">
                <Loader2 size={32} className="text-lime animate-spin mb-4" />
                <p className="text-text-secondary text-base">Cargando tu perfil...</p>
            </div>
        );
    }
    
    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center flex-1 h-full min-h-[100dvh]">
                <p className="text-error text-base mb-4">Error al cargar el perfil</p>
                <Button variant="outline" onClick={() => navigate(-1)}>Volver</Button>
            </div>
        );
    }

    return (
        <motion.div 
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="flex flex-col flex-1 pb-nav pt-5 px-4 min-h-[100dvh]"
        >
            {/* Header */}
            <header className="flex items-center gap-4 mb-8">
                <button 
                    onClick={() => navigate(-1)}
                    className="flex justify-center items-center w-10 h-10 rounded-full bg-surface-2 border border-border transition-colors hover:bg-surface-3"
                >
                    <ArrowLeft size={20} className="text-text-secondary" />
                </button>
                <h1 className="text-2xl font-display font-bold tracking-tight m-0">
                    Mi Perfil
                </h1>
            </header>

            {/* Avatar Placeholder Area */}
            <div className="flex flex-col items-center mb-8">
                <div 
                    className="w-24 h-24 rounded-full flex items-center justify-center mb-4 bg-surface-2 border-2 border-lime-border"
                >
                    <User size={40} className="text-lime" />
                </div>
                <p className="text-text-secondary font-medium font-ui">
                    {profile?.email || "usuario@ejemplo.com"}
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 flex-1">
                
                <div className="flex flex-col gap-2">
                    <Input 
                        label="NOMBRE"
                        type="text"
                        placeholder="Tu nombre"
                        icon={<Type size={20} />}
                        {...register("name", { required: "Ingresa tu nombre" })}
                        error={errors.name?.message}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <Input 
                        label="APELLIDO"
                        type="text"
                        placeholder="Tu apellido"
                        icon={<Type size={20} />}
                        {...register("lastName", { required: "Ingresa tu apellido" })}
                        error={errors.lastName?.message}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <Input 
                        label="FECHA DE NACIMIENTO"
                        type="date"
                        icon={<Calendar size={20} />}
                        {...register("birthdate")}
                        error={errors.birthdate?.message}
                        style={{
                            colorScheme: "dark" // helps native date picker use dark theme
                        }}
                    />
                </div>

                <div className="mt-auto pt-8 pb-4">
                    <Button 
                        type="submit" 
                        variant="primary" 
                        size="lg" 
                        fullWidth 
                        disabled={isPending}
                    >
                        {isPending ? "GUARDANDO..." : "GUARDAR CAMBIOS"}
                        {!isPending && <Check size={20} className="text-bg" />}
                    </Button>
                </div>
            </form>
        </motion.div>
    );
}
