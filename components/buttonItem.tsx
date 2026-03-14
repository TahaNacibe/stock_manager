import { LucideIcon } from "lucide-react";
import Link from "next/link";

export default function ButtonItem({
  Icon,
  title,
  path,
}: {
  Icon: LucideIcon;
  title: string;
  path: string;
}) {
  return (
    <Link
      href={path}
      className="
      group
      border-b
      border-(--border-color)
      flex flex-col items-center justify-center
      gap-1
      py-3 px-2
      text-muted-foreground
      hover:bg-accent hover:text-accent-foreground
      transition-colors duration-200
      "
    >
      <Icon
        strokeWidth={1.5}
        className="w-5 h-5 transition-transform group-hover:scale-110"
      />

      <span className="text-xs font-medium">
        {title}
      </span>
    </Link>
  );
}