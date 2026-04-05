import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters'
import { Document as LangchainDocument } from '@langchain/core/documents'
import { OllamaEmbeddings } from '@langchain/ollama'
import { CHUNK_OVERLAP, CHUNK_SIZE, EMBEDDING_MODEL, OLLAMA_BASE_URL } from '../lib/constants'

/**
 * Create the embeddings for the documents
 * @returns The embeddings
 */
export const embeddings = new OllamaEmbeddings({
  model: EMBEDDING_MODEL,
  baseUrl: OLLAMA_BASE_URL
})

/**
 * Generate the split documents for the documents
 * @param docs The documents to split
 * @returns The split documents
 */
export async function generateSplitDocs(docs: LangchainDocument[]): Promise<LangchainDocument[]> {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: CHUNK_SIZE,
    chunkOverlap: CHUNK_OVERLAP
  })
  const splitDocs = await splitter.splitDocuments(docs)
  return splitDocs
}
