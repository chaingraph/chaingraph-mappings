import { logger } from './lib/logger'
import fs from 'fs'
import yaml from 'yaml'
import { upsertManifest } from './database'

export const loadManifest = (manifest: string) => {
  logger.info(`${__dirname}/../manifests/${manifest}.yml`)
  return yaml.parse(
    fs.readFileSync(`${__dirname}/../manifests/${manifest}.yml`, 'utf8'),
  )
}

export const addManifest = async (manifest: string) => {
  const appManifest = loadManifest(manifest)
  if (!appManifest) {
    throw new Error(`manifest not found for ${manifest}`)
  }
  await upsertManifest(appManifest)

  logger.info(`added ${manifest} manifest succesfully`)
}

const missingParam = (param: string) => {
  logger.error(`Missing ${param} name`)
  logger.info(
    'Usage: yarn whitelist ${chain} ${manifest}. Eg. yarn whitelist eos bitcashbank1',
  )
  process.exit(1)
}

if (require.main === module) {
  ;(async () => {
    try {
      const manifest = process.argv[2]
      if (!manifest) missingParam('manifest')

      await addManifest(manifest)
      process.exit(0)
    } catch (error) {
      logger.error(error)
      process.exit(1)
    }
  })()
}
