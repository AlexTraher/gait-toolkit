/// <reference types="cypress" />

import { MockConfig } from "./types";

declare global {
  namespace Cypress {
    interface Chainable {
      mockServerUrl(config: MockConfig): Chainable
      restoreServerMocks(apiPath?: string): Chainable
    }
  }
}

const getDefaultApiPath = () => `${window.location.host}/api/mock`


Cypress.Commands.add("mockServerUrl", (config: MockConfig) => {
  const { apiPath = getDefaultApiPath(), ...rest } = config;
  cy.request({
    url: `${apiPath}/create`,
    method: "POST",
    body: JSON.stringify(rest),
  });
});

Cypress.Commands.add("restoreServerMocks", (apiPath = getDefaultApiPath()) => {
  cy.request({
    url: `${apiPath}/restore`,
    method: "POST",
  });
});

