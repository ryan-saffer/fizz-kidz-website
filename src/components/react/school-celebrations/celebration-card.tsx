import type { CustomImage } from "@/types/types";
import { cn } from "../lib/utils";
import { ChevronDown } from "lucide-react";
import { Button } from "../ui/button";

export function CelebrationCard({
  selected,
  queued,
  content,
  onClick,
}: {
  selected: boolean;
  queued: boolean;
  content: {
    img: CustomImage;
    title: string;
    description: string;
    color: string;
  };
  onClick: () => void;
}) {
  return (
    <div
      className="relative flex min-h-[340px] cursor-pointer flex-col rounded-xl shadow-lg transition-shadow hover:bg-gray-50"
      style={{
        ...(selected && {
          boxShadow: `0px 0px 30px 10px ${content.color}`,
        }),
        ...(queued && {
          boxShadow: `0px 0px 30px 10px ${content.color}`,
        }),
      }}
      onClick={onClick}
    >
      <div className="h-52 flex-shrink-0 overflow-hidden rounded-t-xl">
        <img
          src={content.img.image.src}
          alt={content.img.alt}
          width={500}
          className="h-full w-full rounded-t-xl object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
        />
      </div>
      <div
        slot="content"
        className="z-10 flex h-max flex-grow flex-col justify-between rounded-xl bg-white p-8 @container"
      >
        <div>
          <p className="font-lilita text-3xl uppercase">{content.title}</p>
          <p className="my-5 font-gotham">{content.description}</p>
        </div>
        <div className="mt-4 flex items-center justify-between gap-4">
          <Button
            className="max-w-60 flex-grow"
            style={{ background: content.color }}
          >
            Learn More
          </Button>
          <a className="font-lilita uppercase text-[#8F44E1] underline">
            Click to view incursions
          </a>
        </div>
      </div>
      <div
        className={cn(
          "absolute bottom-[-28px] left-0 right-0 z-10 m-auto flex h-14 w-14 transform items-center justify-center rounded-full bg-white shadow-md transition-transform duration-500",
          { "-rotate-180": selected },
        )}
        style={{
          border: `1px solid ${content.color}`,
        }}
      >
        <ChevronDown color={content.color} className="h-7 w-7" />
      </div>
    </div>
  );
}
