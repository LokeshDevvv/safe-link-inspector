
import { UrlSafetyController } from './urlSafetyController';

export const routes = [
  {
    path: '/api/url/analyze',
    method: 'POST',
    handler: UrlSafetyController.analyzeUrl
  },
  {
    path: '/api/url/quick-check',
    method: 'POST',
    handler: UrlSafetyController.quickCheck
  }
];
