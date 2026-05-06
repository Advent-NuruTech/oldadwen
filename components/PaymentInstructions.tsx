import { PaymentMethodRecord } from "@/lib/financeTypes";

interface PaymentInstructionsProps {
  methods: PaymentMethodRecord[];
}

export default function PaymentInstructions({ methods }: PaymentInstructionsProps) {
  return (
    <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
      <h2 className="text-xl font-bold text-emerald-900">Payment Instructions</h2>

      {methods.length === 0 ? (
        <p className="mt-2 text-sm text-emerald-900">Payment methods are being updated by finance admin. Please check back shortly.</p>
      ) : (
        <div className="mt-3 space-y-3">
          {methods.map((method) => (
            <article key={method.id} className="rounded-lg border border-emerald-300 bg-white p-3 text-sm text-emerald-900">
              <p className="font-semibold">{method.label}</p>
              {method.paybillNumber && <p>Paybill: {method.paybillNumber}</p>}
              {method.accountNumber && <p>Account: {method.accountNumber}</p>}
              {method.phoneNumber && <p>Phone: {method.phoneNumber}</p>}
            </article>
          ))}
        </div>
      )}

      <p className="mt-3 text-sm text-emerald-800">
        If you encounter issues, send directly via M-Pesa and notify the finance office.
      </p>
    </section>
  );
}
