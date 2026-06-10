'use client'

import { useEffect, useState } from 'react'
import type { StoreEvent } from '@/lib/types'

// Event gradient pairs matching the design
const GRAD: Record<number, [string, string]> = {
  0: ['#D8C9B3', '#8C6B43'],
  1: ['#E8D5C4', '#B8956A'],
  2: ['#C4A78A', '#5C4630'],
}

interface Props {
  events: StoreEvent[]
}

export function EventSlider({ events }: Props) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (events.length <= 1) return
    const t = setInterval(() => setCurrent(x => (x + 1) % events.length), 4500)
    return () => clearInterval(t)
  }, [events.length])

  return (
    <div className="relative overflow-hidden" style={{ height: 170 }}>
      {/* Slides */}
      {events.map((evt, i) => {
        const [from, to] = GRAD[i] ?? ['#D8C9B3', '#8C6B43']
        return (
          <div
            key={evt.id}
            className="absolute inset-0 transition-opacity duration-700"
            style={{ opacity: i === current ? 1 : 0, pointerEvents: i === current ? 'auto' : 'none' }}
          >
            <div
              className="relative h-full"
              style={{ background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)` }}
            >
              {/* Inner border */}
              <div className="absolute inset-2 border border-white/40 pointer-events-none" />
              <div className="absolute inset-0 p-[26px] flex flex-col justify-center text-white">
                <div className="font-serif text-[9px] tracking-[3px] italic opacity-90">{evt.tag}</div>
                <div className="font-jp text-[17px] leading-relaxed mt-2 font-medium">{evt.title}</div>
                {evt.subtitle && (
                  <div className="font-serif text-[10px] tracking-[2px] italic mt-2.5 opacity-85">{evt.subtitle}</div>
                )}
              </div>
            </div>
          </div>
        )
      })}

      {/* Dots */}
      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-[5px] z-10">
        {events.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`スライド ${i + 1}`}
            className="h-[5px] rounded-full transition-all duration-[350ms] cursor-pointer"
            style={{
              width: i === current ? 20 : 5,
              background: i === current ? '#E7CFA6' : 'rgba(231,207,166,0.4)',
            }}
          />
        ))}
      </div>
    </div>
  )
}
