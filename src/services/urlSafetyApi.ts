
import { UrlSafetyResult } from "@/utils/urlChecker";

export class UrlSafetyService {
  private static API_ENDPOINT = 'https://your-api-url.com';
  private static API_KEY = 'your-api-key';

  static async checkUrl(url: string): Promise<UrlSafetyResult> {
    try {
      const response = await fetch(`${this.API_ENDPOINT}/api/url/quick-check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': this.API_KEY
        },
        body: JSON.stringify({ url })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return await response.json();
      
    } catch (error) {
      console.error("Error checking URL:", error);
      
      // Return an error result
      return {
        url,
        status: "ERROR",
        score: 0,
        message: "Failed to check URL safety. Please try again later.",
        domainAge: 0,
        suspiciousReasons: []
      };
    }
  }

  static async analyzeUrl(url: string): Promise<UrlSafetyResult> {
    try {
      const response = await fetch(`${this.API_ENDPOINT}/api/url/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': this.API_KEY
        },
        body: JSON.stringify({ url })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return await response.json();
      
    } catch (error) {
      console.error("Error analyzing URL:", error);
      
      return {
        url,
        status: "ERROR",
        score: 0,
        message: "Failed to analyze URL. Please try again later.",
        domainAge: 0,
        suspiciousReasons: []
      };
    }
  }

  static async quickCheck(url: string): Promise<UrlSafetyResult> {
    return this.checkUrl(url); // Reuse existing method for quick check
  }
}
