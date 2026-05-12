export type FinanceType = "tithe1" | "tithe2" | "offering" | "donation" | "campaign";
export type FinanceNotificationType = FinanceType | "report_comment";
export type DonorType = "member" | "visitor";
export type TransactionStatus = "pending" | "confirmed";
export type TransactionSource = "online" | "manual";
export type NotificationStatus = "unread" | "read";

export interface ConferenceRecord {
  id: string;
  name: string;
  code: string;
  createdAt?: Date | null;
}

export interface RegionRecord {
  id: string;
  name: string;
  conferenceId: string;
  code: string;
  createdAt?: Date | null;
}

export interface ChurchRecord {
  id: string;
  name: string;
  regionId: string;
  conferenceId: string;
  code: string;
  isActive: boolean;
  createdAt?: Date | null;
}

export interface FinanceCategoryRecord {
  id: string;
  title: string;
  description?: string;
  type: FinanceType;
  isActive: boolean;
  isPublic: boolean;
  priority: number;
  createdAt?: Date | null;
}

export interface FinanceTransactionRecord {
  id: string;
  amount: number;
  type: FinanceType;
  categoryId?: string;
  purpose?: string;

  conferenceId?: string;
  regionId?: string;
  churchId?: string;

  donorType: DonorType;
  name?: string;
  phone?: string;
  email?: string;
  message?: string;

  status: TransactionStatus;
  source: TransactionSource;

  receiptId?: string;
  createdAt?: Date | null;
  confirmedAt?: Date | null;
}

export interface ReceiptRecord {
  id: string;
  transactionId: string;
  receiptNumber: string;

  donorName?: string;
  phone?: string;
  amount: number;
  type: FinanceType;
  purpose?: string;

  churchName: string;
  regionName: string;
  conferenceName: string;
  conferenceCode: string;

  messageTemplate: string;
  status: TransactionStatus;
  createdAt?: Date | null;
  confirmedAt?: Date | null;
  pdfUrl?: string;
}

export interface PaymentMethodRecord {
  id: string;
  label: string;
  paybillNumber?: string;
  accountNumber?: string;
  phoneNumber?: string;
  isActive: boolean;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export interface FinanceNotificationRecord {
  id: string;
  transactionId?: string;
  commentId?: string;
  reportId?: string;
  donorName?: string;
  actorName?: string;
  amount?: number;
  categoryId?: string;
  type: FinanceNotificationType;
  message?: string;
  status: NotificationStatus;
  createdAt?: Date | null;
  readAt?: Date | null;
}

export interface DateRange {
  start?: Date;
  end?: Date;
}

export interface FinanceSummary {
  tithe1: number;
  tithe2: number;
  offering: number;
  donation: number;
  campaign: number;
  total: number;
  confirmedCount: number;
  pendingCount: number;
  onlineTotal: number;
  manualTotal: number;
}
