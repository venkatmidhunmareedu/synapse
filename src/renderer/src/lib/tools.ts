import { tool, type ToolSet } from 'ai'
import z from 'zod'
import { queryPDFFile } from './api'

type ToolDeps = {
  setCurrentPage: (page: number) => void
  getTotalPages: () => number
  getPDFInfo: () => { currentPage: number; totalPages: number; filePath: string }
}

export const createTools = ({ setCurrentPage, getTotalPages, getPDFInfo }: ToolDeps): ToolSet => {
  const tools = {
    setCurrentPage: tool({
      description: 'Set the current page in the PDF viewer',
      inputSchema: z.object({
        page: z.number().int().positive().describe('Page number to navigate to')
      }),
      execute: async ({ page }: { page: number }) => {
        const totalPages = getTotalPages()
        const nextPage = totalPages > 0 ? Math.min(page, totalPages) : page
        setCurrentPage(nextPage)
        return `Moved to page ${nextPage}${totalPages > 0 ? ` of ${totalPages}` : ''}.`
      }
    }),
    getPDFInfo: tool({
      description: 'Get the PDF information',
      inputSchema: z.object({}),
      execute: async () => {
        const { currentPage, totalPages, filePath } = getPDFInfo()
        return `PDF information: ${currentPage} of ${totalPages} in ${filePath}.`
      }
    }),
    queryPDF: tool({
      description: 'Query the PDF',
      inputSchema: z.object({
        query: z.string().describe('The query to search for')
      }),
      execute: async ({ query }: { query: string }) => {
        return await queryPDFFile(query, getPDFInfo().filePath)
      }
    })
  } satisfies ToolSet

  return tools
}
