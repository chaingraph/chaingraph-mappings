// ColumnSet for bulk inserts
// https://github.com/vitaly-t/pg-promise/wiki/Data-Imports

import { ChainGraphAppManifest, ChainGraphMappings } from '.'
import { logger } from '../lib/logger'
import { pgp } from './db'

// Blocks
export const whitelistsColumnSet = new pgp.helpers.ColumnSet(
  ['chain', 'contract', 'start_block', 'actions', 'tables', 'app_id'],
  {
    table: 'whitelists',
  },
)

export const createUpsertWhitelistsQuery = ({
  whitelist,
  app_id,
}: ChainGraphAppManifest) => {
  const query = `${pgp.helpers.insert(
    whitelist.map(({ chain, contract, start_block, actions, tables }) => ({
      chain,
      contract,
      start_block,
      actions: JSON.stringify(actions),
      tables: JSON.stringify(tables),
      app_id,
    })),
    whitelistsColumnSet,
  )} ON CONFLICT ON CONSTRAINT whitelists_pkey DO UPDATE SET start_block=EXCLUDED.start_block, actions=EXCLUDED.actions, tables=EXCLUDED.tables;`
  logger.info(query)
  return query
}

export const createUpsertMappingsQuery = ({
  chain,
  contract,
  contract_type,
  tables,
}: ChainGraphMappings) => {
  const query = pgp.as.format(
    `
    INSERT INTO public.mappings (chain, contract, contract_type, tables )
    VALUES ($1, $2, $3, $4)
    ON CONFLICT ON CONSTRAINT mappings_pkey
    DO UPDATE SET ( contract_type, tables ) = ($3, $4)
    `,
    [chain, contract, contract_type, JSON.stringify(tables)],
  )
  logger.info(query)
  return query
}

export const createUpsertManifestQuery = ({
  app_name,
  app_id,
  description,
  url,
}: ChainGraphAppManifest) => {
  const query = pgp.as.format(
    `
    INSERT INTO public.manifests (app_name, app_id, description, url )
    VALUES ($1, $2, $3, $4)
    ON CONFLICT ON CONSTRAINT manifests_pkey
    DO UPDATE SET ( description, url ) = ($3, $4)
    `,
    [app_name, app_id, description, url],
  )
  logger.info(query)
  return query
}
