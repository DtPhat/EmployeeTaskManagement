import { cn } from '@/lib/utils'
import React from 'react'

interface ContainerProps {
  children: React.ReactNode,
  className?: string
}
const Container = ({ children, className = "" }: ContainerProps) => {
  return (
    <section className={cn("flex flex-col items-center")}>
      <div className={className}>
        {children}
      </div>
    </section>
  )
}

export default Container