"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useProducts from "@/context/products";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { usePasscode } from "@/context/passcode";

// ---------------------------------------------------------------------------
// Lock illustration
// ---------------------------------------------------------------------------

function LockIcon({ unlocking }: { unlocking: boolean }) {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      className={`transition-all duration-500 ${unlocking ? "scale-110 opacity-0" : "scale-100 opacity-100"}`}
    >
      <rect
        x="10"
        y="22"
        width="28"
        height="20"
        rx="4"
        className="fill-zinc-100 dark:fill-zinc-800 stroke-zinc-300 dark:stroke-zinc-600"
        strokeWidth="1.5"
      />
      <path
        d="M16 22V16a8 8 0 0 1 16 0v6"
        className="stroke-zinc-400 dark:stroke-zinc-500"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle
        cx="24"
        cy="32"
        r="3"
        className="fill-zinc-400 dark:fill-zinc-500"
      />
      <line
        x1="24"
        y1="35"
        x2="24"
        y2="38"
        className="stroke-zinc-400 dark:stroke-zinc-500"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <path
        d="M24 6L8 13v12c0 9 7 17 16 19 9-2 16-10 16-19V13L24 6z"
        className="fill-zinc-100 dark:fill-zinc-800 stroke-zinc-300 dark:stroke-zinc-600"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M17 24l5 5 9-9"
        className="stroke-zinc-400 dark:stroke-zinc-500"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// OTP input wrapper with error shake
// ---------------------------------------------------------------------------

function PasscodeInput({
  value,
  onChange,
  error,
  maxLength = 6,
}: {
  value: string;
  onChange: (v: string) => void;
  error: boolean;
  maxLength?: number;
}) {
  return (
    <div className={`transition-transform ${error ? "animate-shake" : ""}`}>
      <InputOTP maxLength={maxLength} value={value} onChange={onChange}>
        <InputOTPGroup>
          {Array.from({ length: maxLength }).map((_, i) => (
            <InputOTPSlot
              key={i}
              index={i}
              className={error ? "border-rose-400 dark:border-rose-500/70" : ""}
            />
          ))}
        </InputOTPGroup>
      </InputOTP>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function Home() {
  const initProducts = useProducts((state: any) => state.init);
  const { status, init, verify, setup } = usePasscode();

  const [code, setCode] = useState("");
  const [confirmCode, setConfirmCode] = useState("");
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [step, setStep] = useState<"enter" | "confirm">("enter");
  const router = useRouter();

  // Init both stores on mount
  useEffect(() => {
    init();
    initProducts();
  }, []);

  // Auto-submit verify (locked mode)
  useEffect(() => {
    if (status === "locked" && code.length === 6) {
      handleVerify();
    }
  }, [code]);

  // Advance to confirm step when enter step is full
  useEffect(() => {
    if (status === "unset" && step === "enter" && code.length === 6) {
      setStep("confirm");
    }
  }, [code]);

  // Auto-submit setup when confirm step is full
  useEffect(() => {
    if (status === "unset" && step === "confirm" && confirmCode.length === 6) {
      handleSetup();
    }
  }, [confirmCode]);

  useEffect(() => {
    if (status === "unlocked") {
      router.replace("./pages/stock/");
    }
  }, [status]);

  async function handleVerify() {
    const ok = await verify(code);
    if (!ok) {
      setError(true);
      setErrorMsg("Incorrect passcode");
      setCode("");
      setTimeout(() => setError(false), 600);
    }
  }

  async function handleSetup() {
    if (confirmCode !== code) {
      setError(true);
      setErrorMsg("Codes don't match — try again");
      setConfirmCode("");
      setStep("enter");
      setCode("");
      setTimeout(() => setError(false), 600);
      return;
    }
    await setup(code);
  }

  // ── Loading ──
  if (status === "loading") {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-700 dark:border-zinc-700 dark:border-t-zinc-300" />
      </div>
    );
  }

  // ── Unlocked — render children / redirect ──
  if (status === "unlocked") {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <ShieldIcon />
          <p className="font-mono text-xs text-zinc-400 dark:text-zinc-500">
            Redirecting into the app...
          </p>
        </div>
      </div>
    );
  }

  // ── Locked or Unset ──
  const isUnset = status === "unset";
  const heading = isUnset
    ? step === "enter"
      ? "Set a passcode"
      : "Confirm passcode"
    : "Enter passcode";

  const subtext = isUnset
    ? step === "enter"
      ? "Choose a 6-digit passcode to protect your inventory."
      : "Re-enter the same code to confirm."
    : "Enter your 6-digit passcode to continue.";

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-8 px-6">
      {/* Icon */}
      <LockIcon unlocking={false} />

      {/* Text */}
      <div className="text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
          {isUnset ? "first time setup" : "locked"}
        </p>
        <h1 className="mt-2 text-xl font-semibold tracking-tight text-zinc-800 dark:text-zinc-100">
          {heading}
        </h1>
        <p className="mt-1.5 text-sm text-zinc-400 dark:text-zinc-500">
          {subtext}
        </p>
      </div>

      {/* OTP input */}
      {isUnset && step === "confirm" ? (
        <PasscodeInput
          value={confirmCode}
          onChange={setConfirmCode}
          error={error}
        />
      ) : (
        <PasscodeInput value={code} onChange={setCode} error={error} />
      )}

      {/* Error message */}
      <p
        className={`-mt-4 font-mono text-xs text-rose-500 transition-opacity duration-300 ${
          error ? "opacity-100" : "opacity-0"
        }`}
      >
        {errorMsg || "‎"}
        {/* zero-width char keeps height */}
      </p>

      {/* Setup step indicator */}
      {isUnset && (
        <div className="flex gap-1.5">
          <div
            className={`h-1 w-6 rounded-full transition-colors ${step === "enter" ? "bg-zinc-700 dark:bg-zinc-200" : "bg-zinc-300 dark:bg-zinc-600"}`}
          />
          <div
            className={`h-1 w-6 rounded-full transition-colors ${step === "confirm" ? "bg-zinc-700 dark:bg-zinc-200" : "bg-zinc-300 dark:bg-zinc-600"}`}
          />
        </div>
      )}
    </div>
  );
}
