import { ShellController } from './controller/ShellController'
import * as Log4js from 'log4js'

const logger = Log4js.getLogger()
logger.level = 'info'

export const run = async () => {
  const controller = new ShellController()
  await controller.run()
}

run()
