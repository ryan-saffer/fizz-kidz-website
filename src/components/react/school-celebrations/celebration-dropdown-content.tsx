import type { GetImageResult } from "astro";
import type { ReactNode } from "react";
import { Button } from "../ui/button";
import type { CustomImage } from "@/types/types";
import { DropImage } from "../drop-image";

export function CelebrationDropdownContent({
  color,
  title,
  listItems,
  check,
  image,
}: {
  color: string;
  title: ReactNode;
  listItems: string[];
  check: GetImageResult;
  image: CustomImage;
}) {
  return (
    <div className="flex items-center">
      <div className="w-full min-[1000px]:w-1/2">
        {title}
        <div className="flex flex-col gap-2 py-8">
          {listItems.map((item) => (
            <div key={item} className="flex items-center gap-4">
              <img src={check.src} alt="check" className="w-6 md:w-10" />
              <p className="font-gotham font-medium">{item}</p>
            </div>
          ))}
        </div>
        <Button className="min-w-36" style={{ background: color }}>
          Book Now
        </Button>
      </div>
      <div className="hidden w-1/2 items-center justify-center min-[1000px]:flex">
        <DropImage
          image={image}
          color={color}
          background="white"
          className="w-[80%]"
        />
      </div>
    </div>
  );
}
