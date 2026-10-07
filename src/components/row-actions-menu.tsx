"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type RowActionsMenuProps = {
  children: ReactNode;
};

export const rowActionItemClassName = "block w-full rounded-md px-3 py-2 text-left text-xs font-medium text-foreground hover:bg-surface-muted";

export function RowActionsMenu({ children }: RowActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const closeOnOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setIsOpen(false);
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, [isOpen]);

  return (
    <div ref={menuRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-label="Abrir acciones"
        className="rounded-lg border border-border px-2.5 py-1 text-base leading-none text-muted hover:bg-surface-muted hover:text-foreground"
      >
        ⋯
      </button>
      {isOpen && (
        <div className="absolute right-0 top-full z-30 mt-2 min-w-36 rounded-lg border border-border bg-surface p-1 shadow-lg">
          {children}
        </div>
      )}
    </div>
  );
}
