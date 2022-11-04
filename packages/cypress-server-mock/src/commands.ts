/// <reference types="cypress" />

import { MockConfig } from "./types";

declare global {
  namespace Cypress {
    interface Chainable {
      serverMock(config: MockConfig): Chainable
    }
  }
}

const getDefaultApiPath = () => `${window.location.host}/api/mock`


Cypress.Commands.add("serverMock", (config: MockConfig) => {
  const { apiPath = getDefaultApiPath(), ...rest } = config;
  cy.request({
    url: `${apiPath}/create`,
    method: "POST",
    body: JSON.stringify(rest),
  });
});

