import {
  Fragment,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "../lib/utils";
import { CelebrationCard } from "./celebration-card";
import type { CustomImage } from "@/types/types";
import type { GetImageResult } from "astro";
import { CelebrationDropdownContent } from "./celebration-dropdown-content";

const TRANSITION_DURATION_MS = 700;
const useClientLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

type CardDefinition = {
  id: number;
  content: {
    color: string;
    description: string;
    img: CustomImage;
    title: string;
  };
  dropdown: ReactNode;
};

export function CelebrationDropDownCards({
  images,
  check,
}: {
  images: { card: CustomImage; expanded: CustomImage }[];
  check: GetImageResult;
}) {
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    setIsMobile(window.innerWidth < 1000);
    const onResize = () => {
      setIsMobile(window.innerWidth < 1000);
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  const [queuedModule, setQueuedModule] = useState<number | null>(null);
  const [closingModule, setClosingModule] = useState<number | null>(null);
  const [mobileOpenModules, setMobileOpenModules] = useState<number[]>([]);
  const [mobileClosingModules, setMobileClosingModules] = useState<number[]>(
    [],
  );
  const mobileClosingTimers = useRef<Map<number, number>>(new Map());

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    return () => {
      mobileClosingTimers.current.forEach((timerId) =>
        window.clearTimeout(timerId),
      );
      mobileClosingTimers.current.clear();
    };
  }, []);

  useEffect(() => {
    if (selectedModule === null && queuedModule !== null) {
      const t = window.setTimeout(() => {
        setSelectedModule(queuedModule);
        setQueuedModule(null);
        setClosingModule(null);
      }, TRANSITION_DURATION_MS);
      return () => window.clearTimeout(t);
    }
  }, [selectedModule, queuedModule]);

  useEffect(() => {
    if (
      closingModule !== null &&
      selectedModule === null &&
      queuedModule === null
    ) {
      const t = window.setTimeout(() => {
        setClosingModule(null);
      }, TRANSITION_DURATION_MS);
      return () => window.clearTimeout(t);
    }
  }, [closingModule, selectedModule, queuedModule]);

  useEffect(() => {
    if (isMobile) {
      setSelectedModule(null);
      setQueuedModule(null);
      setClosingModule(null);
      return;
    }

    setMobileOpenModules([]);
    setMobileClosingModules([]);
    if (typeof window !== "undefined") {
      mobileClosingTimers.current.forEach((timerId) =>
        window.clearTimeout(timerId),
      );
      mobileClosingTimers.current.clear();
    }
  }, [isMobile]);

  const handleModuleClicked = (newModule: number) => {
    if (isMobile) {
      if (mobileOpenModules.includes(newModule)) {
        setMobileOpenModules((prev) => prev.filter((id) => id !== newModule));
        setMobileClosingModules((prev) =>
          prev.includes(newModule) ? prev : [...prev, newModule],
        );

        if (typeof window !== "undefined") {
          const existingTimer = mobileClosingTimers.current.get(newModule);
          if (existingTimer) {
            window.clearTimeout(existingTimer);
          }
          const timerId = window.setTimeout(() => {
            setMobileClosingModules((prev) =>
              prev.filter((id) => id !== newModule),
            );
            mobileClosingTimers.current.delete(newModule);
          }, TRANSITION_DURATION_MS);
          mobileClosingTimers.current.set(newModule, timerId);
        }
        return;
      }

      if (mobileClosingModules.includes(newModule)) {
        setMobileClosingModules((prev) =>
          prev.filter((id) => id !== newModule),
        );
        if (typeof window !== "undefined") {
          const existingTimer = mobileClosingTimers.current.get(newModule);
          if (existingTimer) {
            window.clearTimeout(existingTimer);
            mobileClosingTimers.current.delete(newModule);
          }
        }
        setMobileOpenModules((prev) =>
          prev.includes(newModule) ? prev : [...prev, newModule],
        );
        return;
      }

      setMobileOpenModules((prev) =>
        prev.includes(newModule) ? prev : [...prev, newModule],
      );
      return;
    }

    if (selectedModule === newModule) {
      setClosingModule(newModule);
      setSelectedModule(null);
      setQueuedModule(null);
      return;
    }

    if (selectedModule === null && closingModule === newModule) {
      setClosingModule(null);
      setSelectedModule(newModule);
      return;
    }

    if (selectedModule === null && queuedModule !== null) {
      setQueuedModule(newModule);
      return;
    }

    if (selectedModule === null) {
      setSelectedModule(newModule);
      return;
    }

    if (isMobile) {
      setSelectedModule(newModule);
    } else {
      setClosingModule(selectedModule);
      setQueuedModule(newModule);
      setSelectedModule(null);
    }
  };

  const activeModuleDesktop = isMobile ? null : selectedModule ?? closingModule;
  const mobileOpenSet = useMemo(
    () => new Set(mobileOpenModules),
    [mobileOpenModules],
  );
  const mobileClosingSet = useMemo(
    () => new Set(mobileClosingModules),
    [mobileClosingModules],
  );

  const cards = useMemo<CardDefinition[]>(
    () => [
      {
        id: 1,
        content: {
          title: "End of term parties",
          description:
            "Fizz Kidz end of term parties bring the whole grade together for a hands-on experience, where kids create two exciting Fizz Kidz creations, dance, and have loads of fun!",
          color: "#F6BA34",
          img: images[0].card,
        },
        dropdown: (
          <CelebrationDropdownContent
            color="#F6BA34"
            title={
              <p className="font-lilita text-5xl uppercase">
                End of term <span className="text-[#F6BA34]">parties</span>
              </p>
            }
            listItems={[
              "Book a 1 hour and 1.5 hour party",
              "Enjoy two fantastic Fizz Kidz hosts",
              "Each child makes two awesome creations",
              "Dancing and party games",
              "Take home creation bags",
              "Online parent payment system (optional)",
            ]}
            check={check}
            image={images[0].expanded}
          />
        ),
      },
      {
        id: 2,
        content: {
          title: "Graduation Celebrations",
          description:
            "Filled with high-energy, hands-on activities, our parties are known and loved by kids! ",
          color: "#4FE16D",
          img: images[0].card,
        },
        dropdown: (
          <CelebrationDropdownContent
            color="#4FE16D"
            title={
              <p className="font-lilita text-5xl uppercase">
                Gradutation <span className="text-[#4FE16D]">Celebrations</span>
              </p>
            }
            listItems={[
              "Book a 1 hour and 1.5 hour party",
              "Enjoy two fantastic Fizz Kidz hosts",
              "Each child makes two awesome creations",
              "Dancing and party games",
              "Take home creation bags",
              "Online parent payment system (optional)",
            ]}
            check={check}
            image={images[0].expanded}
          />
        ),
      },
      {
        id: 3,
        content: {
          title: "Science Week",
          description:
            "Filled with high-energy, hands-on activities, our parties are known and loved by kids!",
          color: "#F14EA1",
          img: images[0].card,
        },
        dropdown: (
          <CelebrationDropdownContent
            color="#F14EA1"
            title={
              <p className="font-lilita text-5xl uppercase">
                Science <span className="text-[#F14EA1]">Week</span>
              </p>
            }
            listItems={[
              "Book a 1 hour and 1.5 hour party",
              "Enjoy two fantastic Fizz Kidz hosts",
              "Each child makes two awesome creations",
              "Dancing and party games",
              "Take home creation bags",
              "Online parent payment system (optional)",
            ]}
            check={check}
            image={images[0].expanded}
          />
        ),
      },
      {
        id: 4,
        content: {
          title: "Harmony Day",
          description:
            "Filled with high-energy, hands-on activities, our parties are known and loved by kids!",
          color: "#8F44E1",
          img: images[0].card,
        },
        dropdown: (
          <CelebrationDropdownContent
            color="#8F44E1"
            title={
              <p className="font-lilita text-5xl uppercase">
                Harmony <span className="text-[#8F44E1]">Day</span>
              </p>
            }
            listItems={[
              "Book a 1 hour and 1.5 hour party",
              "Enjoy two fantastic Fizz Kidz hosts",
              "Each child makes two awesome creations",
              "Dancing and party games",
              "Take home creation bags",
              "Online parent payment system (optional)",
            ]}
            check={check}
            image={images[0].expanded}
          />
        ),
      },
      {
        id: 5,
        content: {
          title: "Parent / Child Experiences",
          description:
            "Filled with high-energy, hands-on activities, our parties are known and loved by kids!",
          color: "#E1824F",
          img: images[0].card,
        },
        dropdown: (
          <CelebrationDropdownContent
            color="#E1824F"
            title={
              <p className="font-lilita text-5xl uppercase">
                Parent / Child{" "}
                <span className="text-[#E1824F]">Experiences</span>
              </p>
            }
            listItems={[
              "Book a 1 hour and 1.5 hour party",
              "Enjoy two fantastic Fizz Kidz hosts",
              "Each child makes two awesome creations",
              "Dancing and party games",
              "Take home creation bags",
              "Online parent payment system (optional)",
            ]}
            check={check}
            image={images[0].expanded}
          />
        ),
      },
      {
        id: 6,
        content: {
          title: "School Fundraisers",
          description:
            "Filled with high-energy, hands-on activities, our parties are known and loved by kids!",
          color: "#45D3F3",
          img: images[0].card,
        },
        dropdown: (
          <CelebrationDropdownContent
            color="#45D3F3"
            title={
              <p className="font-lilita text-5xl uppercase">
                School <span className="text-[#45D3F3]">Fundraisers</span>
              </p>
            }
            listItems={[
              "Book a 1 hour and 1.5 hour party",
              "Enjoy two fantastic Fizz Kidz hosts",
              "Each child makes two awesome creations",
              "Dancing and party games",
              "Take home creation bags",
              "Online parent payment system (optional)",
            ]}
            check={check}
            image={images[0].expanded}
          />
        ),
      },
    ],
    [images, check],
  );

  const columns = isMobile ? 1 : 3;
  const rows = useMemo(() => {
    const chunked: CardDefinition[][] = [];
    for (let i = 0; i < cards.length; i += columns) {
      chunked.push(cards.slice(i, i + columns));
    }
    return chunked;
  }, [cards, columns]);

  return (
    <div
      className={cn("mb-16 grid gap-8", {
        "grid-cols-1": isMobile,
        "grid-cols-3": !isMobile,
      })}
    >
      {rows.map((row, rowIndex) => {
        const rowIds = row.map((card) => card.id);
        const rowHasDesktopActive =
          activeModuleDesktop !== null && rowIds.includes(activeModuleDesktop);
        const rowHasDesktopSelected =
          selectedModule !== null && rowIds.includes(selectedModule);
        const desktopActiveCard = row.find(
          (card) => card.id === activeModuleDesktop,
        );

        const rowHasMobileExpanded = row.some((card) =>
          mobileOpenSet.has(card.id),
        );
        const rowHasMobileActive = row.some(
          (card) => mobileOpenSet.has(card.id) || mobileClosingSet.has(card.id),
        );
        const mobileActiveCard = row.find(
          (card) => mobileOpenSet.has(card.id) || mobileClosingSet.has(card.id),
        );

        const panelActive =
          (!isMobile && rowHasDesktopActive) ||
          (isMobile && rowHasMobileActive);
        const panelExpanded =
          (!isMobile && rowHasDesktopSelected) ||
          (isMobile && rowHasMobileExpanded);
        const activeCard = desktopActiveCard ?? mobileActiveCard ?? null;

        return (
          <Fragment key={`row-${rowIndex}`}>
            {row.map((card) => {
              const isSelected = isMobile
                ? mobileOpenSet.has(card.id)
                : selectedModule === card.id;
              const isQueued = isMobile
                ? mobileClosingSet.has(card.id)
                : queuedModule === card.id;

              return (
                <CelebrationCard
                  key={card.id}
                  selected={isSelected}
                  queued={isQueued}
                  content={card.content}
                  onClick={() => handleModuleClicked(card.id)}
                />
              );
            })}
            <CelebrationDropdownPanel
              key={`panel-${rowIndex}`}
              active={panelActive}
              expanded={panelExpanded}
            >
              {activeCard?.dropdown ?? null}
            </CelebrationDropdownPanel>
          </Fragment>
        );
      })}
    </div>
  );
}

function CelebrationDropdownPanel({
  active,
  expanded,
  children,
}: {
  active: boolean;
  expanded: boolean;
  children: ReactNode | null;
}) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [maxHeight, setMaxHeight] = useState("0px");

  useClientLayoutEffect(() => {
    if (!contentRef.current) {
      return;
    }

    if (!active) {
      setMaxHeight("0px");
      return;
    }

    if (expanded) {
      setMaxHeight(`${contentRef.current.scrollHeight}px`);
    } else {
      setMaxHeight("0px");
    }
  }, [active, expanded, children]);

  useEffect(() => {
    if (
      typeof ResizeObserver === "undefined" ||
      !active ||
      !contentRef.current
    ) {
      return;
    }

    const el = contentRef.current;
    const observer = new ResizeObserver(() => {
      if (expanded) {
        setMaxHeight(`${el.scrollHeight}px`);
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [active, expanded]);

  return (
    <div
      className="col-span-full overflow-hidden transition-[margin-top,max-height] duration-700 ease-in-out"
      style={{
        gridColumn: "1 / -1",
        marginTop: expanded ? "2rem" : "0px",
        maxHeight: active ? maxHeight : "0px",
      }}
      aria-hidden={!active}
    >
      <div ref={contentRef}>{children}</div>
    </div>
  );
}
