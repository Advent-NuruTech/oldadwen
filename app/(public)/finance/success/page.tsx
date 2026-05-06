import { Suspense } from "react";
import FinanceSuccessClient from "@/components/public/FinanceSuccessClient";
import Head from "next/head";

export default function FinanceSuccessPage() {
  return (
    <>
      <Head>
        <title>Payment Successful | OLD SDA Organization</title>
        <meta
          name="description"
          content="Your contribution has been successfully received. Thank you for supporting OLD SDA Organization's mission."
        />
      </Head>
      <Suspense 
        fallback={
          <div className="min-h-screen bg-gradient-to-br from-[#0A0E27] via-[#0F172A] to-[#1E1B4B] flex items-center justify-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3B82F6]"></div>
              <div className="absolute inset-0 rounded-full bg-[#3B82F6] blur-xl opacity-20 animate-pulse"></div>
            </div>
          </div>
        }
      >
        <FinanceSuccessClient />
      </Suspense>
    </>
  );
}