import path from 'path'

export function getFileName(filePath: string): string {
  return path.basename(filePath, path.extname(filePath))
}

/** LanceDB table names: alphanumeric, `_`, `-`, and `.` only (no spaces). */
export function generateFileNameWithForbiddenCharacters(fileName: string): string {
  const sanitized = fileName
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^\w.-]/g, '')
  return sanitized.length > 0 ? sanitized : 'table'
}
