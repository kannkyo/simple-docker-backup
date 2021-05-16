#! /usr/bin/env node

import { logger } from './logger'
import { execSync } from 'child_process'
import fs from 'fs'
import { Container } from './docker'

/**
 * Backup information
 */
export interface BackupInfo {
  containers: string[]
  scope: string[] | null
}

const SOURCE = '/backup'

/**
 * Backup all volumes of a container
 * @param containerName container name
 * @param dst destination directory for backup files
 */
export function backupVolumes (containerName: string, dst: string): void {
  const container = new Container(containerName)

  container.stop()

  logger.debug(`Start all volumes backup. destination=${dst}`)

  container.volumes.forEach(volume => {
    if (volume.name.includes('/')) {
      logger.debug(`Find backup target files. volume=${volume.name}`)
    } else {
      const sourceVolume = `${SOURCE}/${volume.name}.tar.gz`
      const destinationVolume = `${dst}/${volume.name}.tar.gz`

      if (fs.existsSync(destinationVolume)) {
        logger.debug(`Start to delete previous backup file. file=${destinationVolume}`)
        fs.unlinkSync(destinationVolume)
        logger.debug(`End to delete previous backup file. file=${destinationVolume}`)
      }

      logger.info(`Backup a volume. container=${container.name}, volume=${volume.name}, directory=${volume.directory}`)
      execSync(`docker run --rm --volumes-from ${container.name} -v ${dst}:${SOURCE} ubuntu tar zcf ${sourceVolume} -C / ${volume.directory}`)
    }
  })

  container.start()
}
