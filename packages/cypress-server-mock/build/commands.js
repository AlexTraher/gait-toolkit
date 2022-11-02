"use strict";
/// <reference types="cypress" />
Object.defineProperty(exports, "__esModule", { value: true });
const getDefaultApiPath = () => `${window.location.host}/api/mock`;
Cypress.Commands.add("serverMock", (config) => {
    const { apiPath = getDefaultApiPath(), ...rest } = config;
    cy.request({
        url: `${apiPath}/create`,
        method: "POST",
        body: JSON.stringify(rest),
    });
});
