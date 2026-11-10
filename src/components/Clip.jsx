import { useEffect, useRef } from 'react'
import { useSettings } from '../context/SettingsContext.jsx'

export default function Clip({ src, poster, alt = '', className = '', fill = false }) {
  const { reduced } = useSettings()
  const ref = useRef(null)

  useEffect(() => {
    const v = ref.current
    if (!v || !src || reduced) return undefined
    const onErr = () => {
      if (v.dataset.retried) return
      v.dataset.retried = '1'
      v.load()
      const p = v.play()
      if (p && typeof p.catch === 'function') p.catch(() => {})
    }
    v.addEventListener('error', onErr)
    if (typeof IntersectionObserver === 'undefined') return () => v.removeEventListener('error', onErr)
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          const p = v.play()
          if (p && typeof p.catch === 'function') p.catch(() => {})
        } else {
          v.pause()
        }
      },
      { rootMargin: '180px 0px' },
    )
    io.observe(v)
    return () => {
      io.disconnect()
      v.removeEventListener('error', onErr)
      v.pause()
    }
  }, [src, reduced])

  return (
    <video
      ref={ref}
      className={`clip${fill ? ' clip--fill' : ''}${className ? ` ${className}` : ''}`}
      src={src}
      poster={poster}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
      muted
      loop
      playsInline
      preload="metadata"
      tabIndex={-1}
      disablePictureInPicture
    />
  )
}
