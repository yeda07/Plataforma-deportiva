"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { Button } from "./button";

export type ModalProps = Readonly<{
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title: string;
}>;

export function Modal({ children, isOpen, onClose, title }: ModalProps) {
  const dialogRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    dialogRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      aria-labelledby="modal-title"
      aria-modal="true"
      className="fixed inset-0 z-50 grid place-items-center bg-background/80 p-4 backdrop-blur"
      role="dialog"
    >
      <section
        className="w-full max-w-md rounded-lg border border-border bg-card p-4 text-card-foreground shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        ref={dialogRef}
        tabIndex={-1}
      >
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-h3" id="modal-title">
            {title}
          </h2>
          <Button onClick={onClose} size="sm" variant="ghost">
            Cerrar
          </Button>
        </div>
        <div className="mt-4">{children}</div>
      </section>
    </div>
  );
}
