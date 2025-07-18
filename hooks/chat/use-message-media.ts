import { useCallback, useEffect, useState } from 'react'
import type { Media } from '@twilio/conversations'

export function useMessageMedia(rawMedia: Media | undefined) {
  const [msgMedia, setMsgMedia] = useState({ url: '', loading: true })

  const getMediaUrl = useCallback(async () => {
    try {
      const blob = await rawMedia?.getContentTemporaryUrl()
      setMsgMedia({ url: blob ?? '', loading: false })
    } catch (err) {
      console.error('[use_message_media]', err)
      setMsgMedia({ url: '', loading: false })
    }
  }, [rawMedia])

  useEffect(() => {
    if (rawMedia) {
      getMediaUrl()
    } else {
      setMsgMedia({ url: '', loading: false })
    }
  }, [getMediaUrl, rawMedia])

  return { msgMedia, getMediaUrl }
}
