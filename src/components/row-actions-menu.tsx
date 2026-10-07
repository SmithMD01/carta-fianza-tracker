"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

type RowActionsMenuProps = {
  children: ReactNode;
};

export const rowActionItemClassName =
  "block w-full rounded-md px-3 py-2 text-left text-xs font-medium text-foreground hover:bg-surface-muted";

export function RowActionsMenu({
  children,
}: RowActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const [position, setPosition] = useState({
    top: 0,
    left: 0,
  });

  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const updatePosition = () => {
    if (!buttonRef.current) return;

    const buttonRect =
      buttonRef.current.getBoundingClientRect();

    const menuWidth = 160;
    const menuEstimatedHeight = 180;
    const spacing = 8;

    const shouldOpenUpward =
      window.innerHeight - buttonRect.bottom <
        menuEstimatedHeight &&
      buttonRect.top > menuEstimatedHeight;

    const left = Math.min(
      window.innerWidth - menuWidth - spacing,
      Math.max(
        spacing,
        buttonRect.right - menuWidth,
      ),
    );

    setOpenUpward(shouldOpenUpward);
    setPosition({
      top: shouldOpenUpward
        ? buttonRect.top - spacing
        : buttonRect.bottom + spacing,
      left,
    });
  };

  useEffect(() => {
    if (!isOpen) return;

    updatePosition();

    const closeOnOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        buttonRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }

      setIsOpen(false);
    };

    const updateOnViewportChange = () => {
      updatePosition();
    };

    document.addEventListener(
      "mousedown",
      closeOnOutsideClick,
    );

    window.addEventListener(
      "resize",
      updateOnViewportChange,
    );

    window.addEventListener(
      "scroll",
      updateOnViewportChange,
      true,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        closeOnOutsideClick,
      );

      window.removeEventListener(
        "resize",
        updateOnViewportChange,
      );

      window.removeEventListener(
        "scroll",
        updateOnViewportChange,
        true,
      );
    };
  }, [isOpen]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-label="Abrir acciones"
        className="rounded-lg border border-border px-2.5 py-1 text-base leading-none text-muted hover:bg-surface-muted hover:text-foreground"
      >
        ⋯
      </button>

      {isOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={menuRef}
            className="z-[100] min-w-40 rounded-lg border border-border bg-surface p-1 shadow-lg"
            style={{
              position: "fixed",
              top: position.top,
              left: position.left,
              transform: openUpward
                ? "translateY(-100%)"
                : undefined,
            }}
          >
            {children}
          </div>,
          document.body,
        )}
    </>
  );
}