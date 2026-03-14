"use client";
import { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";

export function Barcode({ value }: { value: string }) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (ref.current) {
      JsBarcode(ref.current, value, {
        format: "CODE128",
        width: 2,
        height: 30,
        displayValue: false,
      });
    }
  }, [value]);

  return <svg ref={ref}></svg>;
}
