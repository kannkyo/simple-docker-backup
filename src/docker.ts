import { logger } from './logger'
import { execSync } from 'child_process'

export class Volume {
  name: string
  directory: string

  constructor (volumeLabel: string) {
    const vv = volumeLabel.split(':')
    this.name = vv[0]
    this.directory = vv[1].slice(1)
  }
}

export class Container {
  volumes: Volume[]

  constructor (public readonly name: string) {
    const inspect = this.inspect()
    this.volumes = inspect[0].HostConfig.Binds.map((v: string) => new Volume(v))
  }

  inspect (): any {
    return JSON.parse(execSync(`docker inspect ${this.name}`).toString())
  }

  start (): void {
    logger.debug(`Start container. container=${this.name}`)
    execSync(`docker start ${this.name}`)
  }

  stop (): void {
    logger.debug(`Stop container. container=${this.name}`)
    execSync(`docker stop ${this.name}`)
  }
}
