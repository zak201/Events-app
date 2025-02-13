import { globalCache, getCachedData } from '@/lib/cache';

describe('Cache', () => {
  beforeEach(() => {
    globalCache.clear();
  });

  test('should cache and retrieve data', async () => {
    const mockFetcher = jest.fn().mockResolvedValue({ data: 'test' });
    const key = 'test-key';

    const result1 = await getCachedData(key, mockFetcher);
    const result2 = await getCachedData(key, mockFetcher);

    expect(result1).toEqual({ data: 'test' });
    expect(result2).toEqual({ data: 'test' });
    expect(mockFetcher).toHaveBeenCalledTimes(1);
  });
}); 