import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { zipCode, items } = body

    if (!zipCode) {
      return NextResponse.json(
        { error: "CEP é obrigatório" },
        { status: 400 }
      )
    }

    // Clean zip code
    const cleanZip = zipCode.replace(/\D/g, "")

    if (cleanZip.length !== 8) {
      return NextResponse.json(
        { error: "CEP inválido" },
        { status: 400 }
      )
    }

    // Check if there's free shipping settings
    const settings = await prisma.storeSettings.findFirst()

    // Calculate total weight from items if provided
    let totalWeight = 0
    if (items && Array.isArray(items)) {
      for (const item of items) {
        totalWeight += (item.weight || 0.3) * (item.quantity || 1)
      }
    }

    // Check shipping zones from database
    const shippingZones = await prisma.shippingZone.findMany({
      where: { active: true },
    })

    // Extract state from zip code (rough mapping for Brazil)
    const zipNum = parseInt(cleanZip.substring(0, 5))

    // Try to find matching zone
    // For now, return mock options that can be replaced with Correios API later
    const shippingOptions = [
      {
        name: "PAC",
        price: 15.9,
        days: 8,
        description: "Entrega econômica",
      },
      {
        name: "SEDEX",
        price: 29.9,
        days: 3,
        description: "Entrega expressa",
      },
    ]

    // If there's a matching shipping zone, use its prices
    if (shippingZones.length > 0) {
      // Use zone-based pricing if available
      const matchedZone = shippingZones[0] // Simplified - should match by state
      if (matchedZone) {
        shippingOptions[0].price = Number(matchedZone.price)
        shippingOptions[0].days = matchedZone.maxDays
        shippingOptions[1].price = Number(matchedZone.price) * 2
        shippingOptions[1].days = matchedZone.minDays
      }
    }

    // Check for free shipping
    let freeShipping = false
    if (settings?.freeShippingMin && items) {
      const subtotal = items.reduce(
        (sum: number, item: { price: number; quantity: number }) =>
          sum + (item.price || 0) * (item.quantity || 1),
        0
      )
      if (subtotal >= Number(settings.freeShippingMin)) {
        freeShipping = true
      }
    }

    // Check store pickup
    const enablePickup = settings?.enablePickup || false

    return NextResponse.json({
      zipCode: cleanZip,
      options: freeShipping
        ? [
            { name: "Frete Grátis", price: 0, days: 8, description: "Frete grátis" },
            ...shippingOptions,
          ]
        : shippingOptions,
      enablePickup,
      freeShipping,
    })
  } catch (error) {
    console.error("Erro ao calcular frete:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
