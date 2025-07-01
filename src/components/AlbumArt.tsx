import React, { useState } from 'react'
import { Music } from 'lucide-react'

interface AlbumArtProps {
  url?: string
  alt: string
  className?: string
  iconClassName?: string
}

const AlbumArt: React.FC<AlbumArtProps> = ({
  url,
  alt,
  className = 'h-16 w-16',
  iconClassName = 'h-8 w-8',
}) => {
  const [error, setError] = useState(false)

  if (!url || error) {
    return (
      <div className={`rounded-lg bg-gray-200 flex items-center justify-center ${className}`}>
        <Music className={`${iconClassName} text-gray-400`} />
      </div>
    )
  }

  return (
    <img
      src={url}
      alt={alt}
      className={`rounded-lg object-cover ${className}`}
      onError={() => setError(true)}
    />
  )
}

export default AlbumArt
