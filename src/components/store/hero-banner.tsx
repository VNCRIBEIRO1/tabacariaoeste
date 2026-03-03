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

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % banners.length)
  }, [banners.length])

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + banners.length) % banners.length)
  }, [banners.length])

  useEffect(() => {
    if (banners.length <= 1) return
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next, banners.length])

  if (banners.length === 0) {
    return (
      <div className="relative h-[300px] md:h-[500px] bg-gradient-to-r from-stone-900 to-amber-900 flex items-center justify-center">
        <div className="text-center text-white px-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="text-amber-400">OESTE</span> TABACARIA
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-6">
            Os melhores charutos e acessórios de Presidente Prudente
          </p>
          <Link
            href="/categoria/charutos"
            className="inline-block bg-amber-700 text-white px-8 py-3 rounded-lg font-medium hover:bg-amber-800 transition-colors"
          >
            Ver Produtos
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-[300px] md:h-[500px] overflow-hidden">
      {banners.map((banner, idx) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            idx === current ? "opacity-100" : "opacity-0"
          }`}
        >
          {banner.link ? (
            <Link href={banner.link}>
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
            </Link>
          ) : (
            <>
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
            </>
          )}
        </div>
      ))}

      {banners.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white transition-colors z-10"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white transition-colors z-10"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  idx === current ? "bg-amber-500" : "bg-white/60"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
