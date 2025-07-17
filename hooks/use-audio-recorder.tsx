import { useCallback, useRef, useState } from 'react'

interface UseAudioRecorderReturn {
  isRecording: boolean
  isPaused: boolean
  startRecording: () => Promise<void>
  togglePauseRecording: () => void
  stopRecording: () => Promise<Blob | null>
}

export function useAudioRecorder(): UseAudioRecorderReturn {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  const startRecording = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      alert('Audio recording is not supported in this browser.')
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      const recorder = new MediaRecorder(stream)
      mediaRecorderRef.current = recorder
      audioChunksRef.current = []

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      recorder.onstart = () => {
        setIsRecording(true)
        setIsPaused(false)
      }

      recorder.onpause = () => setIsPaused(true)
      recorder.onresume = () => setIsPaused(false)

      recorder.onstop = () => {
        setIsRecording(false)
        setIsPaused(false)
        stream.getTracks().forEach((track) => track.stop())
      }

      recorder.start()
    } catch (err) {
      console.error('Failed to start recording:', err)
    }
  }, [])

  const togglePauseRecording = useCallback(() => {
    const recorder = mediaRecorderRef.current
    if (!recorder) return

    // Safari does not support pause/resume — fallback to do nothing
    if (typeof recorder.pause !== 'function' || typeof recorder.resume !== 'function') return

    if (recorder.state === 'recording') {
      recorder.pause()
    } else if (recorder.state === 'paused') {
      recorder.resume()
    }
  }, [])

  const stopRecording = useCallback(async (): Promise<Blob | null> => {
    const recorder = mediaRecorderRef.current
    return new Promise((resolve) => {
      if (!recorder) return resolve(null)

      recorder.onstop = () => {
        setIsRecording(false)
        setIsPaused(false)
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        resolve(audioBlob)
      }

      if (recorder.state !== 'inactive') {
        recorder.stop()
      } else {
        resolve(null)
      }
    })
  }, [])

  return {
    isRecording,
    isPaused,
    startRecording,
    togglePauseRecording,
    stopRecording,
  }
}
