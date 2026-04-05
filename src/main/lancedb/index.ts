import * as lancedb from '@lancedb/lancedb'
import { Document as LangchainDocument } from '@langchain/core/documents'
import { LanceDB } from '@langchain/community/vectorstores/lancedb'

import { LANCEDB_PATH, MAX_QUERY_RESULTS } from '../lib/constants'
import { embeddings } from '../embedder'
import { generateFileNameWithForbiddenCharacters } from '../lib/utils'

/** Keep only scalar fields for LanceDB; PDFLoader puts the page index in `loc.pageNumber`. */
function documentsWithLanceSafeMetadata(docs: LangchainDocument[]): LangchainDocument[] {
  return docs.map((d) => {
    const loc = d.metadata.loc as { pageNumber?: number } | undefined
    const pageNumber =
      loc !== null && typeof loc === 'object' && typeof loc.pageNumber === 'number'
        ? loc.pageNumber
        : undefined
    return new LangchainDocument({
      pageContent: d.pageContent,
      metadata: pageNumber !== undefined ? { pageNumber } : {}
    })
  })
}

/**
 * Setup the LanceDB connection and return the connection
 * @returns The LanceDB connection
 */
async function setupLancedb(): Promise<lancedb.Connection> {
  const db = await lancedb.connect(LANCEDB_PATH)
  return db
}

/**
 * Store the documents in the LanceDB connection
 * @param docs The documents to store
 * @param fileName The name of the file to store the documents in
 */
export async function storeDocs(docs: LangchainDocument[], fileName: string): Promise<void> {
  await setupLancedb()
  const safeDocs = documentsWithLanceSafeMetadata(docs)
  await LanceDB.fromDocuments(safeDocs, embeddings, {
    tableName: generateFileNameWithForbiddenCharacters(fileName),
    uri: LANCEDB_PATH
  })
}

/**
 * Query the documents in the LanceDB connection
 * @param query The query to search for
 * @param fileName The name of the file to search in
 * @returns The documents that match the query
 */
export async function queryDocs(query: string, fileName: string): Promise<LangchainDocument[]> {
  const db = await setupLancedb()
  const table = await db.openTable(generateFileNameWithForbiddenCharacters(fileName))
  const vectorStore = new LanceDB(embeddings, { table })
  const results = await vectorStore.similaritySearch(query, MAX_QUERY_RESULTS)
  return results
}
