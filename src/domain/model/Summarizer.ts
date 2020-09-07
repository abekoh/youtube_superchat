import { LiveChatMessage } from './IYouTubeClient'
import BigNumber from 'bignumber.js'
import * as Log4js from 'log4js'

const logger = Log4js.getLogger()

export interface SummarizedData {
  sumOfAmount: string
  currency: string
  amountDisplayString: string
}

export class Summarizer {
  private sumOfAmountBigNumber: BigNumber = new BigNumber(0)
  // TODO: 他の通貨も対応
  private currency: string = 'JPY'
  private amountDisplayString: string = '￥'

  public summarize(messages: LiveChatMessage[]): Promise<SummarizedData> {
    messages.forEach((message) => {
      switch (message.type) {
        case 'SuperChat' || 'SuperSticker':
          // TODO: 円以外の対応
          if (this.currency !== 'JPY') {
            logger.warn(`fetch a not JPY fond: ${JSON.stringify(message)}`)
            return
          }
          this.sumOfAmountBigNumber = this.sumOfAmountBigNumber.plus(
            new BigNumber(message.amountMicros || 0)
          )
      }
    })
    return new Promise((resolve, reject) => {
      resolve({
        sumOfAmount: this.sumOfAmountBigNumber.toString(),
        currency: this.currency,
        amountDisplayString: this.amountDisplayString,
      })
    })
  }
}
