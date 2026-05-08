export type KBS = {
  label: string
  commands: string[]
  action?: () => void
}

export enum EMBEDDING_STATUS {
  CHUNKING = 'CHUNKING',
  EMBEDDING = 'EMBEDDING',
  EMBEDDED = 'EMBEDDED',
  ERROR = 'ERROR',
  IDLE = 'IDLE'
}

export enum OLLAMA_STATUS {
  STARTING = 'STARTING',
  RUNNING = 'RUNNING',
  STOPPED = 'STOPPED'
}


// Icons base type
export type IconProps = {
  color?: string, 
  size?: number, 
  strokeWidth?: number,
} & React.SVGProps<SVGSVGElement>