// ── Invite Contacts Page ──

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, UserPlus, Check, Copy, Share2 } from "lucide-react";
import { useState } from "react";

import { AppLayout } from "#/components/app-layout";
import { useApp } from "#/components/demo-data-provider";
import { Avatar, AvatarFallback } from "#/components/ui/avatar";
import { Button } from "#/components/ui/button";
import { CONTACTS } from "#/lib/demo-data";

export const Route = createFileRoute("/trips/$tripId/invite")({
  component: InviteContacts,
});

function InviteContacts() {
  const { tripId } = Route.useParams();
  const navigate = useNavigate();
  const { getTrip, addMembers } = useApp();
  const trip = getTrip(tripId);

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);

  if (!trip) {
    return (
      <AppLayout>
        <div className="flex h-dvh flex-col items-center justify-center px-6 text-center">
          <p className="text-nets-on-surface-variant text-sm">Trip not found.</p>
          <Link to="/" className="text-nets-secondary mt-2 text-sm font-semibold">
            Go back home
          </Link>
        </div>
      </AppLayout>
    );
  }

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleCopyLink = async () => {
    await navigator.clipboard?.writeText(`${window.location.origin}/trips/${tripId}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInvite = () => {
    addMembers(tripId, Array.from(selected));
    navigate({ to: "/trips/$tripId", params: { tripId } });
  };

  return (
    <div className="bg-nets-surface mx-auto min-h-dvh max-w-lg">
      {/* Header */}
      <div className="bg-nets-surface/90 sticky top-0 z-40 flex items-center px-4 py-3 backdrop-blur-md">
        <button onClick={() => navigate({ to: "/trips/$tripId", params: { tripId } })} className="rounded-full p-2">
          <ArrowLeft className="text-nets-on-surface h-5 w-5" />
        </button>
        <h1 className="text-nets-on-surface flex-1 text-center text-lg font-bold">Invite Friends</h1>
        <div className="w-9" />
      </div>

      <div className="space-y-5 px-5 pb-24">
        {/* Share Link */}
        <div className="shadow-ambient-soft rounded-2xl bg-white p-4">
          <div className="mb-3 flex items-center gap-2">
            <Share2 className="text-nets-secondary h-5 w-5" />
            <span className="text-nets-on-surface text-sm font-semibold">Share invite link</span>
          </div>
          <div className="bg-nets-surface-container-low flex items-center gap-2 rounded-xl p-3">
            <span className="text-nets-on-surface-variant flex-1 truncate text-xs">
              netsbiscuit.app/invite/{tripId}
            </span>
            <button
              onClick={handleCopyLink}
              className="bg-nets-secondary/10 text-nets-secondary flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>

        {/* Contacts */}
        <div>
          <h3 className="text-nets-on-surface mb-3 text-sm font-semibold">Choose friends to invite</h3>
          <div className="flex flex-col gap-2">
            {CONTACTS.map((contact) => {
              const isSelected = selected.has(contact.id);
              return (
                <button
                  key={contact.id}
                  onClick={() => toggle(contact.id)}
                  className={`flex items-center gap-3 rounded-2xl p-3 transition-all ${
                    isSelected ? "bg-nets-secondary/10 ring-nets-secondary ring-2" : "shadow-ambient-soft bg-white"
                  }`}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-nets-surface-container text-nets-on-surface text-sm font-semibold">
                      {contact.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-nets-on-surface flex-1 text-left text-sm font-semibold">{contact.name}</span>
                  {isSelected && (
                    <div className="bg-nets-secondary flex h-5 w-5 items-center justify-center rounded-full text-white">
                      <Check className="h-3 w-3" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="border-nets-outline-variant/30 fixed right-0 bottom-0 left-0 border-t bg-white/90 p-4 backdrop-blur-lg">
        <div className="mx-auto max-w-lg">
          <Button
            onClick={handleInvite}
            disabled={selected.size === 0}
            className="bg-nets-primary shadow-ambient-soft hover:bg-nets-primary/90 h-14 w-full rounded-full text-base font-bold"
          >
            <UserPlus data-icon="inline-start" className="h-5 w-5" />
            {selected.size > 0 ? `Invite ${selected.size} Friend${selected.size > 1 ? "s" : ""}` : "Invite Friends"}
          </Button>
        </div>
      </div>
    </div>
  );
}
