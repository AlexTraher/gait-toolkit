import type { NextApiRequest, NextApiResponse } from 'next'
import { MockAgent, setGlobalDispatcher } from 'undici';
import { MockConfig } from './types';

type Data = {
  message: string
}

const createOrGetAgent = (() => {
  let agent: MockAgent;

  return () => {
    if (agent) {
       return agent;
    }

    agent = new MockAgent();
    agent.disableNetConnect();
    setGlobalDispatcher(agent);
    return agent;
  }
})();

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { basePath, response, ...config } = JSON.parse(req.body) as MockConfig;
  const agent = createOrGetAgent();
  const client = agent.get(basePath);

  client
    .intercept(config)
    .reply(response.statusCode, response.data);

  res.status(200).json({ message: 'ok' })
}
