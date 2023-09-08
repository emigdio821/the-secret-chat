import { useRef, useState } from 'react'
import { useToggle } from '@mantine/hooks'
import { Pause, Play, Square } from 'lucide-react'

import { secsToTime } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'

interface AudioPlayerProps {
  url: string
  errorCb: () => Promise<void>
}

export function AudioPlayer({ url, errorCb }: AudioPlayerProps) {
  const aurioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [sliderValue, setSliderValue] = useState(0)
  const [duration, setDuration] = useState(0)
  const [speed, toggleSpeed] = useToggle([1, 2, 3])

  async function handlePlay() {
    const player = aurioRef.current
    if (player) {
      await player.play()
      setIsPlaying(true)
    }
  }

  function handlePause() {
    const player = aurioRef.current
    if (player) {
      player.pause()
      setIsPlaying(false)
    }
  }

  function handleStop() {
    const player = aurioRef.current
    if (player) {
      player.pause()
      player.currentTime = 0
      setSliderValue(0)
      setIsPlaying(false)
    }
  }

  function handlePlaying() {
    const player = aurioRef.current
    if (player) {
      player.playbackRate = speed
      setSliderValue((player.currentTime / duration) * 100)
      if (player.currentTime === duration) {
        handleStop()
      }
    }
  }

  function handleLoadedMetadata() {
    const player = aurioRef.current
    if (player && player.duration === Infinity) {
      player.currentTime = 1e101
      player.ontimeupdate = () => {
        player.ontimeupdate = () => {}
        player.currentTime = 0
        setDuration(player.duration)
      }
    }
  }

  return (
    <div className="h-20 w-32">
      <audio
        src={url}
        ref={aurioRef}
        onError={errorCb}
        onTimeUpdate={handlePlaying}
        onLoadedMetadata={handleLoadedMetadata}
      >
        <track kind="captions" />
        {/* <source src={url} type="audio/wav" /> */}
        Your browser does not support the
        <code>audio</code> element.
      </audio>
      <div className="flex h-full w-full flex-col justify-between gap-2">
        <div className="flex justify-between gap-2 text-xs">
          <span>{secsToTime(aurioRef.current?.currentTime)}</span>
          <span>{secsToTime(duration)}</span>
        </div>
        <Slider
          step={1}
          max={100}
          className="w-full"
          defaultValue={[0]}
          value={[sliderValue]}
          onValueChange={(value) => {
            const player = aurioRef.current
            if (player && player.duration !== Infinity) {
              const seekTo = (value[0] / 100) * duration
              player.currentTime = seekTo
            }
          }}
        />
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            type="button"
            variant="outline"
            className="h-8 w-8 rounded-full"
            onClick={isPlaying ? handlePause : handlePlay}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button
            size="icon"
            type="button"
            variant="outline"
            className="h-6 w-6"
            onClick={handleStop}
            disabled={!isPlaying}
          >
            <Square className="h-2 w-2 fill-foreground" />
          </Button>
          <Button
            size="icon"
            type="button"
            variant="outline"
            className="h-6 w-6 text-xs"
            onClick={() => {
              toggleSpeed()
            }}
          >
            {speed}x
          </Button>
        </div>
      </div>
    </div>
  )
}
