// eslint-disable-next-line no-use-before-define
export type JSONValue = JSONPrimitive | JSONObject | JSONArray
export type JSONPrimitive = string | number | boolean | null
export type JSONObject = { [member: string]: JSONValue }
export type JSONArray = Array<JSONValue>

export interface ChainGraphTableMappings {
  scopes?: string[]
  table: string
  table_type?: 'singleton' | 'multi_index'
  table_key: string
  computed_key_type?: 'asset_symbol' | 'symbol'
}

export interface ChainGraphMappings {
  chain: string
  contract: string
  contract_type: string | null
  tables: ChainGraphTableMappings[] | null
  abi: JSONValue | null
}

export interface ChainGraphContractWhitelist {
  chain: string
  contract: string
  start_block: number
  actions?: JSONValue | null
  tables?: JSONValue | null
  app_id: string
}

export interface ChainGraphAppManifest {
  app_name: string
  app_id: string
  description: string
  url: string
  whitelist: ChainGraphContractWhitelist[]
}
