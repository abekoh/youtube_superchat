import { ShellController } from './controller/ShellController'

export const run = async () => {
  const controller = new ShellController()
  await controller.run()
}

run()