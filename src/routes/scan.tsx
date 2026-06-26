import { createFileRoute, Link } from "@tanstack/react-router";
import {
  X,
  HelpCircle,
  Zap,
  Image,
  Receipt,
  Store,
  Calendar,
  Plus,
  ArrowRight,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";

import { AppLayout } from "#/components/app-layout";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";

export const Route = createFileRoute("/scan")({
  component: OCRReceiptScan,
});

const scannedItems = [
  { name: "Mango Sticky Rice", price: 12.9, type: "item" },
  { name: "Thai Milk Tea", price: 5.5, type: "item" },
  { name: "Shibuya Toast", price: 18.9, type: "item" },
  { name: "Pad Thai", price: 14.0, type: "item" },
  { name: "Service Charge", price: 8.0, type: "fee" },
  { name: "GST", price: 7.1, type: "tax" },
];

export default function OCRReceiptScan() {
  const [merchant, setMerchant] = useState("After You Dessert Cafe");
  const [date, setDate] = useState("Oct 15, 2024");
  const [total, setTotal] = useState("66.40");
  const [items, setItems] = useState(scannedItems);

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const subtotal = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="bg-nets-surface mx-auto min-h-dvh max-w-lg">
      {/* Header */}
      <div className="bg-nets-surface/90 sticky top-0 z-40 flex items-center px-4 py-3 backdrop-blur-md">
        <button className="rounded-full p-2">
          <X className="text-nets-on-surface h-5 w-5" />
        </button>
        <h1 className="text-nets-on-surface flex-1 text-center text-lg font-bold">Scan Receipt</h1>
        <button className="rounded-full p-2">
          <HelpCircle className="text-nets-on-surface h-5 w-5" />
        </button>
      </div>

      {/* Camera View */}
      <div className="relative mx-5 mb-4 h-64 overflow-hidden rounded-2xl bg-gray-900">
        {/* Simulated receipt image */}
        <div className="absolute inset-0 flex items-center justify-center opacity-60">
          <div className="w-48 rounded bg-white p-4 text-[8px] text-gray-800 shadow-lg">
            <p className="text-center font-bold">After You Dessert Cafe</p>
            <p className="text-center text-[6px]">123 Orchard Road</p>
            <div className="my-2 border-t border-dashed border-gray-300" />
            <p>Mango Sticky Rice $12.90</p>
            <p>Thai Milk Tea x2 $5.50</p>
            <p>Shibuya Toast $18.90</p>
            <p>Pad Thai $14.00</p>
            <div className="my-1 border-t border-dashed border-gray-300" />
            <p>Service Charge $8.00</p>
            <p>GST $7.10</p>
            <div className="my-1 border-t border-dashed border-gray-300" />
            <p className="text-right font-bold">Total: $66.40</p>
          </div>
        </div>

        {/* Viewfinder corners */}
        <div className="border-nets-primary absolute top-4 left-4 h-8 w-8 border-t-2 border-l-2" />
        <div className="border-nets-primary absolute top-4 right-4 h-8 w-8 border-t-2 border-r-2" />
        <div className="border-nets-primary absolute bottom-4 left-4 h-8 w-8 border-b-2 border-l-2" />
        <div className="border-nets-primary absolute right-4 bottom-4 h-8 w-8 border-r-2 border-b-2" />

        {/* Scan line */}
        <div className="animate-scan-line bg-nets-primary absolute right-4 left-4 h-0.5 shadow-[0_0_8px_rgba(181,0,11,0.5)]" />

        {/* OCR Bounding boxes */}
        {[
          { top: "20%", left: "15%", w: "50%", h: "8%" },
          { top: "35%", left: "10%", w: "60%", h: "8%" },
          { top: "50%", left: "12%", w: "45%", h: "8%" },
          { top: "65%", left: "10%", w: "55%", h: "8%" },
          { top: "78%", left: "20%", w: "40%", h: "8%" },
        ].map((box, i) => (
          <div
            key={i}
            className="animate-pulse-box border-nets-secondary/60 bg-nets-secondary/10 absolute border"
            style={{
              top: box.top,
              left: box.left,
              width: box.w,
              height: box.h,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}

        {/* Status badge */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 backdrop-blur-sm">
          <RefreshCw className="h-3 w-3 animate-spin text-white" />
          <span className="text-xs font-medium text-white">Extracting details...</span>
        </div>

        {/* Flash & Gallery */}
        <div className="absolute right-3 bottom-3 flex gap-2">
          <button className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm">
            <Zap className="h-4 w-4" />
          </button>
          <button className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm">
            <Image className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Review Panel */}
      <div className="px-5 pb-24">
        <div className="mb-4 flex items-center gap-2">
          <div className="bg-nets-secondary/10 flex h-8 w-8 items-center justify-center rounded-lg">
            <Receipt className="text-nets-secondary h-4 w-4" />
          </div>
          <h2 className="text-nets-on-surface text-lg font-bold">Review Details</h2>
        </div>

        {/* Form Fields */}
        <div className="mb-4 space-y-3">
          <div className="border-nets-outline-variant flex items-center gap-3 border-b py-2">
            <Store className="text-nets-tertiary h-4 w-4" />
            <input
              type="text"
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              className="text-nets-on-surface flex-1 bg-transparent text-sm focus:outline-none"
            />
          </div>
          <div className="border-nets-outline-variant flex items-center gap-3 border-b py-2">
            <Calendar className="text-nets-tertiary h-4 w-4" />
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="text-nets-on-surface flex-1 bg-transparent text-sm focus:outline-none"
            />
          </div>
          <div className="border-nets-outline-variant flex items-center gap-3 border-b py-2">
            <span className="text-nets-primary text-sm font-bold">$</span>
            <input
              type="text"
              value={total}
              onChange={(e) => setTotal(e.target.value)}
              className="text-nets-on-surface flex-1 bg-transparent text-sm font-bold focus:outline-none"
            />
          </div>
        </div>

        {/* Scanned Items */}
        <div className="mb-4">
          <h3 className="text-nets-on-surface mb-2 text-sm font-bold">Scanned Items</h3>
          <div className="space-y-1.5">
            {items.map((item, i) => (
              <div
                key={`${item.name}-${i}`}
                className="flex items-center justify-between rounded-xl bg-white px-3 py-2.5"
              >
                <div className="flex items-center gap-2">
                  <span className="text-nets-on-surface text-sm">{item.name}</span>
                  {(item.type === "fee" || item.type === "tax") && (
                    <span className="bg-nets-surface-container-high text-nets-tertiary rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize">
                      {item.type}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-nets-on-surface text-sm font-semibold">${item.price.toFixed(2)}</span>
                  <button
                    onClick={() => removeItem(i)}
                    className="text-nets-tertiary hover:text-nets-error rounded-full p-1"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button className="text-nets-secondary mt-2 flex items-center gap-1 text-sm font-semibold">
            <Plus className="h-4 w-4" />
            Add Item
          </button>
        </div>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="border-nets-outline-variant/30 fixed right-0 bottom-0 left-0 border-t bg-white/90 p-4 backdrop-blur-lg">
        <div className="mx-auto max-w-lg">
          <Button className="bg-nets-primary shadow-ambient-soft hover:bg-nets-primary/90 h-14 w-full rounded-full text-base font-bold">
            Confirm & Continue
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
