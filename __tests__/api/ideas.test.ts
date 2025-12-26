import { GET, POST } from '@/app/api/ideas/route';
import connectToDatabase from '@/lib/db';
import { Idea } from '@/lib/models';
import { createMocks } from 'node-mocks-http';

jest.mock('@/lib/db');
jest.mock('@/lib/models');

describe('/api/ideas', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('GET returns ideas list', async () => {
    const { req } = createMocks({
      method: 'GET',
      nextUrl: {
        searchParams: new URLSearchParams(),
      }
    });

    (connectToDatabase as jest.Mock).mockResolvedValue(true);
    (Idea.find as jest.Mock).mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockResolvedValue([
        { title: 'Test Idea', status: 'seed' }
      ])
    });

    // @ts-ignore - NextRequest mock limited
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveLength(1);
    expect(data[0].title).toBe('Test Idea');
  });

  test('POST creates a new idea', async () => {
    const { req } = createMocks({
      method: 'POST',
      body: {
        title: 'New Idea',
      }
    });
    // mock json method for NextRequest
    req.json = jest.fn().mockResolvedValue({ title: 'New Idea' });

    (connectToDatabase as jest.Mock).mockResolvedValue(true);
    (Idea.create as jest.Mock).mockResolvedValue({
      _id: '123',
      title: 'New Idea',
      status: 'seed'
    });

    // @ts-ignore 
    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.title).toBe('New Idea');
  });
});
