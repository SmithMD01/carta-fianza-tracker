"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { NavigationIcon } from "@/config/navigation";
import { navigationItems } from "@/config/navigation";

type AppShellProps = {
  children: ReactNode;
};

function NavigationIcon({ icon }: { icon: NavigationIcon }) {
  const commonProps = {
    className: "h-5 w-5 shrink-0",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    viewBox: "0 0 24 24",
  };

  if (icon === "dashboard") {
    return (
      <svg {...commonProps} aria-hidden="true">
        <rect x="4" y="4" width="6" height="6" rx="1" />
        <rect x="14" y="4" width="6" height="6" rx="1" />
        <rect x="4" y="14" width="6" height="6" rx="1" />
        <rect x="14" y="14" width="6" height="6" rx="1" />
      </svg>
    );
  }

  if (icon === "projects") {
    return (
      <svg {...commonProps} aria-hidden="true">
        <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5h3l2 2h6A2.5 2.5 0 0 1 20 9.5v7A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5z" />
      </svg>
    );
  }

  return (
    <svg {...commonProps} aria-hidden="true">
      <path d="M12 3 19 6v5c0 4.5-2.9 7.7-7 10-4.1-2.3-7-5.5-7-10V6z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        <aside
          className={`sticky top-0 hidden h-screen shrink-0 border-r border-border bg-surface transition-all duration-300 md:flex md:flex-col ${
            isCollapsed ? "w-20" : "w-56"
          }`}
        >
          <div
            className={`flex items-center border-b border-border px-3 py-4 ${
              isCollapsed ? "justify-center" : "justify-between"
            }`}
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-cyan-500 text-xs font-bold text-white shadow-sm">
                TYC
              </div>

              {!isCollapsed && (
                <div className="min-w-0">
                  <h1 className="truncate text-sm font-bold text-foreground">
                    Control Fianza
                  </h1>
                  <p className="text-xs text-muted">Gestión</p>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <button
                type="button"
                onClick={() => setIsCollapsed(true)}
                className="rounded-lg p-2 text-muted hover:bg-surface-muted hover:text-primary"
                aria-label="Contraer menú"
                title="Contraer menú"
              >
                ‹
              </button>
            )}
          </div>

          {isCollapsed && (
            <button
              type="button"
              onClick={() => setIsCollapsed(false)}
              className="mx-auto mt-4 rounded-lg p-2 text-muted hover:bg-surface-muted hover:text-primary"
              aria-label="Expandir menú"
              title="Expandir menú"
            >
              ›
            </button>
          )}

          <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto p-2.5">
            <p
              className={`mb-3 px-3 text-xs font-semibold uppercase tracking-widest text-muted ${
                isCollapsed ? "sr-only" : ""
              }`}
            >
              Gestión
            </p>

            {navigationItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={isCollapsed ? item.label : undefined}
                  className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary-soft text-primary"
                      : "text-muted hover:bg-primary-soft hover:text-primary"
                  } ${isCollapsed ? "justify-center" : ""}`}
                >
                  <NavigationIcon icon={item.icon} />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-border p-4">
            {isCollapsed ? (
              <p className="text-center text-[10px] font-medium text-muted">Local</p>
            ) : (
              <p className="text-xs text-muted">Prototipo Local</p>
            )}
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-16 items-center justify-between border-b border-border bg-surface px-6">
            <p className="text-sm text-muted">
              Sistema Gestión / <span className="font-medium text-foreground">Cartas Fianza</span>
            </p>
          </header>

          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
