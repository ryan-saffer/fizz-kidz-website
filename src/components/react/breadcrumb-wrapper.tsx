import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/react-ui/breadcrumb";

import { Fragment } from "react/jsx-runtime";
import NavigationMenuDropdown from "./navigation/navigation-menu-dropdown";
import { cn } from "./lib/utils";
import type { MenuLink } from "./navigation/navigation-menu";

export function BreadcrumbWrapper({
  items,
  variant = "standard",
}: {
  items: (
    | { type: "link"; title: string; path: string }
    | { type: "not-link"; title: string }
    | {
        type: "dropdown";
        title: string;
        items: Readonly<MenuLink[]>;
      }
  )[];
  variant?: "standard" | "white";
}) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem
          className={cn("text-xs min-[350px]:text-sm sm:block", {
            "hidden sm:block": items.length > 1,
            "text-white": variant === "white",
          })}
        >
          <BreadcrumbLink
            href="/"
            className={cn({ "hover:text-white": variant === "white" })}
          >
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator
          className={cn("sm:block", {
            "hidden sm:block": items.length > 1,
            "text-white": variant === "white",
          })}
        />
        {items.map((child, idx) => {
          let result;
          if (child.type === "link") {
            result = (
              <BreadcrumbItem>
                <BreadcrumbLink
                  className={cn("text-xs min-[350px]:text-sm", {
                    "text-white": variant === "white",
                  })}
                  href={child.path}
                >
                  {child.title}
                </BreadcrumbLink>
              </BreadcrumbItem>
            );
          } else if (child.type === "not-link") {
            result = (
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <span
                    className={cn("text-xs min-[350px]:text-sm", {
                      "text-white": variant === "white",
                      "hover:text-white": variant === "white",
                    })}
                  >
                    {child.title}
                  </span>
                </BreadcrumbLink>
              </BreadcrumbItem>
            );
          } else {
            // child.type === 'dropwdown'
            result = (
              <BreadcrumbItem>
                <NavigationMenuDropdown
                  title={child.title}
                  submenus={child.items}
                  delay={400}
                  isBreadcrumb
                  variant={variant}
                />
              </BreadcrumbItem>
            );
          }
          return (
            <Fragment key={idx}>
              {result}
              {idx !== items.length - 1 && (
                <BreadcrumbSeparator
                  className={cn({ "text-white": variant === "white" })}
                />
              )}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
