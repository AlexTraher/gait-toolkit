
describe('empty spec', () => {
  it('passes', () => {
    cy.serverMock({
      apiPath: "http://localhost:3000/api/mock",
      basePath: "http://localhost:3001",
      path: "/content",
      method: "GET",
      response: {
        statusCode: 200,
        data: { content: "fake else" },
      }
    })

    cy.visit('http://localhost:3000');
  })
})

export {}