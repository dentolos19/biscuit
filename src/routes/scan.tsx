import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Calendar, Image, Plus, Receipt, RefreshCw, Store, X, Zap } from "lucide-react";
import { useMemo, useState } from "react";

import { useApp } from "#/components/demo-data-provider";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";

export const Route = createFileRoute("/scan")({
  validateSearch: (search: Record<string, unknown>) => ({
    tripId: typeof search.tripId === "string" ? search.tripId : undefined,
  }),
  component: OCRReceiptScan,
});

type DraftItem = { id: string; name: string; price: string; quantity: number };

const initialItems: DraftItem[] = [
  { id: "draft-1", name: "Mango Sticky Rice", price: "12.90", quantity: 1 },
  { id: "draft-2", name: "Thai Milk Tea", price: "5.50", quantity: 1 },
  { id: "draft-3", name: "Shibuya Toast", price: "18.90", quantity: 1 },
  { id: "draft-4", name: "Pad Thai", price: "14.00", quantity: 1 },
];

function OCRReceiptScan() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const { trips, addReceipt } = useApp();
  const fallbackTrip = trips.find((trip) => trip.status === "active") ?? trips[0];
  const [tripId, setTripId] = useState(search.tripId ?? fallbackTrip?.id ?? "");
  const [merchant, setMerchant] = useState("After You Dessert Cafe");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [items, setItems] = useState(initialItems);
  const [serviceCharge, setServiceCharge] = useState("4.76");
  const [tax, setTax] = useState("4.76");
  const [error, setError] = useState("");

  const total = useMemo(
    () =>
      items.reduce((sum, item) => sum + (Number(item.price) || 0) * item.quantity, 0) +
      (Number(serviceCharge) || 0) +
      (Number(tax) || 0),
    [items, serviceCharge, tax],
  );

  const updateItem = (id: string, patch: Partial<DraftItem>) => {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const handleConfirm = () => {
    const validItems = items
      .map((item) => ({ name: item.name.trim(), price: Number(item.price), quantity: item.quantity }))
      .filter((item) => item.name && Number.isFinite(item.price) && item.price > 0);
    if (!tripId || !merchant.trim() || validItems.length === 0) {
      setError("Choose a trip and keep at least one valid receipt item.");
      return;
    }
    const receipt = addReceipt({
      tripId,
      merchantName: merchant.trim(),
      date,
      items: validItems,
      serviceCharge: Number(serviceCharge) || 0,
      tax: Number(tax) || 0,
      paidBy: "you",
      paidFrom: "wallet",
    });
    navigate({
      to: "/trips/$tripId/claim",
      params: { tripId },
      search: { receiptId: receipt.id },
    });
  };

  if (trips.length === 0) {
    return (
      <div className="bg-nets-surface mx-auto flex min-h-dvh max-w-lg flex-col items-center justify-center px-6 text-center">
        <Receipt className="text-nets-tertiary mb-3 size-10" />
        <h1 className="text-nets-on-surface text-lg font-bold">Create a trip or event first</h1>
        <p className="text-nets-on-surface-variant mt-1 text-sm">Receipts need a group plan to belong to.</p>
        <Button onClick={() => navigate({ to: "/" })} className="bg-nets-primary mt-5 rounded-full">
          Create plan
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-nets-surface mx-auto min-h-dvh max-w-lg">
      <div className="bg-nets-surface/90 sticky top-0 z-40 flex items-center px-4 py-3 backdrop-blur-md">
        <button onClick={() => navigate({ to: "/" })} className="rounded-full p-2" aria-label="Close scanner">
          <X className="text-nets-on-surface size-5" />
        </button>
        <h1 className="text-nets-on-surface flex-1 text-center text-lg font-bold">Scan Receipt</h1>
        <div className="size-9" />
      </div>

      <div className="relative mx-5 mb-4 h-60 overflow-hidden rounded-2xl bg-gray-900">
        <div className="absolute inset-0 flex items-center justify-center opacity-70">
          <div className="w-48 rounded bg-white p-4 text-[8px] text-gray-800 shadow-lg">
            <p className="text-center font-bold">{merchant}</p>
            <div className="my-2 border-t border-dashed border-gray-300" />
            {items.map((item) => (
              <p key={item.id} className="flex justify-between">
                <span>{item.name}</span>
                <span>${item.price}</span>
              </p>
            ))}
            <div className="my-1 border-t border-dashed border-gray-300" />
            <p className="text-right font-bold">Total: ${total.toFixed(2)}</p>
          </div>
        </div>
        <div className="animate-scan-line bg-nets-primary absolute right-4 left-4 h-0.5" />
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5">
          <RefreshCw className="size-3 text-white" />
          <span className="text-xs font-medium text-white">OCR complete</span>
        </div>
        <div className="absolute right-3 bottom-3 flex gap-2">
          <button
            className="flex size-9 items-center justify-center rounded-full bg-black/40 text-white"
            aria-label="Flash"
          >
            <Zap className="size-4" />
          </button>
          <button
            className="flex size-9 items-center justify-center rounded-full bg-black/40 text-white"
            aria-label="Gallery"
          >
            <Image className="size-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4 px-5 pb-28">
        <div className="flex items-center gap-2">
          <div className="bg-nets-secondary/10 flex size-8 items-center justify-center rounded-lg">
            <Receipt className="text-nets-secondary size-4" />
          </div>
          <h2 className="text-nets-on-surface text-lg font-bold">Review OCR details</h2>
        </div>

        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          Trip wallet
          <select
            value={tripId}
            onChange={(event) => setTripId(event.target.value)}
            className="border-nets-outline-variant h-11 rounded-xl border bg-white px-3 text-sm"
          >
            {trips.map((trip) => (
              <option key={trip.id} value={trip.id}>
                {trip.name}
              </option>
            ))}
          </select>
        </label>

        <div className="grid grid-cols-[1fr_150px] gap-3">
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            Merchant
            <div className="relative">
              <Store className="text-nets-tertiary absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input
                value={merchant}
                onChange={(event) => setMerchant(event.target.value)}
                className="rounded-xl bg-white pl-9"
              />
            </div>
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            Date
            <div className="relative">
              <Calendar className="text-nets-tertiary absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className="rounded-xl bg-white pl-9"
              />
            </div>
          </label>
        </div>

        <div>
          <h3 className="text-nets-on-surface mb-2 text-sm font-bold">Items</h3>
          <div className="flex flex-col gap-2">
            {items.map((item) => (
              <div key={item.id} className="grid grid-cols-[1fr_76px_32px] items-center gap-2 rounded-xl bg-white p-2">
                <Input
                  value={item.name}
                  onChange={(event) => updateItem(item.id, { name: event.target.value })}
                  aria-label="Item name"
                  className="border-0 shadow-none"
                />
                <Input
                  inputMode="decimal"
                  value={item.price}
                  onChange={(event) => updateItem(item.id, { price: event.target.value.replace(/[^0-9.]/g, "") })}
                  aria-label={`${item.name} price`}
                  className="text-right"
                />
                <button
                  onClick={() => setItems((current) => current.filter((entry) => entry.id !== item.id))}
                  className="text-nets-tertiary flex size-8 items-center justify-center"
                  aria-label={`Remove ${item.name}`}
                >
                  <X className="size-4" />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() =>
              setItems((current) => [
                ...current,
                { id: `draft-${Date.now()}`, name: "New item", price: "0.00", quantity: 1 },
              ])
            }
            className="text-nets-secondary mt-2 flex items-center gap-1 text-sm font-semibold"
          >
            <Plus className="size-4" />
            Add item
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="text-nets-on-surface-variant flex flex-col gap-1 text-xs">
            Service charge
            <Input
              value={serviceCharge}
              onChange={(event) => setServiceCharge(event.target.value)}
              inputMode="decimal"
              className="bg-white"
            />
          </label>
          <label className="text-nets-on-surface-variant flex flex-col gap-1 text-xs">
            Tax / GST
            <Input
              value={tax}
              onChange={(event) => setTax(event.target.value)}
              inputMode="decimal"
              className="bg-white"
            />
          </label>
        </div>

        <div className="shadow-ambient-soft flex items-center justify-between rounded-2xl bg-white px-4 py-3">
          <span className="text-nets-on-surface text-sm font-bold">Receipt total</span>
          <span className="text-nets-primary text-xl font-extrabold">${total.toFixed(2)}</span>
        </div>
        {error && <p className="text-nets-error rounded-xl bg-red-50 px-4 py-3 text-sm">{error}</p>}
      </div>

      <div className="border-nets-outline-variant/30 fixed right-0 bottom-0 left-0 border-t bg-white/90 p-4 backdrop-blur-lg">
        <div className="mx-auto max-w-lg">
          <Button onClick={handleConfirm} className="bg-nets-primary h-14 w-full rounded-full text-base font-bold">
            Save receipt & claim
            <ArrowRight data-icon="inline-end" />
          </Button>
        </div>
      </div>
    </div>
  );
}
