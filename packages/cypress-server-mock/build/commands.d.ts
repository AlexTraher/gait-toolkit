import { MockConfig } from "./types";
declare global {
    namespace Cypress {
        interface Chainable {
            serverMock(config: MockConfig): Chainable;
        }
    }
}
