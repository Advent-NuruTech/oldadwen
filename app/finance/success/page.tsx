import { Suspense } from "react";
import FinanceSuccessClient from "@/components/public/FinanceSuccessClient";

export default function FinanceSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FinanceSuccessClient />
    </Suspense>
  );
}