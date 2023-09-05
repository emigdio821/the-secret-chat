import { useEffect, useRef, useState } from 'react'
import { Pause, Play, Square } from 'lucide-react'

import { secsToTime } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'

export function AudioPlayer({ url }: { url: string }) {
  const audioPlayer = useRef<HTMLAudioElement>(null)
  const [currentTime, setCurrentTime] = useState<string>('0:00')
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [seekValue, setSeekValue] = useState<number>(0)
  const [player, setPlayer] = useState<HTMLAudioElement | null>(null)

  const play = async () => {
    if (player) {
      await player.play()
      setIsPlaying(true)
    }
  }

  const pause = () => {
    if (player) {
      audioPlayer.current?.pause()
      setIsPlaying(false)
    }
  }

  const stop = () => {
    if (player) {
      player.pause()
      player.currentTime = 0
      setIsPlaying(false)
    }
  }

  // const setSpeed = (speed: number) => {
  //   if (audioEl) {
  //     audioEl.playbackRate = speed
  //   }
  // }

  useEffect(() => {
    if (audioPlayer.current && !player) {
      setPlayer(audioPlayer.current)
    }

    return () => {
      if (player) {
        setPlayer(null)
      }
    }
  }, [player])

  const onPlaying = () => {
    if (player) {
      setCurrentTime(secsToTime(player.currentTime))
      setSeekValue((player.currentTime / player.duration) * 100)
      if (player.currentTime === player.duration) {
        stop()
        setIsPlaying(false)
      }
    }
  }

  function handleLoadedMetadata() {
    if (player) {
      if (player.duration === Infinity) {
        player.currentTime = 1e101
        player.ontimeupdate = () => {
          if (player) {
            player.ontimeupdate = () => {}
            player.currentTime = 0
          }
        }
      }
    }
  }

  return (
    <div className="w-32">
      <audio
        ref={audioPlayer}
        onTimeUpdate={onPlaying}
        onLoadedMetadata={() => {
          handleLoadedMetadata()
        }}
      >
        <track kind="captions" />
        <source src={url} type="audio/webm" />
        Your browser does not support the
        <code>audio</code> element.
      </audio>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between gap-2 text-xs">
          <span>{currentTime}</span>
          <span>{secsToTime(player?.duration)}</span>
        </div>
        <Slider
          step={1}
          max={100}
          className="w-full"
          defaultValue={[0]}
          value={[seekValue]}
          onValueChange={(value) => {
            if (player && player.duration !== Infinity) {
              const seekTo = (value[0] / 100) * player.duration
              player.currentTime = seekTo
            }
          }}
        />
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="outline"
            className="h-8 w-8 rounded-full"
            onClick={isPlaying ? pause : play}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button
            size="icon"
            onClick={stop}
            variant="outline"
            disabled={!isPlaying}
            className="h-6 w-6"
          >
            <Square className="h-2 w-2 fill-foreground" />
          </Button>
        </div>
      </div>
    </div>
  )
}
