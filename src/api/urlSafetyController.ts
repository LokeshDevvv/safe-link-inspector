
import { UrlSafetyService } from '@/services/urlSafetyApi';
import { z } from 'zod';

// Input validation schema
const UrlSchema = z.object({
  url: z.string().url('Invalid URL format')
});

export class UrlSafetyController {
  static async analyzeUrl(req: Request) {
    try {
      const { url } = UrlSchema.parse(await req.json());
      const result = await UrlSafetyService.analyzeUrl(url);
      
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return new Response(JSON.stringify({
          error: 'Invalid input',
          details: error.errors
        }), { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      return new Response(JSON.stringify({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  static async quickCheck(req: Request) {
    try {
      const { url } = UrlSchema.parse(await req.json());
      const result = await UrlSafetyService.quickCheck(url);
      
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return new Response(JSON.stringify({
          error: 'Invalid input',
          details: error.errors
        }), { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      return new Response(JSON.stringify({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
}
