import { tool } from 'ai'
import z from 'zod'

export const tools = {
  greet: tool({
    description: 'Greet the user',
    inputSchema: z.object({
      name: z.string().describe('The name of the user')
    }),
    execute: async ({ name }: { name: string }) => {
      return `Hello, ${name}!`
    }
  }),
  weather: tool({
    description: 'Get the weather for a given city',
    inputSchema: z.object({
      city: z.string().describe('The city to get the weather for')
    }),
    execute: async ({ city }: { city: string }) => {
      return `The weather in ${city} is sunny.`
    }
  })
}
