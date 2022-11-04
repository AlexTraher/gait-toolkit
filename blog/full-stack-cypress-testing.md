# Full Stack Testing with Cypress and NextJS

[Take me to the code](#nextjs-setup-to-allow-isomorphic-mocking)

Over the past few years we have seen the web ecosystem move increasingly towards executing code on the server. The advent and popularity of tools like Next.JS and Remix, as well as the features in React 18 really emphasise this.

## The web has got better as a result
We're building faster, more accessible web applications _Some stats here_.

However, this improvement comes at a cost...

## We have code that runs in more places
After many years of SPAs and running almost all our code on the browser, we have seemingly come full circle and are now back to trying to run as much of our code as possible on the server. Kent C. Dodds has a [great article](LINK) on how the web has changed over the years.

Code running in more places makes mocking in tools like Cypress that much more complicated as our former method of intercepting browser HTTP requests means we end up bypassing half our code!

Utilising popular node mocking libraries and Next.JS's built in API routes we can

## NextJS setup to allow isomorphic mocking with Cypress
You can see the full code example [here](LINK).

Cypress allows us to mock client requests using `cy.intercept`. We want to be able to run a similar command to mock HTTP calls made _from_ the server. We can do this will a tool like `nock`, or `undici`'s built in mocking'.

in order to get this to work we'll need to have a way to communicate between the client and the server when cypress is running.

With nextJS we can create an api route to handle this, lets create a new file `/api/mock.ts` with the following contents: 

TODO - check this

```ts
interface Data {
  message: string;
}

interface Error {
  error: string;
}

// Actual values will depend on your mocking requirements
export interface MockConfig {
  path: string;
  method: "GET" | "POST"
  resBody: record<string, any>
}

export default async function handler({
  req: NextApiRequest,
  res: NextApiResponse<Data | Error>
}) {
  const mockConfig = JSON.parse(req.body) as MockConfig;

  // Now set up your mocking config as per your mocking requirements
  fetch.mock(mockConfig.path, mockConfig.method)
    .reply(mockConfig.resBody);

  return res.status(200).json({ message: "ok" });
}
```

We can call this code from our Cypress code in a custom command. In `cypress/commands.ts` We can add: 

```ts
Cypress.command.add('interceptServer', (mockConfig: MockConfig) => {
  cy.request({
    url: '/api/mock',
    method: "POST",
    body: JSON.stringify(mockConfig)
  });
});
```

We're now set up to start using our command in our cypress tests. Lets take a simple NextJS page that loads a blog post from an external data source in `getServerSideProps`:

```ts
describe("Page load with Server Calls", () => {
  beforeEach(() => {
    const mockPost = {
      postId: '1234',
      author: 'alex@gait.dev',
      title: 'just another post'
    }

    cy.interceptServer({
      path: 'https://external-blog.com/1234',
      method: 'GET',
      resBody: mockPost
    });
  });

  it('should load a post', () => {
    cy.visit('/posts/1234');

    cy.get('h1').contains('just another post').toBeVisible();
  });

});
```

That's all you need to get a very basic example set up. However, those eagle eyed amoung you will notice we're missing a few key things: 

## Lets not leak test state
At the moment, we're doing nothing to reset our mocks between each test, so we'd be getting our mock blog post for the entire time we're running these tests. Even worse, it could persist for the lifetime of your server process depending on your mocking setup.

In order to fix that, we ought to set up another endpoint to reset our tests. lets change our mocking api folder a little: 
```ts
//before
pages/
  api/
    mock.ts

// after
pages/
  api/
    mock/
      index.ts // same content as mock.ts
      reset.ts
```

lets populate our new `reset.ts` file: 

```ts
export default async function handler({
  req: NextApiRequest,
  res: NextApiResponse<Data | Error>
}) {

  // Rest your mocks as per your chosen mocking library
  fetch.mock.reset();

  res.status(200).reply({ message: "ok" });
}
```

We also need to create a new command to reset our server:

```ts
Cypress.command.add('resetServerIntercept', () => {
  cy.request({
    url: '/api/mock/reset',
    method: "POST",
  });
});
```

And to run that command in our tests:

```ts
describe("Page load with Server Calls", () => {
  beforeEach(() => {
    const mockPost = {
      postId: '1234',
      author: 'alex@gait.dev',
      title: 'just another post'
    }

    cy.interceptServer({
      path: 'https://external-blog.com/1234',
      method: 'GET',
      resBody: mockPost
    });
  });

  afterEach(() => {
    cy.resetServerIntercept();
  });

  it('should load a post', () => {
    cy.visit('/posts/1234');

    cy.get('h1').contains('just another post').toBeVisible();
  });

});
```

Nice - no more leaking tests!

## Make it secure
Our current implementation has a pretty gaping security hole - anybody can hit our api and mock any of our endpoints - which is probably not ideal. Luckily, with a little bit of work we can resolve this!

Firstly, lets add an environment variable to our node process so we can know whether we are running tests or not in our `package.json`:

```json
...
"dev": "CI=true next dev"
...
```

We can utilise this to secure our endpoints: 

```ts

export default async function handler({
  req: NextApiRequest,
  res: NextApiResponse<Data | Error>
}) {

  // Add this code for all the mocking endpoints
  if (!process.env.CI || process.env.NODE_ENV === "production") {
    return res.status(404).send();
  }

  // Rest your mocks as per your chosen mocking library
  fetch.mock.reset();

  res.status(200).json({ message: "ok" });
}
```

This means that this endpoint will return a 404 for any calls to a production build, or to a build where the `CI` env variable isn't set.

You can take this further by limiting to a subset of authenticated users, or with a token depending on your circumstances.

And that's it - we can use the power of our server to help make it easier for us to mock out our application tests with Cypress! 


## Bonus - verification of server side rendering















