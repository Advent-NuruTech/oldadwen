"use client";

import { FinanceCategoryRecord } from "@/lib/financeTypes";

interface CampaignBannerProps {
  campaigns: FinanceCategoryRecord[];
}

export default function CampaignBanner({ campaigns }: CampaignBannerProps) {
  if (campaigns.length === 0) return null;

  return (
    <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xl font-bold text-amber-900">LIVE FUNDRAISING</h2>
        <span className="rounded-full bg-amber-200 px-3 py-1 text-xs font-semibold text-amber-800">
          Active Campaigns
        </span>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {campaigns.map((campaign) => (
          <article key={campaign.id} className="rounded-xl border border-amber-300 bg-white p-4">
            <h3 className="text-base font-semibold text-slate-900">{campaign.title}</h3>
            {campaign.description && <p className="mt-1 text-sm text-slate-600">{campaign.description}</p>}
          </article>
        ))}
      </div>
    </section>
  );
}
