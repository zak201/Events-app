import { securityMiddleware } from '@/middleware/security';
import { AppError } from '@/lib/error';

describe('Security Middleware', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockReq = {
      body: {},
      headers: {}
    };
    mockRes = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  test('should add security headers', async () => {
    await securityMiddleware(mockReq, mockRes);
    
    expect(mockRes.setHeader).toHaveBeenCalledWith(
      'X-Content-Type-Options',
      'nosniff'
    );
  });
}); 