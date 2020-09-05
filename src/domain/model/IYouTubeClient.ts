export interface LiveChatMessage {
  message: string
}

export interface LiveChatMessageRequest {
  liveChatId: string
  pageToken: string | null
}

export interface LiveChatMessageReponse {
  messages: LiveChatMessage[]
  pageToken: string | null
}

export interface IYouTubeClient {
  getLiveChatIdFromVideoId(videoId: string): Promise<string | null>
  fetchComments(request: LiveChatMessageRequest): Promise<LiveChatMessageReponse>
}