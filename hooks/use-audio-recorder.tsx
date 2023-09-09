'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

export function useAudioRecorder() {
  const mediaRecorder = useRef<MediaRecorder>()
  const [stream, setStream] = useState<MediaStream>()
  const [isRecording, setRecording] = useState(false)
  const [isPaused, setPaused] = useState(false)
  const [audioChunks, setAudioChunks] = useState<Blob[]>([])
  const recordingTime = 0

  async function startRecording() {
    if ('MediaRecorder' in window) {
      try {
        const streamData = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        })

        setStream(streamData)
        setRecording(true)

        const media = new MediaRecorder(streamData)
        const recorder = (mediaRecorder.current = media)

        recorder.start(1000)
        recorder.ondataavailable = (e) => {
          if (recorder.state === 'inactive') {
            setAudioChunks([])
          } else {
            setAudioChunks((prevChunks) => [...prevChunks, e.data])
          }
        }
      } catch (err) {
        let errMsg = 'Unknown error'
        if (err instanceof Error) errMsg = err.message
        console.log('[GET_USER_MEDIA]', errMsg)

        setRecording(false)
        stopRecording()
        // toast.error('Recorder error', {
        //   description: 'Not enough permissions to record audio, please check your browser config.',
        // })
        toast.error('Recorder error', {
          description: errMsg,
        })
      }
    } else {
      toast.error('Recorder error', {
        description: 'The MediaRecorder API is not supported in your browser.',
      })
    }
  }

  const stopRecording = useCallback(() => {
    const mediaRecorderActive = mediaRecorder.current
    setRecording(false)
    if (isPaused) {
      setPaused(false)
    }

    if (mediaRecorderActive) {
      mediaRecorderActive.stop()
      stream?.getTracks().forEach((track) => {
        track.stop()
      })

      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' })
      // const audioUrl = URL.createObjectURL(audioBlob)
      setAudioChunks([])

      return audioBlob
    }
  }, [audioChunks, isPaused, stream])

  function togglePauseResume() {
    setPaused(!isPaused)
    const mediaRecorderActive = mediaRecorder.current

    if (mediaRecorderActive) {
      isPaused ? mediaRecorderActive.resume() : mediaRecorderActive.pause()
    }
  }

  useEffect(() => {
    return () => {
      stopRecording()
    }
  }, [stopRecording])

  return {
    startRecording,
    isRecording,
    isPaused,
    recordingTime,
    stopRecording,
    togglePauseResume,
    stream,
  }
}
