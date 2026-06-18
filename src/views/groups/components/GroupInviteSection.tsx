import { useState } from "react";
import { Copy, Check, Share2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

interface GroupInviteSectionProps {
  inviteCode: string;
  inviteLink: string;
}

export default function GroupInviteSection({
  inviteCode,
  inviteLink,
}: GroupInviteSectionProps) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode);
      setCopiedCode(true);
      toast.success("Código copiado");
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      toast.error("No se pudo copiar el código");
    }
  };

  const getFullLink = (): string => {
    if (inviteLink.startsWith("http")) return inviteLink;
    if (inviteLink.startsWith("/")) return `${window.location.origin}${inviteLink}`;
    // Formato tipo labanda.app/unirse/BAN4K2
    return `https://${inviteLink}`;
  };

  const handleShareOrCopyLink = async () => {
    const fullLink = getFullLink();

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Únete a mi grupo en La Banda",
          text: `Usá el código ${inviteCode} o el link para unirte.`,
          url: fullLink,
        });
        return;
      } catch (err) {
        // AbortError es cuando el usuario cancela el share sheet
        if (err instanceof Error && err.name === "AbortError") return;
        // Si falla por otro motivo, cae al fallback
      }
    }

    // Fallback: copiar al portapapeles
    try {
      await navigator.clipboard.writeText(fullLink);
      setCopiedLink(true);
      toast.success("Link copiado al portapapeles");
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      toast.error("No se pudo copiar el link");
    }
  };

  return (
    <div className="w-full bg-surface-2 border border-border rounded-xl p-4">
      <p className="text-text-muted text-xs overline mb-3">
        CÓDIGO DE INVITACIÓN
      </p>

      <div className="flex items-center gap-3 mb-4">
        <code className="flex-1 font-mono text-lg text-text-primary bg-surface border border-border rounded-md px-3 py-2 text-center tracking-widest">
          {inviteCode}
        </code>
        <Button
          variant="surface"
          size="sm"
          onClick={handleCopyCode}
          aria-label="Copiar código de invitación"
        >
          {copiedCode ? (
            <Check size={16} className="text-lime" />
          ) : (
            <Copy size={16} />
          )}
        </Button>
      </div>

      <Button
        variant="outline"
        size="md"
        className="w-full"
        onClick={handleShareOrCopyLink}
        aria-label="Compartir link de invitación"
      >
        {copiedLink ? (
          <Check size={18} className="text-lime mr-2" />
        ) : (
          <Share2 size={18} className="mr-2" />
        )}
        {copiedLink ? "Link copiado" : "Compartir link"}
      </Button>
    </div>
  );
}
