import Image from 'next/image'
import type { Therapist } from '@/lib/types'

// Gradient fallback colours per therapist
const GRAD: Record<string, [string, string]> = {
  ren:   ['#C9A998', '#7A5E54'],
  sora:  ['#A8B5C9', '#4F5E7A'],
  yuki:  ['#E5D4D0', '#9B7A78'],
  aoi:   ['#B8C9A8', '#5E7A4F'],
  haru:  ['#E8C9C5', '#A77878'],
  shion: ['#C9B098', '#7A5E3E'],
  rin:   ['#4A2325', '#B9957B'],
  rei:   ['#231F1B', '#9F826D'],
  shohei:['#2C2F34', '#B19A7E'],
  yuten: ['#281C20', '#8E2B30'],
}

interface Props {
  therapist: Therapist
}

export function CastCard({ therapist }: Props) {
  const [from, to] = GRAD[therapist.id] ?? ['#C9A998', '#7A5E54']
  const hasAge = typeof therapist.age === 'number'

  return (
    <div className="group text-center">
      {/* Frame with gold border */}
      <div className="border border-rule-gold bg-[rgba(199,188,163,0.04)] p-1 shadow-[0_12px_35px_rgba(0,0,0,0.28)]">
        <div className="relative aspect-[4/5] overflow-hidden">
          {therapist.mainPhotoUrl ? (
            <Image
              src={therapist.mainPhotoUrl}
              alt={`セラピスト ${therapist.name}`}
              fill
              sizes="(max-width: 430px) 50vw, 215px"
              className="object-cover"
              style={{ objectPosition: therapist.photoPosition ?? '50% 30%' }}
              loading="lazy"
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                background: `
                  radial-gradient(circle at 50% 24%, rgba(242,233,216,0.30) 0 9%, transparent 10%),
                  radial-gradient(ellipse at 50% 60%, rgba(242,233,216,0.18) 0 20%, transparent 21%),
                  linear-gradient(155deg, ${from} 0%, ${to} 100%)
                `,
              }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.12)_48%,rgba(0,0,0,0.62)_100%)]" />
              <div className="absolute inset-x-[18%] bottom-[17%] h-[36%] border border-gold/25 bg-bg/14 backdrop-blur-[1px]" />
              <span className="absolute left-2.5 bottom-2 font-mono text-[9px] tracking-[1.2px] text-white/70">
                {therapist.romanName}
              </span>
            </div>
          )}
          {therapist.isNew && (
            <div className="absolute top-2 right-2 font-serif text-[9px] tracking-[2.5px] text-wine italic">NEW</div>
          )}
        </div>
      </div>
      <div className="font-serif text-[11px] tracking-[3px] text-gold mt-2.5 italic">{therapist.romanName}</div>
      <div className="font-jp text-[15px] mt-0.5">{therapist.name}</div>
      {hasAge && <div className="text-[10px] text-ink-sub mt-1">{therapist.age}歳</div>}
    </div>
  )
}
