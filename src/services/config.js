import { API_ACCESS_TOKEN, API_RETRY_COUNT, API_TIMEOUT, API_URL } from "./env"

/**
 * The default configuration for the app.
 */

export const DEFAULT_API_CONFIG = {
  url: API_URL,
  timeout: parseInt(API_TIMEOUT, 10),
  maxRetries: parseInt(API_RETRY_COUNT, 10),
  accessToken: API_ACCESS_TOKEN
}
