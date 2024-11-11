import type { FetchError } from 'ofetch'
import type { Notification } from '#notifications/types/notifications'

interface ErrorPattern {
  pattern: RegExp
  title: string
  message: (matches: RegExpMatchArray) => string
}

const errorPatterns: Record<number, ErrorPattern[]> = {
  409: [
    {
      pattern: /name "\/(.+?)" is already in use by container/,
      title: 'Name Conflict',
      message: (matches) => 
        `The container name '${matches[1]}' is already in use by another container. Please remove or rename the existing container to reuse the name.`
    }
  ],
  500: [
    {
      pattern: /'(.+?)'/,
      title: 'Invalid Volume',
      message: (matches) => `Invalid mount path: ${matches[1]}`
    }
  ]
} as const

/**
 * Handles Docker-specific errors and converts them to user-friendly notifications
 * @param error The fetch error from the API call
 * @returns A formatted notification object
 */
export const handleDockerErrors = (error: FetchError): Notification => {
  const statusCode = error.statusCode
  const errorMessage = error.message

  // If we have patterns for this status code, try to match them
  if (statusCode && typeof statusCode === 'number' && statusCode in errorPatterns) {
    // Type assertion to help TypeScript understand the patterns will exist
    const patterns = errorPatterns[statusCode] as ErrorPattern[]
    for (const pattern of patterns) {
      const matches = errorMessage.match(pattern.pattern)
      
      if (matches) {
        return {
          title: pattern.title,
          message: pattern.message(matches),
          level: 'error'
        }
      }
    }
  }

  // Default error if no patterns match
  return {
    title: 'Unknown Error',
    message: errorMessage,
    level: 'error'
  }
}
