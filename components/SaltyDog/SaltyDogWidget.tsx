"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { SaltyDogChat } from "./SaltyDogChat";

export function SaltyDogWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasBeenOpened, setHasBeenOpened] = useState(false);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    setHasBeenOpened(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, handleClose]);

  return (
    <>
      {/* Chat Panel */}
      {isOpen && (
        <>
          {/* Mobile backdrop */}
          <div
            className="fixed inset-0 bg-black/40 z-40 sm:hidden"
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* Panel — desktop: corner popup, mobile: bottom sheet */}
          <div
            className={cn(
              "fixed z-50 animate-in fade-in slide-in-from-bottom-4 duration-200",
              // Desktop
              "sm:bottom-24 sm:right-6 sm:w-80 sm:h-[480px]",
              // Mobile — bottom sheet
              "bottom-0 left-0 right-0 h-[70vh] sm:left-auto sm:h-[480px]"
            )}
          >
            <SaltyDogChat onClose={handleClose} />
          </div>
        </>
      )}

      {/* FAB Trigger */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          aria-label="Chat with SaltyDog"
          className={cn(
            "fixed bottom-6 right-6 z-50",
            "w-14 h-14 rounded-full overflow-hidden",
            "shadow-lg hover:shadow-xl transition-shadow",
            "ring-2 ring-teal/30",
            "salty-fab-pulse"
          )}
        >
          <Image
            src="/images/chatbot/SaltyDog-avatar.png"
            alt="Chat with SaltyDog"
            width={56}
            height={56}
            className="object-cover w-full h-full"
          />

          {/* Unread indicator */}
          {!hasBeenOpened && (
            <span className="absolute -top-0.5 -right-0.5 flex size-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal opacity-75" />
              <span className="relative inline-flex rounded-full size-3.5 bg-teal" />
            </span>
          )}
        </button>
      )}
    </>
  );
}
