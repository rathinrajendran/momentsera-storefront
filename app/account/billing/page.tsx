"use client";

import { CreditCard, Receipt, ShieldCheck, Crown } from "lucide-react";

import { Header } from "../../(marketing)/components/header/Header";
import AccountHeader from "../components/AccountHeader";
import AccountFooter from "../components/AccountFooter";

import { H2 } from "../../../components/ui/H2";
import { H6 } from "../../../components/ui/H6";
import { Para } from "../../../components/ui/Para";
import Heading from "../../../components/ui/Heading";
import { BorderFrame } from "../../../components/ui/BorderFrame";

const invoices = [
  {
    id: "INV-2026-001",
    date: "18 Jul 2026",
    amount: "₹999",
    status: "Paid",
  },
  {
    id: "INV-2025-001",
    date: "18 Jul 2025",
    amount: "₹999",
    status: "Paid",
  },
];

export default function BillingPage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <Header />
      <BorderFrame/>
      <section className="mx-auto max-w-[1800px] px-[5vw] py-30">
        <Heading
          label="Account"
          title="Billing & Subscription"
          desc="Manage your subscription, payment methods, invoices and billing information."
        />
        {/* Current Plan */}
        <div className="space-y-10">
          <div className="rounded-[32px] border bg-white p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <Crown className="h-5 w-5 text-[var(--accent-primary)]" />

                  <span className="text-xs font-bold tracking-[0.3em] uppercase">Current Plan</span>
                </div>

                <h3 className="text-4xl font-bold">Premium Creator</h3>

                <p className="mt-2 text-[var(--text-secondary)]">₹999 / year</p>

                <p className="mt-4 text-sm text-[var(--text-secondary)]">Renews on 18 July 2027</p>
              </div>

              <div className="flex gap-3">
                <button className="rounded-full bg-black px-6 py-3 text-white">Upgrade</button>

                <button className="rounded-full border px-6 py-3">Manage</button>
              </div>
            </div>
          </div>

          {/* Usage */}

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-[28px] border bg-white p-8">
              <p className="text-sm text-[var(--text-secondary)]">Invitations</p>

              <h3 className="mt-3 text-4xl font-bold">24</h3>
            </div>

            <div className="rounded-[28px] border bg-white p-8">
              <p className="text-sm text-[var(--text-secondary)]">Published</p>

              <h3 className="mt-3 text-4xl font-bold">18</h3>
            </div>

            <div className="rounded-[28px] border bg-white p-8">
              <p className="text-sm text-[var(--text-secondary)]">Total Views</p>

              <h3 className="mt-3 text-4xl font-bold">12.5K</h3>
            </div>
          </div>

          {/* Payment Method */}

          <div className="mt-8 rounded-[32px] border bg-white p-8">
            <div className="mb-6 flex items-center gap-3">
              <CreditCard className="h-5 w-5" />

              <h3 className="text-xl font-semibold">Payment Method</h3>
            </div>

            <div className="flex items-center justify-between rounded-2xl bg-neutral-50 p-6">
              <div>
                <p className="font-medium">Visa ending in 4582</p>

                <p className="text-sm text-[var(--text-secondary)]">Expires 12/28</p>
              </div>

              <button className="rounded-full border px-5 py-2 text-sm">Update</button>
            </div>
          </div>

          {/* Billing History */}

          <div className="mt-8 rounded-[32px] border bg-white p-8">
            <div className="mb-6 flex items-center gap-3">
              <Receipt className="h-5 w-5" />

              <h3 className="text-xl font-semibold">Billing History</h3>
            </div>

            <div className="space-y-3">
              {invoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between rounded-2xl border p-5">
                  <div>
                    <p className="font-medium">{invoice.id}</p>

                    <p className="text-sm text-[var(--text-secondary)]">{invoice.date}</p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold">{invoice.amount}</p>

                    <span className="text-sm text-green-600">{invoice.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Support */}

          <div className="mt-8 rounded-[32px] border bg-white p-8">
            <div className="mb-4 flex items-center gap-3">
              <ShieldCheck className="h-5 w-5" />

              <h3 className="text-xl font-semibold">Need Help?</h3>
            </div>

            <Para>Contact our support team for billing, invoices or subscription assistance.</Para>

            <button className="mt-6 rounded-full bg-black px-6 py-3 text-white">Contact Support</button>
          </div>
        </div>
      </section>
      <AccountHeader />
      <AccountFooter />
    </main>
  );
}
