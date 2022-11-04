import type { NextApiRequest, NextApiResponse } from 'next'
import { MockConfig, MockHandler } from './types';
import undiciMockHandler from './api/undici';

type Data = {
  message: string
}

export const createHandler = (mockHandler: MockHandler) => async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const config = JSON.parse(req.body) as MockConfig;
  await mockHandler(config);

  res.status(200).json({ message: 'ok' })
}

export const undiciHandler = createHandler(undiciMockHandler);




