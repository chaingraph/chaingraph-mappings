import * as env from 'env-var'

export interface Config {
  database_url: string
}

export const config: Config = {
  database_url: env.get('DATABASE_URL').required().asString(),
}
