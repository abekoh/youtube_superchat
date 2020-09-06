import { IOutputUsecase, OutputData } from '../../usecase/IOutputUseCase'
import { SubscribeInteractor } from './SubscribeInteractor'
import { Subscriber } from '../model/Subscriber'
import { LiveChatMessage } from '../model/IYouTubeClient'

// SubscriberをMock化
jest.mock('../model/Subscriber')
const SubscriberMock = (Subscriber as unknown) as jest.Mock

// IOutputUsecaseのテスト用実装
class SampleOutputUsecase implements IOutputUsecase {
  public handle(data: OutputData) {
    return
  }
}

describe('hendle', () => {
  SubscriberMock.mockImplementationOnce(() => {
    return {
      on: (
        event: 'consume',
        listener: (message: LiveChatMessage) => void
      ): jest.Mock<any, any> => {
        return SubscriberMock
      },
      register: async (videoId: string): Promise<boolean> => {
        return true
      },
      start: async (): Promise<boolean> => {
        return true
      },
      stop: () => {
        return
      },
    }
  })

  beforeEach(() => {
    SubscriberMock.mockClear()
  })

  test('mode = Register', () => {
    expect(SubscriberMock).not.toHaveBeenCalled()
    const interactor = new SubscribeInteractor(new SampleOutputUsecase())
    interactor.handle({ mode: 'Register', videoId: 'videoid' })
    expect(SubscriberMock).toHaveBeenCalled()
  })

  test('mode = Start', () => {
    expect(SubscriberMock).not.toHaveBeenCalled()
    const interactor = new SubscribeInteractor(new SampleOutputUsecase())
    interactor.handle({ mode: 'Start' })
    expect(SubscriberMock).toHaveBeenCalled()
  })

  test('mode = Stop', () => {
    expect(SubscriberMock).not.toHaveBeenCalled()
    const interactor = new SubscribeInteractor(new SampleOutputUsecase())
    interactor.handle({ mode: 'Stop' })
    expect(SubscriberMock).toHaveBeenCalled()
  })
})
