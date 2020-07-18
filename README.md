# typescript-serverless
Base template for serverless framework with typescript, eslint, jest preconfigured and SNS offline working.

This repository comes pre-configured with some common tools and configuration for working serverless frameowrk and Typescript with AWS.

## Serverless Plugins
  - serverless-webpack
  - serverless-iam-roles-per-function
  - serverless-prune-plugin
  - serverless-offline
  - serverless-offline-sns

### Linting
- eslint
- eslint-config-airbnb-base
- typescript-eslint
- eslint-plugin-import
- @typescript-eslint/eslint-plugin
- @typescript/eslint-parser
- eslint-import-resolver-alias
- eslint-plugin-module-resolver

### Testing
- jest
- babel-jest
- @babel/core
- @babel/preset-env
- @babel/preset-typescript

A default test is included to verify that jest is configured correctly
```
describe('who tests the tests?', () => {
  it('can run a test', () => {
    expect.hasAssertions();
    expect(1).toBe(1);
  });
});
```

### Module Aliasing
Everything comes configured out the box to leverage module aliasing. 3 example aliases have been preconfigured.

Aliases must be defined in webpack, tsconfig, and eslint

webpack:
```
resolve: {
  extensions: ['.mjs', '.json', '.ts'],
  symlinks: false,
  cacheWithContext: false,
  alias: {
    '@src': path.resolve(__dirname, './src'),
    '@tests': path.resolve(__dirname, './tests'),
  },
},
```

tsconfig:
```
"paths": {
  "@src/*": ["src/*"],
  "@tests/*": ["tests/*"]
}
```

eslint:
```
"settings": {
  "import/resolver": {
    "alias": {
      "map": [
        ["@src", "./src"],
        ["@tests", "./tests"],
      ],
      "extensions": [
        ".ts",
        ".js"
      ]
    }
  }
}
```
