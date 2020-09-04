import { createBrotliCompress } from 'zlib'

export interface IChatEvent {
  message: string
}

export class Observer {
  constructor(private cb: (chatEvent: IChatEvent) => void) {}

  emit(chatEvent: IChatEvent) {
    this.cb(chatEvent)
  }
}
