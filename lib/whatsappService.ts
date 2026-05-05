import { FinanceType, ReceiptRecord } from "@/lib/financeTypes";

export function buildWhatsAppLink(phone: string, message: string): string {
  const normalized = normalizePhone(phone);
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${normalized}?text=${encoded}`;
}

export function getMessageTemplate(type: FinanceType, receipt: ReceiptRecord): string {
  const amount = `KES ${receipt.amount.toLocaleString("en-KE")}`;

  if (type === "tithe1" || type === "tithe2") {
    const level = type === "tithe1" ? "First Tithe" : "Second Tithe";
    return [
      "Thank you for your tithe contribution.",
      `Type: ${level}`,
      `Amount: ${amount}`,
      `Church: ${receipt.churchName}`,
      "Status: Confirmed",
      "God bless your giving.",
    ].join("\n");
  }

  if (type === "offering") {
    return [
      "Thank you for supporting the ministry.",
      "Type: Offering",
      `Amount: ${amount}`,
      `Church: ${receipt.churchName}`,
      "Status: Confirmed",
    ].join("\n");
  }

  if (type === "donation") {
    return [
      "Thank you for your generous donation.",
      `Purpose: ${receipt.purpose || "General support"}`,
      `Amount: ${amount}`,
      `Church: ${receipt.churchName}`,
      "Status: Confirmed",
    ].join("\n");
  }

  return [
    "Thank you for supporting this campaign.",
    `Type: ${receipt.type}`,
    `Amount: ${amount}`,
    `Church: ${receipt.churchName}`,
    "Status: Confirmed",
  ].join("\n");
}

export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");

  if (digits.startsWith("254") && digits.length >= 12) {
    return digits;
  }

  if (digits.startsWith("0") && digits.length === 10) {
    return `254${digits.slice(1)}`;
  }

  if (digits.startsWith("7") && digits.length === 9) {
    return `254${digits}`;
  }

  return digits;
}
