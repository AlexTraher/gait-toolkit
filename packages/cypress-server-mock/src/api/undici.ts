import { MockAgent, setGlobalDispatcher } from "undici";
import { MockHandler } from "../types"

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

const undiciHandler: MockHandler = (mockConfig) => {

  const { basePath, response, ...config } = mockConfig;
  const agent = createOrGetAgent();
  const client = agent.get(basePath);

  client
    .intercept(config)
    .reply(response.statusCode, response.data);
}



export default undiciHandler;