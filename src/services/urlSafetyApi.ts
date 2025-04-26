
import { UrlSafetyResult, checkUrlResponse, checkDomainAge, checkSuspiciousPatterns, checkDomainSimilarity, assessUrlSafety } from '@/utils/urlChecker';

/**
 * URL Safety Check Service
 * This can be used as a foundation for both API endpoints and browser extension
 */
export class UrlSafetyService {
  /**
   * Analyze URL safety with detailed results
   */
  static async analyzeUrl(url: string): Promise<UrlSafetyResult> {
    try {
      // Use the existing assessUrlSafety function
      const result = await assessUrlSafety(url);
      
      // Add API-specific metadata
      return {
        ...result,
        timestamp: new Date().toISOString(),
        apiVersion: '1.0.0'
      };
    } catch (error) {
      console.error('Error in URL safety analysis:', error);
      throw new Error('Failed to analyze URL safety');
    }
  }

  /**
   * Quick check for URL safety (simplified response)
   */
  static async quickCheck(url: string): Promise<{
    safe: boolean;
    score: number;
    message: string;
  }> {
    try {
      const result = await this.analyzeUrl(url);
      return {
        safe: result.safe,
        score: result.score,
        message: result.message
      };
    } catch (error) {
      console.error('Error in quick URL check:', error);
      throw new Error('Failed to perform quick URL check');
    }
  }
}

// Export types for API responses
export type UrlAnalysisResponse = Awaited<ReturnType<typeof UrlSafetyService.analyzeUrl>>;
export type QuickCheckResponse = Awaited<ReturnType<typeof UrlSafetyService.quickCheck>>;

