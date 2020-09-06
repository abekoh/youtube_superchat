import { ShellController } from './controller/ShellController'
import * as Log4js from 'log4js'

const logger = Log4js.getLogger()
logger.level = 'info'

export const run = async () => {
  const args = process.argv.slice(2)
  if (args.length !== 2) {
    console.error('length of args must be 2')
    return
  }
  const controller = new ShellController()
  await controller.run(args[0], args[1])
}

run()
