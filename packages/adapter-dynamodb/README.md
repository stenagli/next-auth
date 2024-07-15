<p align="center">
  <br/>
  <a href="https://authjs.dev" target="_blank">
    <img height="64px" src="https://authjs.dev/img/logo-sm.png" />
  </a>
  <a href="https://aws.amazon.com/dynamodb" target="_blank">
    <img height="64px" src="https://authjs.dev/img/adapters/dynamodb.svg"/>
  </a>
  <h3 align="center"><b>DynamoDB Adapter</b> - NextAuth.js / Auth.js</a></h3>
  <p align="center" style="align: center;">
    <a href="https://npm.im/@stenagli/dynamodb-adapter">
      <img src="https://img.shields.io/badge/TypeScript-blue?style=flat-square" alt="TypeScript" />
    </a>
    <a href="https://npm.im/@stenagli/dynamodb-adapter">
      <img alt="npm" src="https://img.shields.io/npm/v/@stenagli/dynamodb-adapter?color=green&label=@stenagli/dynamodb-adapter&style=flat-square">
    </a>
    <a href="https://www.npmtrends.com/@stenagli/dynamodb-adapter">
      <img src="https://img.shields.io/npm/dm/@stenagli/dynamodb-adapter?label=%20downloads&style=flat-square" alt="Downloads" />
    </a>
    <a href="https://github.com/stenagli/next-auth/stargazers">
      <img src="https://img.shields.io/github/stars/stenagli/next-auth?style=flat-square" alt="GitHub Stars" />
    </a>
  </p>
</p>

---
A fork of the [`@auth/dynamodb-adapter`](https://www.npmjs.com/package/@next-auth/dynamodb-adapter) package with the following improvements:
- [WebAuthn](https://authjs.dev/getting-started/authentication/webauthn) support
- Usage of the bare-bones AWS DynamoDB client to [reduce size and improve performance](https://aws.amazon.com/blogs/developer/modular-packages-in-aws-sdk-for-javascript/)

### Installation:
```sh
npm install @stenagli/dynamodb-client
```

### Usage:
In your application, make the following changes from the [NextAuth documentation](https://authjs.dev/getting-started/adapters/dynamodb#configuration):

```diff
    import NextAuth from "next-auth"
-   import { DynamoDB, DynamoDBClientConfig } from "@aws-sdk/client-dynamodb"
+   import { DynamoDBClient, DynamoDBClientConfig } from "@aws-sdk/client-dynamodb"
-   import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb"
+   import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb"
-   import { DynamoDBAdapter } from "@auth/dynamodb-adapter"
+   import { DynamoDBAdapter } from "@stenagli/dynamodb-adapter"
     
    const config: DynamoDBClientConfig = {
      credentials: {
        accessKeyId: process.env.AUTH_DYNAMODB_ID,
        secretAccessKey: process.env.AUTH_DYNAMODB_SECRET,
      },
      region: process.env.AUTH_DYNAMODB_REGION,
    }
     
-   const client = DynamoDBDocument.from(new DynamoDB(config), {
+   const client = DynamoDBDocumentClient.from(new DynamoDBClient(config), {
      marshallOptions: {
        convertEmptyValues: true,
        removeUndefinedValues: true,
        convertClassInstanceToMap: true,
      },
    })
     
    export const { handlers, auth, signIn, signOut } = NextAuth({
      providers: []
      adapter: DynamoDBAdapter(client),
    })
```
