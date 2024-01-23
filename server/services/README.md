# Services

Services are used to organize functions and utilities a bit better than just packing them all inside of utils.

## Standards

- `index.ts` - Functions that will be used by other services should be exported here. When importing a dependency from another service, add `// Service Dependency Imports` above the section so it's easily visible.
- `actions.ts` - Functions that perform operations (ie. reading/writing files, generating secrets, modifying containers) should go here.
- `formatter.ts` - Functions that are used to make data more readable/standardized should go here.
- When importing a function into a utility or api route, please import it directly from the file that the function is declared in. This will make it easier to track down if there's an error
