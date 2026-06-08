import { ToolLoopAgent, type ToolSet } from 'ai'
// import { createOllama } from 'ai-sdk-ollama'
import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { createTools } from './tools'

const ollamaModel = createOllama({
  baseURL: 'http://localhost:11434'
})

const systemPrompt = `
  You are a helpful assistant named Synapse, you are a PDF viewer assistant that can answer questions about the document and can navigate PDF pages using tools.
  You can use the following tools to navigate the PDF:
  - setCurrentPage: to set the current page in the PDF viewer
  - getTotalPages: to get the total number of pages in the PDF viewer
  - getPDFInfo: to get the PDF information
  First, you should get the PDF information using the getPDFInfo tool before greeting the user.
  Then, you can use the other tools to navigate the PDF.
`

type ToolAgentDeps = {
  setCurrentPage: (page: number) => void
  getPDFInfo: () => { currentPage: number; totalPages: number; filePath: string }
  getTotalPages: () => number
}

export const createToolLoopAgent = (deps: ToolAgentDeps): ToolLoopAgent<never, ToolSet, never> => {
  return new ToolLoopAgent({
    model: openRouterProvider('openrouter/free'),
    // model : ollamaModelProvider('llama3.2:1b'),
    instructions: systemPrompt,
    tools: createTools(deps)
  })
}
