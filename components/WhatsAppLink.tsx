"use client";

import { buildWhatsAppLink } from "@/lib/whatsappService";

interface WhatsAppLinkProps {
  phone?: string;
  message: string;
  label?: string;
}

export default function WhatsAppLink({ phone, message, label = "Send on WhatsApp" }: WhatsAppLinkProps) {
  if (!phone) return null;

  const href = buildWhatsAppLink(phone, message);

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex rounded-lg border border-emerald-300 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
    >
      {label}
    </a>
  );
}
