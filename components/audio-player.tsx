'use client'

import { useEffect, useRef, useState } from 'react'
import { PauseIcon, PlayIcon, SquareIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Skeleton } from './ui/skeleton'

interface AudioPlayerProps {
  src: string
  className?: string
}

export function AudioPlayer({ src, className }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isLoadingMetadata, setLoadingMetadata] = useState(true)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleLoadedMetadata = () => {
      if (audio.duration === Infinity || Number.isNaN(audio.duration)) {
        audio.currentTime = 1e101
        const fixDuration = () => {
          audio.currentTime = 0
          setDuration(audio.duration)
          setCurrentTime(0)
          setLoadingMetadata(false)
          audio.removeEventListener('timeupdate', fixDuration)
        }
        audio.addEventListener('timeupdate', fixDuration)
      } else {
        setDuration(audio.duration)
        setLoadingMetadata(false)
      }
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }

    audio.load()
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(console.error)
    }
  }

  const handleStop = () => {
    const audio = audioRef.current
    if (!audio) return
    audio.pause()
    audio.currentTime = 0
    setIsPlaying(false)
  }

  const toggleSpeed = () => {
    const audio = audioRef.current
    if (!audio) return
    const newRate = playbackRate === 1 ? 2 : 1
    audio.playbackRate = newRate
    setPlaybackRate(newRate)
  }

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current
    if (!audio || value.length === 0) return
    audio.currentTime = value[0]
    setCurrentTime(value[0])
  }

  const formatTime = (secs: number) => {
    if (!Number.isFinite(secs)) return '0:00'
    const minutes = Math.floor(secs / 60)
    const seconds = Math.floor(secs % 60)
      .toString()
      .padStart(2, '0')
    return `${minutes}:${seconds}`
  }

  return (
    <div className={cn('flex w-40 flex-col gap-2', className)}>
      <audio ref={audioRef} preload="none" className="hidden" hidden>
        <track kind="captions" />
        <source src={src} type="audio/mpeg" />
      </audio>

      <div className="text-xs tabular-nums">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>

      {isLoadingMetadata ? (
        <Skeleton className="h-1 w-full" />
      ) : (
        <Slider
          min={0}
          step={0.1}
          max={duration || 1}
          onValueChange={handleSeek}
          value={[Math.min(currentTime, duration)]}
        />
      )}

      <div className="mt-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="icon" onClick={togglePlay}>
            {isPlaying ? <PauseIcon className="size-4" /> : <PlayIcon className="size-4" />}
          </Button>

          <Button type="button" variant="outline" size="icon" className="size-7" onClick={handleStop}>
            <SquareIcon className="fill-foreground size-2" />
          </Button>
        </div>

        <Button type="button" variant="outline" size="icon" onClick={toggleSpeed} className="size-7 text-xs">
          {playbackRate}x
        </Button>
      </div>
    </div>
  )
}
