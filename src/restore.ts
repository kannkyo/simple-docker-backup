#! /usr/bin/env node

import { execSync } from 'child_process'
import fs from 'fs'
import { logger } from './logger'
import { Container } from './docker'

const DESTINATION = '/backup'

/**
 * Restore information
 */
export interface RestoreInfo {
  containers: string[]
}

/**
 * Restore all volumes of a container
 * @param containerName container name
 * @param src source directory for backup files
 */
export function restoreVolumes (containerName: string, src: string): void {
  const container = new Container(containerName)

  container.stop()

  logger.debug(`Start all volumes restore. source=${src}`)

  container.volumes.forEach(volume => {
    if (volume.name.includes('/')) {
      logger.debug(`Find restore target files. volume=${volume.name}`)
    } else {
      const sourceVolume = `${src}/${volume.name}.tar.gz`
      const destinationVolume = `${DESTINATION}/${volume.name}.tar.gz`

      if (!fs.existsSync(sourceVolume)) {
        logger.warn(`Can't find restore target files. src_gz=${sourceVolume}`)
      } else {
        logger.info(` Restore a volume. container=${container.name}, volume=${volume.name}, directory=${volume.directory}`)
        execSync(`docker run --rm --volumes-from ${container.name} -v ${src}:${DESTINATION} ubuntu bash -c "cd ${volume.directory} && pwd && ls -l && ls -A | xargs rm -rf"`)
        execSync(`docker run --rm --volumes-from ${container.name} -v ${src}:${DESTINATION} ubuntu bash -c "cd / && tar zxf ${destinationVolume} && pwd && ls -l ${volume.directory}"`)
      }
    }
  })

  container.start()
}
