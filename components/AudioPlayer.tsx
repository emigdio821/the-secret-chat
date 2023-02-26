import {
  Text,
  Stack,
  Slider,
  IconButton,
  SliderTrack,
  SliderThumb,
  SliderFilledTrack,
  useColorModeValue,
} from '@chakra-ui/react'
import { secsToTime } from 'utils'
import { motion } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
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
    <motion.div
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
      initial={{ opacity: 0, x: 10 }}
    >
      <audio
        ref={audioPlayer}
        onTimeUpdate={onPlaying}
        onLoadedMetadata={() => {
          handleLoadedMetadata()
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
          <Text fontSize="0.6875rem">{secsToTime(player?.duration)}</Text>
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
        <Stack direction="row" align="center">
          <IconButton
            rounded="full"
            aria-label="Play or Pause"
            onClick={isPlaying ? pause : play}
            icon={isPlaying ? <BiPause size={22} /> : <BiPlay size={22} />}
          />
          <IconButton
            size="sm"
            onClick={stop}
            aria-label="Stop"
            isDisabled={!isPlaying}
            icon={<BiStop size={18} />}
          />
        </Stack>
      </Stack>
      {/* <Box>
          <ButtonGroup size="xs">
            <Button onClick={() => setSpeed(0.5)}>0.5x</Button>
            <Button onClick={() => setSpeed(1)}>1x</Button>
            <Button onClick={() => setSpeed(1.5)}>1.5x</Button>
            <Button onClick={() => setSpeed(2)}>2x</Button>
          </ButtonGroup>
        </Box> */}
    </motion.div>
  )
}
