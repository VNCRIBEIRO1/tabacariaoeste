"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react"

interface ProductGalleryProps {
  images: { id: string; url: string; alt?: string | null }[]
  productName: string
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selected, setSelected] = useState(0)
  const [zoomed, setZoomed] = useState(false)

  const currentImage = images[selected]?.url || "/images/placeholder.jpg"

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div
        className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-zoom-in"
        onClick={() => setZoomed(true)}
      >
        <Image
          src={currentImage}
          alt={images[selected]?.alt || productName}
          fill
          className="object-cover"
          priority
        />
        <button className="absolute top-4 right-4 bg-white/80 rounded-full p-2">
          <ZoomIn className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setSelected(idx)}
              className={cn(
                "relative w-16 h-16 rounded-md overflow-hidden border-2 flex-shrink-0",
                idx === selected ? "border-amber-700" : "border-transparent hover:border-gray-300"
              )}
            >
              <Image src={img.url} alt={img.alt || ""} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Zoom Modal */}
      {zoomed && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setZoomed(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full">
            <Image
              src={currentImage}
              alt={productName}
              fill
              className="object-contain"
            />
          </div>
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setSelected((prev) => (prev - 1 + images.length) % images.length)
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-3"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setSelected((prev) => (prev + 1) % images.length)
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-3"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
