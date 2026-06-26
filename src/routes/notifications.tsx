// ── Notifications Page ──

import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Bell, DollarSign, Receipt, Clock, Trophy, PieChart, CheckCircle, CheckCheck } from "lucide-react";

import { AppLayout } from "#/components/app-layout";
import { useApp } from "#/components/demo-data-provider";
import type { NotificationType } from "#/lib/types";

export const Route = createFileRoute("/notifications")({
  component: NotificationsPage,
});

const typeConfig: Record<NotificationType, { icon: typeof Bell; color: string }> = {
  contribution: { icon: DollarSign, color: "bg-nets-secondary/10 text-nets-secondary" },
  expense: { icon: Receipt, color: "bg-nets-primary/10 text-nets-primary" },
  reminder: { icon: Clock, color: "bg-amber-100 text-amber-600" },
  milestone: { icon: Trophy, color: "bg-emerald-100 text-emerald-600" },
  split: { icon: PieChart, color: "bg-purple-100 text-purple-600" },
  settlement: { icon: CheckCircle, color: "bg-nets-secondary/10 text-nets-secondary" },
};

function NotificationsPage() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useApp();
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AppLayout>
      {/* Header */}
      <div className="bg-nets-surface/90 sticky top-0 z-40 flex items-center px-4 py-3 backdrop-blur-md">
        <Link to="/" className="rounded-full p-2">
          <ArrowLeft className="text-nets-on-surface h-5 w-5" />
        </Link>
        <h1 className="text-nets-on-surface flex-1 text-center text-lg font-bold">Notifications</h1>
        {unreadCount > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="text-nets-secondary flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold"
          >
            <CheckCheck className="h-4 w-4" />
            Mark all read
          </button>
        )}
        {unreadCount === 0 && <div className="w-9" />}
      </div>

      <div className="px-5 pb-24">
        {unreadCount > 0 && (
          <p className="text-nets-on-surface-variant mb-4 text-sm">
            {unreadCount} unread notification{unreadCount > 1 ? "s" : ""}
          </p>
        )}

        {notifications.length === 0 ? (
          <div className="shadow-ambient-soft flex flex-col items-center rounded-2xl bg-white px-6 py-12 text-center">
            <div className="bg-nets-surface-container mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <Bell className="text-nets-tertiary h-8 w-8" />
            </div>
            <h3 className="text-nets-on-surface mb-1 text-base font-bold">No notifications</h3>
            <p className="text-nets-on-surface-variant text-sm">
              You're all caught up! Notifications will appear here.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {notifications.map((notif) => {
              const config = typeConfig[notif.type];
              const Icon = config.icon;

              return (
                <button
                  key={notif.id}
                  onClick={() => markNotificationRead(notif.id)}
                  className={`shadow-ambient-soft flex items-start gap-3 rounded-2xl p-4 text-left transition-all ${
                    !notif.read ? "bg-nets-secondary/5" : "bg-white"
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${config.color}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-nets-on-surface text-sm font-bold">{notif.title}</h3>
                      {!notif.read && <span className="bg-nets-primary mt-1 h-2 w-2 flex-shrink-0 rounded-full" />}
                    </div>
                    <p className="text-nets-on-surface-variant mt-0.5 text-xs">{notif.message}</p>
                    <span className="text-nets-tertiary mt-1 block text-[10px]">{notif.timestamp}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
