"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Banner {
  id: string
  title: string
  desktopImage: string
  mobileImage: string | null
  link: string | null
}

export function HeroBanner({ banners }: { banners: Banner[] }) {
  const [current, setCurrent] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const goTo = useCallback(
    (idx: number) => {
      if (isTransitioning) return
      setIsTransitioning(true)
      setCurrent(idx)
      setTimeout(() => setIsTransitioning(false), 700)
    },
    [isTransitioning]
  )

  const next = useCallback(() => {
    goTo((current + 1) % banners.length)
  }, [current, banners.length, goTo])

  const prev = useCallback(() => {
    goTo((current - 1 + banners.length) % banners.length)
  }, [current, banners.length, goTo])

  useEffect(() => {
    if (banners.length <= 1) return
    const timer = setInterval(next, 6000)
    return () => clearInterval(timer)
  }, [next, banners.length])

  if (banners.length === 0) {
    return (
      <div className="relative h-[350px] md:h-[550px] bg-gradient-to-br from-tobacco-900 via-tobacco-800 to-tobacco-950 flex items-center justify-center overflow-hidden">
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage: "radial-gradient(circle at 20% 50%, rgba(212,127,37,0.3), transparent 50%), radial-gradient(circle at 80% 50%, rgba(212,127,37,0.2), transparent 50%)",
            }}
          />
        </div>
        <div className="text-center text-white px-4 relative z-10">
          <div className="inline-flex items-center gap-2 bg-tobacco-700/30 border border-tobacco-600/30 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-medium text-amber-300">Novidades toda semana</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
            <span className="text-amber-400">OESTE</span> TABACARIA
          </h1>
          <p className="text-lg md:text-xl text-tobacco-200 mb-8 max-w-lg mx-auto">
            Os melhores charutos e acessórios premium de Presidente Prudente
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/categoria/charutos"
              className="inline-flex items-center gap-2 bg-tobacco-600 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-tobacco-500 transition-all shadow-lg hover:shadow-xl"
            >
              Ver Charutos
            </Link>
            <Link
              href="/categoria/acessorios"
              className="inline-flex items-center gap-2 bg-transparent border-2 border-tobacco-500 text-tobacco-100 px-8 py-3 rounded-full font-semibold hover:bg-tobacco-800 transition-all"
            >
              Acessórios
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-[350px] md:h-[550px] overflow-hidden bg-tobacco-900">
      {banners.map((banner, idx) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-all duration-700 ease-in-out ${
            idx === current
              ? "opacity-100 scale-100"
              : "opacity-0 scale-105"
          }`}
        >
          {/* Image */}
          <Image
            src={banner.desktopImage}
            alt={banner.title}
            fill
            className="object-cover hidden md:block"
            priority={idx === 0}
          />
          <Image
            src={banner.mobileImage || banner.desktopImage}
            alt={banner.title}
            fill
            className="object-cover md:hidden"
            priority={idx === 0}
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />

          {/* Text overlay */}
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-lg">
                <h2
                  className={`text-3xl md:text-5xl font-bold text-white mb-4 leading-tight transition-all duration-700 delay-200 ${
                    idx === current
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  }`}
                >
                  {banner.title}
                </h2>
                {banner.link && (
                  <Link
                    href={banner.link}
                    className={`inline-flex items-center gap-2 bg-tobacco-600 text-white px-7 py-3 rounded-full font-semibold hover:bg-tobacco-500 transition-all shadow-lg hover:shadow-xl duration-700 delay-300 ${
                      idx === current
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-4"
                    }`}
                  >
                    Confira
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {banners.length > 1 && (
        <>
          {/* Arrow controls */}
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/25 transition-all z-10"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/25 transition-all z-10"
            aria-label="Próximo"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Dots + progress bar */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goTo(idx)}
                className={`transition-all duration-300 rounded-full ${
                  idx === current
                    ? "w-8 h-2.5 bg-tobacco-400"
                    : "w-2.5 h-2.5 bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Ir para slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
