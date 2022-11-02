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