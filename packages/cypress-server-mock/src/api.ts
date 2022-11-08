
import { getUndiciCreateMockHandler, getUndiciRestoreMockHandler } from './api/undici';
import createHandler from './api/create-handler';
import { UndiciPredefinedHandlerConfig } from './types';


export const undiciHandler = (partialConfig?: UndiciPredefinedHandlerConfig) => createHandler({
  createHandler: getUndiciCreateMockHandler(partialConfig),
  restoreHandler: getUndiciRestoreMockHandler(partialConfig),
  createApiPath: partialConfig?.createApiPath,
  restoreApiPath: partialConfig?.restoreApiPath,
});

export { default as createHandler } from "./api/create-handler";
