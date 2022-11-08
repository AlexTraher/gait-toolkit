import type { NextApiRequest, NextApiResponse } from 'next'
import { HandlerConfig, MockConfig } from '../types';

type Data = {
  message: string
}

const DEFAULT_CREATE_PATH = "/api/mock/create";
const DEFAULT_RESTORE_PATH = "/api/mock/restore"

const createHandler = (handlerConfig: HandlerConfig) => async (
  req: NextApiRequest,
  res: NextApiResponse<Data | string>
) => {

  if (req.method !== "POST") {
    return res.status(405).send("method not allowed");
  }

  const createPath = handlerConfig.createApiPath ?? DEFAULT_CREATE_PATH;
  const restorePath = handlerConfig.restoreApiPath ?? DEFAULT_RESTORE_PATH;

  switch (req.url) {
    case createPath: {
      const config = JSON.parse(req.body) as MockConfig;
      await handlerConfig.createHandler(config);
      return res.status(200).send("ok");
    }

    case restorePath: {
      await handlerConfig.restoreHandler();
      return res.status(200).send("ok");
    }

    default: {
      return res.status(404).send("not found");
    } 
  }

}

export default createHandler;