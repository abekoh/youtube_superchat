import { IOutputUsecase, OutputData } from '../usecase/IOutputUseCase'
import * as Log4js from 'log4js'

const logger = Log4js.getLogger()


export class ShellPresenter implements IOutputUsecase {
  public handle(data: OutputData) {
    logger.info(`message: ${data.message}`)
  }
}
