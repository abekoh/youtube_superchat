// https://developers.google.com/youtube/v3/live/docs/liveChatMessages/list

export type LiveChatMessageType = 'Normal' | 'SuperChat' | 'SuperSticker'

export interface LiveChatMessage {
  type: LiveChatMessageType
  message: string
  amountMicros?: string
  amountDisplayString?: string
  currency?: string
  tier?: number
}

export interface LiveChatMessageRequest {
  liveChatId: string
  pageToken?: string
  maxResults?: number
}

export interface LiveChatMessageResponse {
  messages: LiveChatMessage[]
  pageToken?: string
  pollingIntervalMillis?: number
  totalResults?: number
  resultsPerPage?: number
}

export interface IYouTubeClient {
  getLiveChatIdFromVideoId(videoId: string): Promise<string | null>

  fetchComments(
    request: LiveChatMessageRequest
  ): Promise<LiveChatMessageResponse>
}
