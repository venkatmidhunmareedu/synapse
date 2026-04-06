import { app } from 'electron'
import path from 'path'

export const OLLAMA_BASE_URL = 'http://localhost:11434'
export const EMBEDDING_MODEL = 'nomic-embed-text'
export const CHUNK_SIZE = 1000
export const CHUNK_OVERLAP = 200
export const LANCEDB_PATH = path.join(app.getPath('userData'), 'lancedb')
export const MAX_QUERY_RESULTS = 3
export enum EMBEDDING_STATUS {
  CHUNKING = 'CHUNKING',
  EMBEDDING = 'EMBEDDING',
  EMBEDDED = 'EMBEDDED',
  ERROR = 'ERROR'
}
