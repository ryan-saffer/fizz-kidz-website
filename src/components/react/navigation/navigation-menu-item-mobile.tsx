import { cn } from "../lib/utils";
import newSvg from "../../../assets/svg/new.svg";

function NavigationMenuItemMobile({
  title,
  path,
  nested,
  italic = false,
  showNewBadge = false,
}: {
  title: string;
  path: string;
  nested: boolean;
  italic?: boolean;
  showNewBadge?: boolean;
}) {
  return (
    <div
      className={cn("relative border-b px-12 py-4", {
        "border-0 px-4": nested,
      })}
    >
      <a
        href={path}
        className={cn("block w-full font-medium hover:underline", {
          italic: italic,
        })}
      >
        {title}
      </a>
      {showNewBadge && (
        <img
          src={newSvg.src}
          className="absolute left-40 top-1/2 h-9 w-9 -translate-y-1/2"
        />
      )}
    </div>
  );
}

export default NavigationMenuItemMobile;
