import React from 'react'
import styles from './EPButton.module.css'

interface EPButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  fullWidth?: boolean
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  children: React.ReactNode
}

export default function EPButton({
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  fullWidth = false,
  onClick,
  children,
}: EPButtonProps) {
  const buttonClasses = [
    styles.epButton,
    styles[`epButton--${variant}`],
    styles[`epButton--${size}`],
    fullWidth && styles['epButton--fullWidth'],
    disabled && styles['epButton--disabled'],
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      className={buttonClasses}
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
