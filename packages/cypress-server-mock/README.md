# Cypress Server Mock

A tool for full stack mocking in cypress tests

## Installation

`npm i @gait-tools/cypress-server-mock`

## Usage

The package comes in 2 parts:
1. The cypress command
2. The api route called to implement mocking on the server

To use the cypress command add the following to your `support/commands.ts` file:

`import "@gait-tools/cypress-server-mock/commands";`

Currently only Next is supported.

Add a capture all api route under `/pages/api/mock/` e.g. `/pages/api/mock/[...mock].ts`.

Inside that file you can either export a pre-configured mock handler e.g.: 

```typescript
import { undiciHandler } from "@gait-tools/cypress-server-mock";
const opts = { 
   createApiPath: "string";
   restoreApiPath: "string";
   ...rest // opts specific to the custom handler - see typing for more details here
} 

export default undiciHandler(opts);
```

or build out your own handler: 

```typescript
import { createHandler } from "@gait-tools/cypress-server-mock";

export default createHandler({
   createHandler: async (mockConfig) => {
    // function to create your mocks
   },
    restoreHandler: async () => {
      // function to restore your mocks 
    },
    /** optional path your mocking create endpoint sits on.
     * defaults to `api/mock/create`
     */
    createApiPath: "string"; 
    /** optional path your mocking restore endpoint sits on.
     * defaults to `api/mock/restore`
     */
    restoreApiPath: "string";
});
```

You can then use the cypress server mock in your tests:
```typescript
it('should give me fake content', () => {
  cy.mockServerUrl({
    apiPath: "http://localhost:3000/api/mock", // the path to your mocking endpoints
    basePath: "http://external-service.company.com", // the path you want to mock
    path: "/content",
    method: "GET",
    response: {
      statusCode: 200,
      data: { content: "fake content" },
    }
  })
  
  cy.visit('http://localhost:3000');
})

afterEach(() => {
  cy.restoreServerMocks();
})
```

## Security
We are looking at implementing a default block such that these routes are not available in production builds, however we currently do not have that functionality.
 Ensure you only have these mocking routes for development/testing builds.

## Limitations
- Currently we only support NextJS routes
- We only allow you to mock api requests at the moment, but do not allow you to verify that a route was called
- These routes are currently available in production, we are looking to limit that

