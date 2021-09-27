import { db } from './db'
import { ChainGraphAppManifest, ChainGraphMappings } from '../lib/types'
import {
  createUpsertManifestQuery,
  createUpsertMappingsQuery,
  createUpsertWhitelistsQuery,
} from './queries'

export * from './db'
export * from '../lib/types'

export const upsertMappings = async (mappings: ChainGraphMappings) => {
  return db.query(createUpsertMappingsQuery(mappings))
}

export const upsertManifest = async (manifest: ChainGraphAppManifest) => {
  await db.task(async (t) => {
    await t.none(createUpsertManifestQuery(manifest))
    return t.none(createUpsertWhitelistsQuery(manifest))
  })
}
