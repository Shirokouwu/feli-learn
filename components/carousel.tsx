"use client"

import * as React from "react"
import useEmblaCarousel, { type UseEmblaCarouselType } from "embla-carousel-react"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

interface CarouselProps {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: "horizontal" | "vertical"
  setApi?: (api: CarouselApi) => void
  className?: string
  children: React.ReactNode
}

const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  ({ opts, plugins, orientation = "horizontal", setApi, className, children, ...props }, ref) => {
    const [emblaRef, emblaApi] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
      },
      plugins,
    )
    const [prevBtnDisabled, setPrevBtnDisabled] = React.useState(true)
    const [nextBtnDisabled, setNextBtnDisabled] = React.useState(true)
    const [selectedIndex, setSelectedIndex] = React.useState(0)
    const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([])

    const scrollPrev = React.useCallback(() => {
      emblaApi?.scrollPrev()
    }, [emblaApi])

    const scrollNext = React.useCallback(() => {
      emblaApi?.scrollNext()
    }, [emblaApi])

    const scrollTo = React.useCallback(
      (index: number) => {
        emblaApi?.scrollTo(index)
      },
      [emblaApi],
    )

    const onSelect = React.useCallback((emblaApi: CarouselApi) => {
      setSelectedIndex(emblaApi.selectedScrollSnap())
      setPrevBtnDisabled(!emblaApi.canScrollPrev())
      setNextBtnDisabled(!emblaApi.canScrollNext())
    }, [])

    const onInit = React.useCallback((emblaApi: CarouselApi) => {
      setScrollSnaps(emblaApi.scrollSnapList())
    }, [])

    React.useEffect(() => {
      if (!emblaApi) {
        return
      }

      setApi?.(emblaApi)
      onInit(emblaApi)
      onSelect(emblaApi)
      emblaApi.on("reInit", onInit)
      emblaApi.on("reInit", onSelect)
      emblaApi.on("select", onSelect)
    }, [emblaApi, onInit, onSelect, setApi])

    return (
      <div ref={ref} className={cn("relative", className)} role="region" aria-roledescription="carousel" {...props}>
        <div ref={emblaRef} className="overflow-hidden" aria-live="polite" aria-atomic="true">
          <div className={cn("flex", orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col")}>{children}</div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full shadow-md",
            orientation === "horizontal" ? "-left-4" : "-top-4 left-1/2 -translate-x-1/2 rotate-90",
          )}
          onClick={scrollPrev}
          disabled={prevBtnDisabled}
          aria-label="Previous slide"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full shadow-md",
            orientation === "horizontal" ? "-right-4" : "-bottom-4 left-1/2 -translate-x-1/2 rotate-90",
          )}
          onClick={scrollNext}
          disabled={nextBtnDisabled}
          aria-label="Next slide"
        >
          <ArrowRight className="h-5 w-5" />
        </Button>
        <div className="flex justify-center gap-2 mt-4">
          {scrollSnaps.map((_, index) => (
            <Button
              key={index}
              variant="ghost"
              size="icon"
              className={cn("h-2 w-2 p-0 rounded-full", selectedIndex === index ? "bg-red-500" : "bg-neutral-300")}
              onClick={() => scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    )
  },
)
Carousel.displayName = "Carousel"

export { Carousel }
