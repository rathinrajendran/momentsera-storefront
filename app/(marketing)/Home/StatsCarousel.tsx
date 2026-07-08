"use client";

import * as React from "react";
import { Carousel, CarouselContent, CarouselItem } from "../../../components/ui/carousel";
import { Card, CardContent } from "../../../components/ui/card";
import { cn } from "../../../utils/utils";
import Autoplay from "embla-carousel-autoplay";

const stats = [
  { value: "192k", label: "Assets under management" },
  { value: "34", label: "Unique delegators" },
  { value: "98%", label: "Success rate" },
  { value: "12", label: "Global partners" },
  { value: "65+", label: "Enterprise clients" },
  { value: "7", label: "Years experience" },
  { value: "120", label: "Templates designed" },
  { value: "5", label: "Product categories" },
  { value: "24/7", label: "Support" },
  { value: "4.9", label: "Average rating" },
];

const alignMap = ["self-start", "self-center", "self-end"] as const;

const getAlignClass = (index: number) => {
  // pattern: top, center, bottom
  return alignMap[index % 3];
};

export default function StatsCarousel() {
  const plugin = React.useRef(
    Autoplay({
      delay: 1000,
    }),
  );

  return (
    <section className="relative w-full overflow-hidden rounded-[32px]">
      <div className="relative">
        <Carousel
          plugins={[plugin.current]}
          opts={{
            align: "center",
            loop: true,
          }}
          className="w-full"
          onMouseEnter={() => plugin.current.stop()}
          onMouseLeave={() => plugin.current.play()}
        >
          {/* IMPORTANT: fixed height + stretch */}
          <CarouselContent className="-ml-4 h-[400px] items-stretch">
            {stats.map((item, index) => (
              <CarouselItem key={index} className="flex basis-[85%] pl-4 sm:basis-[55%] md:basis-[45%] lg:basis-[32%]">
                {/* Controls vertical placement */}
                <div className={cn("w-full", getAlignClass(index))}>
                  <Card className="h-[340px] overflow-hidden rounded-[34px] border-0 bg-[#0b0b0d]/95 text-white shadow-xl">
                    <CardContent className="flex h-full flex-col justify-between p-10">
                      <div>
                        <div className="text-[72px] leading-none font-semibold tracking-tight text-[#bfa7ff]">{item.value}</div>

                        <div className="mt-3 text-sm text-white/70">{item.label}</div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <div className="h-[6px] w-[6px] rounded-full bg-[#bfa7ff]" />
                          <div className="h-[1px] flex-1 bg-white/10" />
                        </div>

                        {index === 1 && (
                          <div className="mt-6 flex items-center gap-3">
                            <AvatarCircle text="C" />
                            <AvatarCircle text="X" />
                            <AvatarCircle text="A" />
                            <AvatarCircle img="https://i.pravatar.cc/80?img=15" />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}

function AvatarCircle({ text, img }: { text?: string; img?: string }) {
  return (
    <div
      className={cn(
        "flex h-10 w-10 items-center justify-center overflow-hidden rounded-full",
        "border border-white/10 bg-white/10 font-semibold text-white/80",
      )}
    >
      {img ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={img} alt="avatar" className="h-full w-full object-cover" />
      ) : (
        <span>{text}</span>
      )}
    </div>
  );
}
