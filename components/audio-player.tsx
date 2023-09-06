import { useRef, useState } from 'react'
import { Pause, Play, Square } from 'lucide-react'

import { secsToTime } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'

export function AudioPlayer({ url }: { url: string }) {
  const audioPlayer = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [seekValue, setSeekValue] = useState<number>(0)

  async function handlePlay() {
    const player = audioPlayer.current
    if (player) {
      await player.play()
      setIsPlaying(true)
    }
  }

  function handlePause() {
    const player = audioPlayer.current
    if (player) {
      player.pause()
      setIsPlaying(false)
    }
  }

  function handleStop() {
    const player = audioPlayer.current
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

  function handlePlaying() {
    const player = audioPlayer.current
    if (player) {
      setSeekValue((player.currentTime / player.duration) * 100)
      if (player.currentTime === player.duration) {
        handleStop()
        setIsPlaying(false)
      }
    }
  }

  function handleLoadedMetadata() {
    const player = audioPlayer.current
    if (player && player.duration === Infinity) {
      player.currentTime = 1e101
      player.ontimeupdate = () => {
        player.ontimeupdate = () => {}
        player.currentTime = 0
      }
    }
  }

  return (
    <div className="h-20 w-32">
      <audio ref={audioPlayer} onTimeUpdate={handlePlaying} onLoadedMetadata={handleLoadedMetadata}>
        <track kind="captions" />
        <source src={url} type="audio/webm" />
        Your browser does not support the
        <code>audio</code> element.
      </audio>
      <div className="flex h-full w-full flex-col justify-between gap-2">
        <div className="flex justify-between gap-2 text-xs">
          <span>{secsToTime(audioPlayer.current?.currentTime)}</span>
          <span>{secsToTime(audioPlayer.current?.duration)}</span>
        </div>
        <Slider
          step={1}
          max={100}
          className="w-full"
          defaultValue={[0]}
          value={[seekValue]}
          onValueChange={(value) => {
            const player = audioPlayer.current
            if (player && player.duration !== Infinity) {
              const seekTo = (value[0] / 100) * player.duration
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
        </div>
      </div>
    </div>
  )
}
