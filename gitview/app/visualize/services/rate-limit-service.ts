import { RateLimitError } from '../utils/errors'

interface RateLimitInfo {
  remaining: number
  reset: number
  limit: number
}

export class RateLimitService {
  private static instance: RateLimitService
  private rateLimitInfo: RateLimitInfo = {
    remaining: 5000, // GitHub's default rate limit
    reset: 0,
    limit: 5000
  }
  private retryCount: number = 0
  private readonly MAX_RETRIES = 3

  private constructor() {}

  public static getInstance(): RateLimitService {
    if (!RateLimitService.instance) {
      RateLimitService.instance = new RateLimitService()
    }
    return RateLimitService.instance
  }

  public updateRateLimitInfo(headers: Headers): void {
    const remaining = headers.get('x-ratelimit-remaining')
    const reset = headers.get('x-ratelimit-reset')
    const limit = headers.get('x-ratelimit-limit')

    this.rateLimitInfo = {
      remaining: remaining ? parseInt(remaining) : this.rateLimitInfo.remaining,
      reset: reset ? parseInt(reset) : this.rateLimitInfo.reset,
      limit: limit ? parseInt(limit) : this.rateLimitInfo.limit
    }
  }

  public async checkRateLimit(): Promise<void> {
    if (this.rateLimitInfo.remaining <= 0) {
      const now = Math.floor(Date.now() / 1000)
      if (now < this.rateLimitInfo.reset) {
        const resetTime = new Date(this.rateLimitInfo.reset * 1000).toLocaleTimeString()
        throw new RateLimitError(`GitHub API rate limit exceeded. Limit will reset at ${resetTime}`)
      }
    }
  }

  public async executeWithRetry<T>(
    apiCall: () => Promise<T>,
    errorHandler?: (error: any) => Promise<void>
  ): Promise<T> {
    try {
      await this.checkRateLimit()
      const result = await apiCall()
      this.retryCount = 0 // Reset retry count on successful call
      return result
    } catch (error) {
      if (error instanceof RateLimitError) {
        if (this.retryCount < this.MAX_RETRIES) {
          this.retryCount++
          const delay = Math.pow(2, this.retryCount) * 1000 // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, delay))
          return this.executeWithRetry(apiCall, errorHandler)
        }
      }
      if (errorHandler) {
        await errorHandler(error)
      }
      throw error
    }
  }

  public getRateLimitInfo(): RateLimitInfo {
    return { ...this.rateLimitInfo }
  }
}