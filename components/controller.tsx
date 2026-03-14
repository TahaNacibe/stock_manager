"use client";
import { usePasscode } from "@/context/passcode";
import {
  Archive,
  CircleDollarSign,
  Cog,
  Maximize,
  Minus,
  Package,
  X,
} from "lucide-react";
import { ReactNode } from "react";
import ButtonItem from "./buttonItem";
import { ThemeTogglerButton } from "./animate-ui/components/buttons/theme-toggler";

export default function CustomTitleBar({ children }: { children: ReactNode }) {
  const handleWindow = (action: "minimize" | "maximize" | "close") => {
    console.log("[REACT] Sending action:", action);
    // @ts-ignore
    window.electronAPI?.controlWindow(action);
  };

  const status = usePasscode((state) => state.status);
  return (
    <div>
      {/* ============ CONTROLLER BAR =============== */}
      <div
        className="z-10 w-dvw flex justify-end border-b border-(--border-color)"
        style={{ WebkitAppRegion: "drag" } as any}
      >
        {/* =============== CONTROLLER BUTTONS ============ */}
        <div
          className="w-fit flex"
          style={{ WebkitAppRegion: "no-drag" } as any}
        >
          <button
            className="controller-button px-3.5 py-2 hover:bg-gray-200/50 transition-all duration-200"
            onClick={() => handleWindow("minimize")}
          >
            <Minus size={20} />
          </button>
          <button
            className="controller-button px-3.5 py-2 hover:bg-gray-200/50 transition-all duration-200"
            onClick={() => handleWindow("maximize")}
          >
            <Maximize size={16} />
          </button>
          <button
            className="controller-button px-3.5 py-2 hover:bg-red-500/70 hover:text-white transition-all duration-200"
            onClick={() => handleWindow("close")}
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* ============ CONTROLLER BAR =============== */}
      <div className="flex">
        <div
          className="h-dvh w-14 
      border-r border-(--border-color) flex flex-col pb-10"
        >
          {status == "unlocked" && (
            <div>
              {/* ============ ACTIONS ============ */}
              <div>
                <ButtonItem
                  Icon={Package}
                  title={"stock"}
                  path={"/pages/stock/"}
                />
                <ButtonItem
                  Icon={CircleDollarSign}
                  title={"prices"}
                  path={"/pages/prices/"}
                />
                <ButtonItem
                  Icon={Archive}
                  title={"archive"}
                  path={"/pages/archive/"}
                />
                <ButtonItem
                  Icon={Cog}
                  title={"settings"}
                  path={"/pages/settings/"}
                />
              </div>
            </div>
          )}

          {/* ================== EMPTY SPACE FILLER =============== */}
          <div className="empty-panel flex-1"></div>

          {/* ================== QUICK THEME AND LANGUAGE =============== */}
          <ThemeTogglerButton
            className="flex items-center justify-center w-full cursor-pointer border-t border-(--border-color)"
            modes={["dark", "light"]}
            variant={"ghost"}
          />
        </div>
        {children}
      </div>
    </div>
  );
}
