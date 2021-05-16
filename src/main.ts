#!/usr/bin/env node

import { program } from 'commander'
import { readFileSync } from 'fs'
import debug from 'debug'
import { logger } from './logger'
import { backupVolumes, BackupInfo } from './backup'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config()

program.version('0.0.2')

interface Args {
  file: BackupInfo | null
  dest: string
  volume: boolean
  container: boolean
  image: boolean
  verbose: boolean
}

function parseConfigFile (file: string): BackupInfo {
  return JSON.parse(readFileSync(path.join(process.cwd(), file)).toString())
}

function parsePath (file: string): string {
  return path.join(process.cwd(), file)
}

program
  .command('backup [container-name]')
  .description('Simple backup scripts for docker container.')
  .requiredOption('-d, --dest [value]', 'destination directory for backup files', parsePath)
  .option('-f, --file [value]', 'config file path', parseConfigFile)
  .option('-v, --volume', 'enable volume backup', true)
  .option('-c, --container', 'enable container backup', false)
  .option('-i, --image', 'enable image backup', false)
  .option('-vv, --verbose', 'enable debug log', false)
  .action(async (containerName: string, args: Args) => {
    if (args.verbose) {
      debug.enable('ERR,INFO,WARN,DEBUG')
    } else {
      debug.enable('ERR,INFO,WARN')
    }

    if (args.file != null) {
      args.file.containers.forEach((container: string) => backupVolumes(container, args.dest))
    } else if (containerName != null) {
      backupVolumes(containerName, args.dest)
    } else {
      logger.error('Use [container] argument or --src [value] option')
    }
  })

program.parse(process.argv)
