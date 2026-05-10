"use client";

import { useMemo, useState } from "react";

import FinanceCategoriesView from "@/app/admin/finance/login/dashboard/categories";
import FinanceDashboardView from "@/app/admin/finance/login/dashboard/dashboard";
import FinanceNotificationsView from "@/app/admin/finance/login/dashboard/notifications";
import FinancePaymentMethodsView from "@/app/admin/finance/login/dashboard/payment-methods";
import FinanceReceiptsView from "@/app/admin/finance/login/dashboard/receipts";
import FinanceReportsView from "@/app/admin/finance/login/dashboard/reports";
import FinanceStructureView from "@/app/admin/finance/login/dashboard/structure";
import FinanceTransactionsView from "@/app/admin/finance/login/dashboard/transactions";
import { useFinanceNotifications } from "@/hooks/useFinanceNotifications";

type TabKey =
  | "dashboard"
  | "structure"
  | "transactions"
  | "categories"
  | "payments"
  | "notifications"
  | "receipts"
  | "reports";

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: "dashboard", label: "Dashboard" },
  { key: "structure", label: "Structure" },
  { key: "transactions", label: "Transactions" },
  { key: "categories", label: "Categories" },
  { key: "payments", label: "Payment Methods" },
  { key: "receipts", label: "Receipts" },
  { key: "reports", label: "Reports" },
  { key: "notifications", label: "🔕" },
  
];

export default function AdminFinancePage() {
  const [activeTab, setActiveTab] = useState<TabKey>("dashboard");
  const { unreadCount } = useFinanceNotifications();

  const tabContent = useMemo(() => {
    switch (activeTab) {
      case "dashboard":
        return <FinanceDashboardView />;
      case "structure":
        return <FinanceStructureView />;
      case "transactions":
        return <FinanceTransactionsView />;
      case "categories":
        return <FinanceCategoriesView />;
      case "payments":
        return <FinancePaymentMethodsView />;
      case "notifications":
        return <FinanceNotificationsView />;
      case "receipts":
        return <FinanceReceiptsView />;
      case "reports":
        return <FinanceReportsView />;
      default:
        return null;
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-5">
        <header className="rounded-2xl bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">Church Financial Operating System</h1>
          <p className="mt-2 text-sm text-slate-600">
            Multi-tenant real-time finance ERP for conferences, regions, and churches.
          </p>
        </header>

        <nav className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-3">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                activeTab === tab.key
                  ? "bg-slate-900 text-white"
                  : "border border-slate-300 text-slate-700 hover:bg-slate-100"
              }`}
            >
              {tab.label}
              {tab.key === "notifications" && unreadCount > 0 && (
                <span className="ml-2 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </nav>

        {tabContent}
      </div>
    </div>
  );
}
