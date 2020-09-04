import { ShellController } from './controller/ShellController'

export const run = () => {
  const controller = new ShellController()
  controller.run()
}
run()
