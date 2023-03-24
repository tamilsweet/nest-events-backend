## Events Application

### For Database ORM
```
npm install --save @nestjs/typeorm typeorm mysql
```
### For Validations
```
npm install --save class-validator class-transformer
```

### For Configurations
```
npm install --save @nestjs/config
```

### For Authentication
### Local Strategy
```
npm install --save @nestjs/passport passport passport-local
npm install --save-dev @types/passport-local
```
### JWT Strategy
```
npm install --save @nestjs/jwt passport-jwt
npm install --save-dev @types/passport-jwt
```

### Encryption
```
npm install --save bcrypt
npm install --save-dev @types/bcrypt
```

### For Testing
```
npm install --save-dev @nestjs/testing @nestjs/mapped-types
```

### For Swagger
```
npm install --save @nestjs/swagger swagger-ui-express
```

### Generate Module
```
nest generate module events
```

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Troubleshoting

Issue:
```
Error: ER_NOT_SUPPORTED_AUTH_MODE: Client does not support authentication protocol requested by server; consider upgrading MySQL client
```
Fix:
Restart mysql docker container

