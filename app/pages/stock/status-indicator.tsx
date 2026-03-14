export function StatusIndicator({ quantity }: { quantity: number }) {
  const soldOut = quantity <= 0

  return (
    <div
      className={`px-3 py-1 text-xs rounded-full font-medium w-fit
      ${
        soldOut
          ? "bg-red-500/10 text-red-500 border border-red-600"
          : "bg-green-500/10 text-green-500 border border-green-600"
      }`}
    >
      {soldOut ? "Sold Out" : "In Stock"}
    </div>
  )
}