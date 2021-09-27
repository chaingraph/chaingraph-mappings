import { logger } from './lib/logger'
import fs from 'fs'
import yaml from 'yaml'
import { upsertMappings } from './database'

export interface MappingsParams {
  chain: string
  contract: string
}

export const loadMappings = ({ chain, contract }: MappingsParams) => {
  return yaml.parse(
    fs.readFileSync(
      `${__dirname}/../mappings/${chain}/${contract}.yml`,
      'utf8',
    ),
  )
}

export const addMappings = async (whitelistParams: MappingsParams) => {
  const mappings = loadMappings(whitelistParams)
  if (!mappings) {
    throw new Error(
      `Mappings not found for ${whitelistParams.contract} on ${whitelistParams.chain}`,
    )
  }
  await upsertMappings(mappings)

  logger.info(
    `Added mappings for ${whitelistParams.contract} on ${whitelistParams.chain} succesfully`,
  )
}

const missingParam = (param: string) => {
  logger.error(`Missing ${param} name`)
  logger.info(
    'Usage: yarn mpapings ${chain} ${contract}. Eg. yarn mpapings eos bitcashbank1',
  )
  process.exit(1)
}

if (require.main === module) {
  ;(async () => {
    try {
      const chain = process.argv[2]
      if (!chain) missingParam('chain')

      const contract = process.argv[3]
      if (!contract) missingParam('contract')

      await addMappings({ chain, contract })
      process.exit(0)
    } catch (error) {
      logger.error(error)
      process.exit(1)
    }
  })()
}
