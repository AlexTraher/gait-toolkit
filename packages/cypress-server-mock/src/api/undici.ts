import { MockAgent, MockClient, setGlobalDispatcher } from "undici";
import { CreateMockHandler, RestoreMockHandler, UndiciPredefinedHandlerConfig } from "../types"

let teardowns: (() => Promise<void>)[] = [];
const createOrGetAgent = (() => {
  let client: MockClient | null;

  return (basePath: string, disableNetConnect: boolean = true) => {
    if (client) {
       return client;
    }

    const agent = new MockAgent({ connections: 1 });
    if(disableNetConnect) {
      agent.disableNetConnect();
    }
    setGlobalDispatcher(agent);
    client = agent.get<MockClient>(basePath);

    teardowns.push(async () => {
      agent.deactivate();
      client = null;

    })
    return client;
  }
})();

export const getUndiciCreateMockHandler: (undiciConfig?: UndiciPredefinedHandlerConfig) => CreateMockHandler = (undiciConfig) => (mockConfig) => {
  console.log('creating agent');
  const { basePath, response, ...config } = mockConfig;
  const client = createOrGetAgent(basePath, undiciConfig?.disableNetConnect);
  
  client
    .intercept(config)
    .reply(response.statusCode, response.data);
}

export const getUndiciRestoreMockHandler: (undiciConfig?: UndiciPredefinedHandlerConfig) => RestoreMockHandler = () => async () => {
  console.log('killing agent');
  if (!teardowns.length) {
    console.warn("You have called `restore mock` when no mock has been configured");
    return;
  }
  await Promise.all(teardowns.map((t) => t()));
}

