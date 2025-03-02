import { Button } from "../ui/button";
import type { HTMLAttributes } from "react";
import { cn } from "../lib/utils";
import newSvg from "@/assets/svg/new.svg";

function NavigationMenuItemDesktop({
  path,
  title,
  showNewBadge = false,
  className = "",
}: {
  path: string;
  title: string;
  showNewBadge?: boolean;
  className?: HTMLAttributes<any>["className"];
}) {
  return (
    <Button
      variant="link"
      className={cn(
        "text-md group relative justify-start p-0 font-gotham hover:no-underline",
        className,
      )}
    >
      <a
        href={path}
        className="w-full p-3 text-start decoration-[#B14795] decoration-2 underline-offset-4 group-hover:underline"
      >
        {title}
      </a>
      {showNewBadge && (
        <img
          src={newSvg.src}
          className="absolute left-40 top-1/2 h-9 w-9 -translate-y-1/2"
        />
      )}
    </Button>
  );
}

export default NavigationMenuItemDesktop;
