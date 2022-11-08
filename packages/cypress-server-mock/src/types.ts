import type { MockInterceptor } from "undici/types/mock-interceptor"


interface BaseConfig {
  basePath: string,
  apiPath: string,
  response: {
    statusCode: number,
    data: Record<string, any>
  },
}

export type MockConfig = BaseConfig & MockInterceptor.Options;

export type CreateMockHandler = (mockConfig: MockConfig) => void | Promise<void>

export type RestoreMockHandler = () => void | Promise<void>

export interface HandlerConfig {
  createHandler: CreateMockHandler,
  restoreHandler: RestoreMockHandler,
  createApiPath?: string;
  restoreApiPath?: string;
}

export type PredefinedHandlerConfig = Omit<HandlerConfig, "createHandler" | "restoreHandler">

export interface UndiciPredefinedHandlerConfig extends PredefinedHandlerConfig {
  disableNetConnect?: boolean;
}
