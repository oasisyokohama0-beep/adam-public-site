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
}

interface Props {
  therapist: Therapist
}

export function CastCard({ therapist }: Props) {
  const [from, to] = GRAD[therapist.id] ?? ['#C9A998', '#7A5E54']

  return (
    <div className="text-center">
      {/* Frame with gold border */}
      <div className="p-1 border border-rule-gold">
        <div className="relative h-[186px] overflow-hidden">
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
              style={{ background: `linear-gradient(160deg, ${from} 0%, ${to} 100%)` }}
            >
              <span className="absolute left-2.5 bottom-2 font-mono text-[9px] tracking-[1.2px] text-white/65">
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
      <div className="text-[10px] text-ink-sub mt-1">{therapist.age}歳</div>
    </div>
  )
}
