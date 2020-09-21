import { LiveChatMessage } from '../domain/model/IYouTubeClient'
import { youtube_v3 } from 'googleapis'
import { RawLiveChatMessageType } from './YouTubeNodeClient'
import * as Log4js from 'log4js'

const logger = Log4js.getLogger()

export class YouTubeClientUtils {
  public static itemToLiveChatMessage(
    item: youtube_v3.Schema$LiveChatMessage
  ): LiveChatMessage | null {
    if (!item.snippet) {
      return null
    }
    switch (item.snippet?.type as RawLiveChatMessageType) {
      case 'textMessageEvent':
        return {
          type: 'Normal',
          message: item.snippet?.textMessageDetails?.messageText || '',
          publishedAt: new Date(item.snippet?.publishedAt || '')
        }
      case 'superChatEvent':
        return {
          type: 'SuperChat',
          message: item.snippet?.superChatDetails?.userComment || '',
          publishedAt: new Date(item.snippet?.publishedAt || ''),
          amountMicros:
            item.snippet?.superChatDetails?.amountMicros || undefined,
          amountDisplayString:
            item.snippet?.superChatDetails?.amountDisplayString || undefined,
          currency: item.snippet?.superChatDetails?.currency || undefined,
          tier: item.snippet?.superChatDetails?.tier || undefined
        }
      case 'superStickerEvent':
        return {
          type: 'SuperSticker',
          // とりあえず代替テキスト
          message:
            item.snippet?.superStickerDetails?.superStickerMetadata?.altText ||
            '',
          publishedAt: new Date(item.snippet?.publishedAt || ''),
          amountMicros:
            item.snippet?.superStickerDetails?.amountMicros || undefined,
          amountDisplayString:
            item.snippet?.superStickerDetails?.amountDisplayString || undefined,
          currency: item.snippet?.superStickerDetails?.currency || undefined,
          tier: item.snippet?.superStickerDetails?.tier || undefined
        }
      default:
        logger.debug(`unsupported event: ${item.snippet?.type}`)
        return null
    }
  }
}
