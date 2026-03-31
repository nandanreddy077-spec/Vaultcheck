import Image from 'next/image'
import Link from 'next/link'

type VantirsLogoProps = {
  href?: string
  className?: string
  imageClassName?: string
  width?: number
  height?: number
  alt?: string
  variant?: 'wordmark' | 'icon'
}

export default function VantirsLogo({
  href = '/',
  className = '',
  imageClassName = '',
  width = 160,
  height = 54,
  alt = 'Vantirs',
  variant = 'wordmark',
}: VantirsLogoProps) {
  const src = variant === 'icon' ? '/vantirs-logo.png' : '/vantirs-logo-wordmark.png'
  return (
    <Link href={href} className={className} aria-label="Vantirs home">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority
        className={imageClassName}
      />
    </Link>
  )
}
