import { Observer } from './Observer'

export class Subscriber {
  private intervalId: NodeJS.Timer | null

  constructor(private observer: Observer) {
    this.intervalId = null
  }

  public start() {
    this.intervalId = setInterval(() => {
      console.log('running...')
      this.observer.emit({ message: 'observed' })
    }, 1000)
  }

  public stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
    }
    this.intervalId = null
  }
}
