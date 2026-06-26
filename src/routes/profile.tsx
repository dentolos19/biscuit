// ── Profile Page ──

import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Bell, CreditCard, Shield, HelpCircle, LogOut, ChevronRight, Award } from "lucide-react";

import { AppLayout } from "#/components/app-layout";
import { Avatar, AvatarFallback } from "#/components/ui/avatar";
import { CURRENT_USER, BADGE_DEFS } from "#/lib/demo-data";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <AppLayout>
      {/* Header */}
      <div className="bg-nets-surface/90 sticky top-0 z-40 flex items-center px-4 py-3 backdrop-blur-md">
        <Link to="/" className="rounded-full p-2">
          <ArrowLeft className="text-nets-on-surface h-5 w-5" />
        </Link>
        <h1 className="text-nets-on-surface flex-1 text-center text-lg font-bold">Profile</h1>
        <div className="w-9" />
      </div>

      <div className="px-5 pb-24">
        {/* User Card */}
        <div className="shadow-ambient-soft relative overflow-hidden rounded-3xl bg-white p-5">
          <div className="bg-nets-primary/5 absolute -top-8 -right-8 h-32 w-32 rounded-full blur-2xl" />
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-nets-primary text-xl font-bold text-white">
                {CURRENT_USER.name[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-nets-on-surface text-xl font-extrabold">{CURRENT_USER.name}</h2>
              <p className="text-nets-on-surface-variant text-sm">{CURRENT_USER.email}</p>
              <p className="text-nets-tertiary text-xs">Member since {CURRENT_USER.joinDate}</p>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="mt-5">
          <h3 className="text-nets-on-surface mb-3 text-base font-bold">Badges</h3>
          {CURRENT_USER.badges.length === 0 ? (
            <div className="shadow-ambient-soft flex flex-col items-center rounded-2xl bg-white px-4 py-8 text-center">
              <Award className="text-nets-tertiary mb-2 h-8 w-8" />
              <p className="text-nets-on-surface-variant text-sm">No badges yet</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {CURRENT_USER.badges.map((badge) => {
                const def = BADGE_DEFS[badge.type];
                return (
                  <div
                    key={badge.type}
                    className="shadow-ambient-soft flex items-center gap-2 rounded-2xl bg-white px-4 py-3"
                  >
                    <span className="text-xl">{def.icon}</span>
                    <div>
                      <span className="text-nets-on-surface text-sm font-bold">{def.label}</span>
                      <p className="text-nets-on-surface-variant text-[10px]">Earned {badge.earnedAt}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Settings */}
        <div className="mt-5">
          <h3 className="text-nets-on-surface mb-3 text-base font-bold">Settings</h3>
          <div className="flex flex-col gap-2">
            <Link
              to="/notifications"
              className="shadow-ambient-soft flex items-center gap-3 rounded-2xl bg-white p-4 transition-all active:scale-[0.98]"
            >
              <div className="bg-nets-surface-container flex h-10 w-10 items-center justify-center rounded-xl">
                <Bell className="text-nets-on-surface h-5 w-5" />
              </div>
              <div className="flex-1">
                <span className="text-nets-on-surface text-sm font-semibold">Notifications</span>
                <p className="text-nets-on-surface-variant text-xs">Manage alerts and reminders</p>
              </div>
              <ChevronRight className="text-nets-tertiary h-5 w-5" />
            </Link>

            <button className="shadow-ambient-soft flex items-center gap-3 rounded-2xl bg-white p-4 text-left transition-all active:scale-[0.98]">
              <div className="bg-nets-surface-container flex h-10 w-10 items-center justify-center rounded-xl">
                <CreditCard className="text-nets-on-surface h-5 w-5" />
              </div>
              <div className="flex-1">
                <span className="text-nets-on-surface text-sm font-semibold">Payment Methods</span>
                <p className="text-nets-on-surface-variant text-xs">Manage NETS and linked accounts</p>
              </div>
              <ChevronRight className="text-nets-tertiary h-5 w-5" />
            </button>

            <button className="shadow-ambient-soft flex items-center gap-3 rounded-2xl bg-white p-4 text-left transition-all active:scale-[0.98]">
              <div className="bg-nets-surface-container flex h-10 w-10 items-center justify-center rounded-xl">
                <Shield className="text-nets-on-surface h-5 w-5" />
              </div>
              <div className="flex-1">
                <span className="text-nets-on-surface text-sm font-semibold">Security</span>
                <p className="text-nets-on-surface-variant text-xs">PIN, biometrics, and privacy</p>
              </div>
              <ChevronRight className="text-nets-tertiary h-5 w-5" />
            </button>

            <button className="shadow-ambient-soft flex items-center gap-3 rounded-2xl bg-white p-4 text-left transition-all active:scale-[0.98]">
              <div className="bg-nets-surface-container flex h-10 w-10 items-center justify-center rounded-xl">
                <HelpCircle className="text-nets-on-surface h-5 w-5" />
              </div>
              <div className="flex-1">
                <span className="text-nets-on-surface text-sm font-semibold">Help & Support</span>
                <p className="text-nets-on-surface-variant text-xs">FAQs and contact support</p>
              </div>
              <ChevronRight className="text-nets-tertiary h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Sign Out */}
        <button className="text-nets-error shadow-ambient-soft mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-3 text-sm font-semibold transition-all active:scale-[0.98]">
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </AppLayout>
  );
}
