import { log } from './lib/logger'
import fs from 'fs'
import path from 'path'
import { db } from './lib/db'

export interface WhitelistingParams {
  chain: string
  contract: string
}

export const loadMappings = ({ chain, contract }: WhitelistingParams) => {
  const fileData = fs.readFileSync(
    path.join(__dirname, `../mappings/${chain}/${contract}.json`),
  )
  return JSON.parse(fileData.toString())
}

export const whitelist = async (whitelistParams: WhitelistingParams) => {
  const mappings = loadMappings(whitelistParams)
  if (!mappings) {
    throw new Error(
      `Mappings not found for ${whitelistParams.contract} on ${whitelistParams.chain}`,
    )
  }
  const { chain, contract, contract_type, actions, tables } = mappings

  await db.query(
    `
    INSERT INTO public.mappings (chain, contract, contract_type, tables, actions ) 
    VALUES ($1, $2, $3, $4, $5) 
    ON CONFLICT ON CONSTRAINT mappings_pkey 
    DO UPDATE SET ( contract_type, tables, actions ) = ($3, $4, $5)
    `,
    [chain, contract, contract_type, JSON.stringify(tables), actions],
  )
  log.info(
    `Whitelisted ${whitelistParams.contract} on ${whitelistParams.chain} succesfully`,
  )
}

const missingParam = (param: string) => {
  log.error(`Missing ${param} name`)
  log.info(
    'Usage: yarn whitelist ${chain} ${contract}. Eg. yarn whitelist eos bitcashbank1',
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

      await whitelist({ chain, contract })
      process.exit(0)
    } catch (error) {
      log.error(error)
      process.exit(1)
    }
  })()
}
