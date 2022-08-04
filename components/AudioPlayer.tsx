import React, { useRef, useState, useEffect } from 'react'
import {
  Box,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  ButtonGroup,
  IconButton,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import { BiPlay, BiPause, BiStop } from 'react-icons/bi'

export default function AudioPlayer({ audioUrl }: { audioUrl: string }) {
  const audioPlayer = useRef<HTMLAudioElement>(null)
  const [currentTime, setCurrentTime] = useState<string>('0:00')
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [seekValue, setSeekValue] = useState<number>(0)
  const [player, setPlayer] = useState<HTMLAudioElement | null>(null)

  const play = () => {
    if (player) {
      player.play()
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
    if (audioPlayer.current) {
      setPlayer(audioPlayer.current)
    }
  }, [])

  function formatAudioTime(time?: number) {
    if (player) {
      const theTime = time || player.currentTime
      const mins = Math.floor(theTime / 60)
      const secs = Math.floor(theTime % 60)
      let formattedSecs
      if (secs < 10) {
        formattedSecs = `0${String(secs)}`
        return `${mins}:${formattedSecs}`
      }
      return `${mins}:${secs}`
    }
    return '0:00'
  }

  const onPlaying = () => {
    if (player) {
      setCurrentTime(formatAudioTime())
      setSeekValue((player.currentTime / player.duration) * 100)
      if (player.currentTime === player.duration) {
        stop()
        setIsPlaying(false)
      }
    }
  }

  return (
    <Box>
      <audio
        ref={audioPlayer}
        onTimeUpdate={onPlaying}
        onLoadedMetadata={() => {
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
        }}
      >
        <track kind="captions" />
        <source src={audioUrl} type="audio/wav" />
        Your browser does not support the
        <code>audio</code> element.
      </audio>
      <Stack>
        <Stack direction="row" justifyContent="space-between">
          <Text fontSize="0.6875rem">{currentTime}</Text>
          <Text fontSize="0.6875rem">{formatAudioTime(player?.duration)}</Text>
        </Stack>
        <Slider
          min={0}
          w={120}
          step={1}
          max={100}
          size="sm"
          defaultValue={0}
          value={seekValue}
          colorScheme="purple"
          onChange={(val) => {
            if (player && player.duration !== Infinity) {
              const seekto = (val / 100) * player.duration
              player.currentTime = seekto
            }
          }}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb shadow="xl" bg={useColorModeValue('#333', '#fafafa')} />
        </Slider>
        <ButtonGroup size="sm">
          <IconButton
            onClick={play}
            aria-label="Play"
            disabled={isPlaying}
            icon={<BiPlay size={20} />}
          />
          <IconButton
            onClick={pause}
            aria-label="Pause"
            icon={<BiPause size={20} />}
            disabled={!isPlaying}
          />
          <IconButton
            onClick={stop}
            aria-label="Stop"
            icon={<BiStop size={20} />}
            disabled={!isPlaying}
          />
        </ButtonGroup>
      </Stack>
      {/* <Box>
          <ButtonGroup size="xs">
            <Button onClick={() => setSpeed(0.5)}>0.5x</Button>
            <Button onClick={() => setSpeed(1)}>1x</Button>
            <Button onClick={() => setSpeed(1.5)}>1.5x</Button>
            <Button onClick={() => setSpeed(2)}>2x</Button>
          </ButtonGroup>
        </Box> */}
    </Box>
  )
}
