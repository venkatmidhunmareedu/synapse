import { ToolLoopAgent } from 'ai'
import { ollama } from 'ai-sdk-ollama'

export const toolLoopAgent = new ToolLoopAgent({
  model: ollama('qwen3.5:2b'),
  instructions: 'You are a helpful assistant that can answer questions about the document.',
  tools: {}
})
