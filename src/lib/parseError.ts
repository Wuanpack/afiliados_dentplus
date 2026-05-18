import { ZodError } from 'zod'

export const formatZodErrors = (error: ZodError): Record<string, string> =>
  Object.fromEntries(
    error.issues.map(e => [e.path.join('.'), e.message])
  )