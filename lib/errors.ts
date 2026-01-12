/**
 * Standardized error handling utilities for server actions
 */

export type ActionResult<T = void> = 
  | { success: true; data?: T }
  | { success: false; error: string }

/**
 * Creates a success result
 */
export function success<T>(data?: T): ActionResult<T> {
  return { success: true, data }
}

/**
 * Creates an error result
 */
export function error(message: string): ActionResult {
  return { success: false, error: message }
}

/**
 * Handles errors and returns standardized error response
 */
export function handleError(err: unknown, defaultMessage: string): ActionResult {
  if (err instanceof Error) {
    // In production, log to proper logging service
    if (process.env.NODE_ENV === 'development') {
      console.error(defaultMessage, err)
    }
    return { success: false, error: defaultMessage }
  }
  
  if (process.env.NODE_ENV === 'development') {
    console.error(defaultMessage, err)
  }
  
  return { success: false, error: defaultMessage }
}

/**
 * Validates user authentication
 */
export function requireAuth(user: { id: string } | null): asserts user is { id: string } {
  if (!user) {
    throw new Error('Unauthorized')
  }
}
