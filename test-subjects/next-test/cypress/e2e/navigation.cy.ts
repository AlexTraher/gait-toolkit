
describe('Content mocking', () => {
  it('passes when mocking first test', () => {
    cy.mockServerUrl({
      apiPath: "http://localhost:3000/api/mock",
      basePath: "http://localhost:3000",
      path: "/api/hello",
      method: "GET",
      response: {
        statusCode: 200,
        data: { content: "fake content" },
      }
    })

    cy.visit('http://localhost:3000');
    cy.get('h1').contains('fake content').should('be.visible');
  });

  it('shows the correct content when restored', () => {
    cy.mockServerUrl({
      apiPath: "http://localhost:3000/api/mock",
      basePath: "http://localhost:3000",
      path: "/api/hello",
      method: "GET",
      response: {
        statusCode: 200,
        data: { content: "fake content" },
      }
    })

    cy.visit('http://localhost:3000');
    cy.get('h1').contains('fake content').should('be.visible');

    cy.restoreServerMocks();

    cy.visit('http://localhost:3000');
    cy.get('h1').contains('Real content').should('be.visible');

  });

  afterEach(() => {
    cy.restoreServerMocks();
  });

  it('should mock multiple times', () => {
    cy.mockServerUrl({
      apiPath: "http://localhost:3000/api/mock",
      basePath: "http://localhost:3000",
      path: "/api/hello",
      method: "GET",
      response: {
        statusCode: 200,
        data: { content: "fake content" },
      }
    });
    

    cy.mockServerUrl({
      apiPath: "http://localhost:3000/api/mock",
      basePath: "http://localhost:3000",
      path: "/api/hello",
      method: "GET",
      response: {
        statusCode: 200,
        data: { content: "fake content 2" },
      }
    });

    cy.visit('http://localhost:3000');
    cy.get('h1').contains('fake content').should('be.visible');

    cy.visit('http://localhost:3000');
    cy.get('h1').contains('fake content 2').should('be.visible');

    cy.visit('http://localhost:3000');
  })
})

export {}