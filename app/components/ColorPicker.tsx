'use client'

import { useState } from 'react'
import { Palette } from 'lucide-react'

interface ColorPickerProps {
  label: string
  value: string
  onChange: (color: string) => void
  description?: string
}

export function ColorPicker({ label, value, onChange, description }: ColorPickerProps) {
  const [localValue, setLocalValue] = useState(value)

  const handleChange = (newColor: string) => {
    setLocalValue(newColor)
    onChange(newColor)
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}
      <div className="flex items-center gap-3">
        <div className="relative">
          <input
            type="color"
            value={localValue}
            onChange={(e) => handleChange(e.target.value)}
            className="w-16 h-16 rounded-lg cursor-pointer border-2 border-gray-300 hover:border-gray-400 transition-colors"
            style={{ backgroundColor: localValue }}
          />
          <Palette className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-white mix-blend-difference pointer-events-none" />
        </div>
        <div className="flex-1">
          <input
            type="text"
            value={localValue}
            onChange={(e) => handleChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
            placeholder="#000000"
            pattern="^#[0-9A-Fa-f]{6}$"
          />
        </div>
        <div 
          className="w-12 h-12 rounded-lg border-2 border-gray-300 shadow-inner"
          style={{ backgroundColor: localValue }}
          title={localValue}
        />
      </div>
    </div>
  )
}

interface ColorPaletteProps {
  colors: string[]
  onSelect: (color: string) => void
  label?: string
}

export function ColorPalette({ colors, onSelect, label }: ColorPaletteProps) {
  return (
    <div className="space-y-2">
      {label && (
        <p className="text-sm font-medium text-gray-700">{label}</p>
      )}
      <div className="flex flex-wrap gap-2">
        {colors.map((color, index) => (
          <button
            key={index}
            onClick={() => onSelect(color)}
            className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-gray-500 hover:scale-110 transition-all shadow-sm hover:shadow-md"
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>
    </div>
  )
}

// Fonction utilitaire pour générer des palettes harmonieuses
export function generateColorPalettes(baseColor: string) {
  // Convertir hex en HSL
  const hexToHSL = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255
    const g = parseInt(hex.slice(3, 5), 16) / 255
    const b = parseInt(hex.slice(5, 7), 16) / 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0, s = 0, l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
        case g: h = ((b - r) / d + 2) / 6; break
        case b: h = ((r - g) / d + 4) / 6; break
      }
    }

    return { h: h * 360, s: s * 100, l: l * 100 }
  }

  // Convertir HSL en hex
  const hslToHex = (h: number, s: number, l: number) => {
    h = h / 360
    s = s / 100
    l = l / 100

    let r, g, b

    if (s === 0) {
      r = g = b = l
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1/6) return p + (q - p) * 6 * t
        if (t < 1/2) return q
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
        return p
      }

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
      r = hue2rgb(p, q, h + 1/3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1/3)
    }

    const toHex = (x: number) => {
      const hex = Math.round(x * 255).toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`
  }

  const base = hexToHSL(baseColor)
  
  return {
    // Palette monochrome (variations de luminosité)
    monochrome: [
      hslToHex(base.h, base.s, Math.min(base.l + 30, 90)),
      hslToHex(base.h, base.s, Math.min(base.l + 15, 85)),
      baseColor,
      hslToHex(base.h, base.s, Math.max(base.l - 15, 15)),
      hslToHex(base.h, base.s, Math.max(base.l - 30, 10))
    ],
    // Palette analogue (couleurs voisines)
    analogous: [
      hslToHex((base.h - 30 + 360) % 360, base.s, base.l),
      hslToHex((base.h - 15 + 360) % 360, base.s, base.l),
      baseColor,
      hslToHex((base.h + 15) % 360, base.s, base.l),
      hslToHex((base.h + 30) % 360, base.s, base.l)
    ],
    // Palette complémentaire
    complementary: [
      baseColor,
      hslToHex((base.h + 180) % 360, base.s, base.l),
      hslToHex((base.h + 180) % 360, base.s, Math.min(base.l + 20, 90)),
      hslToHex((base.h + 180) % 360, base.s, Math.max(base.l - 20, 10))
    ],
    // Palette triadique
    triadic: [
      baseColor,
      hslToHex((base.h + 120) % 360, base.s, base.l),
      hslToHex((base.h + 240) % 360, base.s, base.l)
    ]
  }
}
