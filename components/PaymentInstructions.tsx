interface PaymentInstructionsProps {
  paybill: string;
  account: string;
}

export default function PaymentInstructions({ paybill, account }: PaymentInstructionsProps) {
  return (
    <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
      <h2 className="text-xl font-bold text-emerald-900">Payment Instructions</h2>
      <p className="mt-2 text-sm text-emerald-900">Paybill: {paybill}</p>
      <p className="text-sm text-emerald-900">Account: {account}</p>
      <p className="mt-3 text-sm text-emerald-800">
        If you encounter issues, send directly via M-Pesa and notify the finance office.
      </p>
    </section>
  );
}
