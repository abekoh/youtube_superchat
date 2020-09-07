import { LiveChatMessage } from './IYouTubeClient'
import BigNumber from 'bignumber.js'
import * as Log4js from 'log4js'

const logger = Log4js.getLogger()

export interface SummarizedData {
  sumOfAmount: string
  currency: string
  amountDisplayString: string
  oldestPublishedAt?: Date
  latestPublishedAt?: Date
  allCount: number
  normalCount: number
  superCount: number
}

export class Summarizer {
  private sumOfAmountBigNumber: BigNumber = new BigNumber(0)
  // TODO: 他の通貨も対応
  private currency: string = 'JPY'
  private amountDisplayString: string = '￥'
  private allCount: number = 0
  private normalCount: number = 0
  private superCount: number = 0
  private oldestPublishedAt?: Date
  private latestPublishedAt?: Date

  public summarize(messages: LiveChatMessage[]): Promise<SummarizedData> {
    // 一番最初の1件をoldestにset
    if (!this.oldestPublishedAt) {
      this.oldestPublishedAt = messages[0].publishedAt || undefined
    }
    // 最新の1件をlatestにset
    this.latestPublishedAt = messages[messages.length - 1].publishedAt || this.latestPublishedAt
    messages.forEach((message) => {
      this.allCount += 1
      switch (message.type) {
        case 'SuperChat' || 'SuperSticker':
          // TODO: 円以外の対応
          if (this.currency !== 'JPY') {
            logger.warn(`fetch a not JPY fund: ${JSON.stringify(message)}`)
            return
          }
          this.sumOfAmountBigNumber = this.sumOfAmountBigNumber.plus(
            new BigNumber(message.amountMicros || 0)
          )
          this.superCount += 1
          break
        case 'Normal':
          this.normalCount += 1
          break
      }
    })
    return new Promise((resolve, reject) => {
      resolve({
        sumOfAmount: this.sumOfAmountBigNumber
          .dividedToIntegerBy(1000000)
          .toString(),
        currency: this.currency,
        amountDisplayString: this.amountDisplayString,
        allCount: this.allCount,
        normalCount: this.normalCount,
        superCount: this.superCount,
        oldestPublishedAt: this.oldestPublishedAt,
        latestPublishedAt: this.latestPublishedAt,
      })
    })
  }
}
