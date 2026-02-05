import React from 'react'
import styles from './EPContainer.module.css'

interface EPContainerProps {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  center?: boolean
  children: React.ReactNode
}

export default function EPContainer({
  maxWidth = 'xl',
  padding = 'md',
  center = true,
  children,
}: EPContainerProps) {
  const containerClasses = [
    styles.epContainer,
    styles[`epContainer--max-${maxWidth}`],
    styles[`epContainer--padding-${padding}`],
    center && styles['epContainer--center'],
  ]
    .filter(Boolean)
    .join(' ')

  return <div className={containerClasses}>{children}</div>
}
