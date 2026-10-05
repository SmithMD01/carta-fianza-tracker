"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type ColumnFilterProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options?: string[];
  multiple?: boolean;
};

export function ColumnFilter({ label, value, onChange, options, multiple = false }: ColumnFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const menuWidth = 224;
    const menuHeight = options ? 250 : 160;
    const edgeGap = 8;
    const shouldOpenUp = triggerRect.bottom + menuHeight > window.innerHeight - edgeGap;
    const top = shouldOpenUp
      ? Math.max(edgeGap, triggerRect.top - menuHeight - 6)
      : triggerRect.bottom + 6;
    const left = Math.min(
      Math.max(edgeGap, triggerRect.left),
      window.innerWidth - menuWidth - edgeGap,
    );

    setPosition({ top, left });
  }, [options]);

  useEffect(() => {
    if (!isOpen) return;

    updatePosition();

    const handleOutsideClick = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    const handleViewportChange = () => updatePosition();

    document.addEventListener("pointerdown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("scroll", handleViewportChange, true);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange, true);
    };
  }, [isOpen, updatePosition]);

  return (
    <div ref={containerRef} className="relative ml-1 inline-block align-middle">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        className={`list-none cursor-pointer rounded px-1 text-[10px] transition-colors ${
          value ? "bg-primary text-white" : "text-muted hover:bg-primary-soft hover:text-primary"
        }`}
        title={`Filtrar ${label}`}
      >
        ▾
      </button>
      {isOpen && (
      <div
        className="fixed z-[60] w-56 rounded-lg border border-border bg-surface p-3 text-left normal-case shadow-lg"
        style={{ top: position.top, left: position.left }}
        onPointerDown={(event) => event.stopPropagation()}
      >
        <p className="mb-2 text-xs font-semibold text-foreground">Filtrar {label}</p>
        {options && multiple ? (
          <div className="max-h-44 space-y-2 overflow-y-auto">
            {options.map((option) => {
              const selectedValues = value ? value.split("|") : [];
              const isSelected = selectedValues.includes(option);

              return (
                <label key={option} className="flex cursor-pointer items-center gap-2 text-xs font-normal text-foreground">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {
                      const nextValues = isSelected
                        ? selectedValues.filter((selectedValue) => selectedValue !== option)
                        : [...selectedValues, option];
                      onChange(nextValues.join("|"));
                    }}
                    className="accent-primary"
                  />
                  <span>{option}</span>
                </label>
              );
            })}
          </div>
        ) : options ? (
          <select
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="w-full rounded-md border border-border bg-surface px-2 py-1.5 text-xs font-normal text-foreground outline-none focus:border-primary"
          >
            <option value="">Todos</option>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="search"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="Escribe para filtrar..."
            className="w-full rounded-md border border-border bg-surface px-2 py-1.5 text-xs font-normal text-foreground outline-none focus:border-primary"
          />
        )}
        <button
          type="button"
          onClick={() => onChange("")}
          className="mt-2 text-xs font-medium text-primary hover:underline"
        >
          Limpiar columna
        </button>
      </div>
      )}
    </div>
  );
}
