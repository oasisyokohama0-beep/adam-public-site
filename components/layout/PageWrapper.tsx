import type { ReactNode } from 'react'

export function PageWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-[430px] mx-auto min-h-dvh bg-bg overflow-x-hidden pb-[60px]">
      {children}
    </div>
  )
}
