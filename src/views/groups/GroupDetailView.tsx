import { useLocation, useParams, useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Users, Copy, Check, Crown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import type { Group } from "@/types/group";

interface LocationState {
  group?: Group;
}

export default function GroupDetailView() {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | undefined;
  const group = state?.group;

  const [copied, setCopied] = useState(false);

  const handleCopyInviteCode = async () => {
    if (!group?.inviteCode) return;
    try {
      await navigator.clipboard.writeText(group.inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Silently fail if clipboard is not available
    }
  };

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
          aria-label="Volver"
        >
          <ArrowLeft size={20} className="text-text-secondary" />
        </button>
        <h1 className="text-2xl font-display font-bold tracking-tight m-0">
          Grupo
        </h1>
      </header>

      {group ? (
        <div className="flex flex-col items-center gap-6">
          {/* Avatar */}
          <Avatar
            src={group.avatarUrl}
            alt={group.name}
            size="lg"
            className="border-2 border-lime-border"
          />

          {/* Name */}
          <div className="text-center">
            <h2 className="text-xl font-display font-bold text-text-primary">
              {group.name}
            </h2>
            {group.description && (
              <p className="text-text-secondary text-sm mt-1 max-w-xs">
                {group.description}
              </p>
            )}
          </div>

          {/* Type Badge */}
          <div className="flex items-center gap-2">
            <Users size={16} className="text-lime" />
            <span
              className={`px-3 py-1 rounded-full text-sm font-ui font-medium
                ${group.type === "OPEN"
                  ? "bg-lime-dim text-lime"
                  : "bg-surface-2 text-text-secondary"
                }`}
            >
              {group.type === "OPEN" ? "Abierto" : "Cerrado"}
            </span>
          </div>

          {/* Invite Code */}
          <div className="w-full max-w-sm bg-surface-2 border border-border rounded-xl p-4">
            <p className="text-text-muted text-xs overline mb-2">CÓDIGO DE INVITACIÓN</p>
            <div className="flex items-center gap-3">
              <code className="flex-1 font-mono text-lg text-text-primary bg-surface border border-border rounded-md px-3 py-2">
                {group.inviteCode}
              </code>
              <Button
                variant="surface"
                size="sm"
                onClick={handleCopyInviteCode}
                aria-label="Copiar código de invitación"
              >
                {copied ? <Check size={16} className="text-lime" /> : <Copy size={16} />}
              </Button>
            </div>
          </div>

          {/* Leader */}
          <div className="w-full max-w-sm bg-surface-2 border border-border rounded-xl p-4">
            <p className="text-text-muted text-xs overline mb-2">LÍDER DEL GRUPO</p>
            <div className="flex items-center gap-3">
              <Crown size={16} className="text-lime" />
              <span className="text-text-primary text-sm font-medium">
                {group.leader}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center flex-1 gap-4">
          <Users size={48} className="text-text-muted" />
          <p className="text-text-secondary text-base">Grupo no encontrado</p>
          <p className="text-text-muted text-sm">slug: {slug}</p>
          <Button variant="outline" size="md" onClick={() => navigate("/groups/create")}>
            Crear un grupo
          </Button>
        </div>
      )}
    </motion.div>
  );
}
