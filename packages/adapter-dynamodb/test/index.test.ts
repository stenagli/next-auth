import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, GetCommand, QueryCommand } from "@aws-sdk/lib-dynamodb"
import { DynamoDBAdapter, format } from "../src"
import { runBasicTests } from "utils/adapter"

const config = {
  endpoint: "http://localhost:8000",
  region: "us-east-1",
  credentials: {
    accessKeyId: "accessKey",
    secretAccessKey: "secretKey",
  },
}

const client = DynamoDBDocumentClient.from(new DynamoDBClient(config), {
  marshallOptions: {
    convertEmptyValues: true,
    removeUndefinedValues: true,
    convertClassInstanceToMap: true,
  },
})

const adapter = DynamoDBAdapter(client)

const TableName = "next-auth"

runBasicTests({
  adapter,
  db: {
    async user(id) {
      const user = await client.send(new GetCommand({
        TableName,
        Key: {
          pk: `USER#${id}`,
          sk: `USER#${id}`,
        },
      }))

      return format.from(user.Item)
    },
    async session(token) {
      const session = await client.send(new QueryCommand({
        TableName,
        IndexName: "GSI1",
        KeyConditionExpression: "#gsi1pk = :gsi1pk AND #gsi1sk = :gsi1sk",
        ExpressionAttributeNames: {
          "#gsi1pk": "GSI1PK",
          "#gsi1sk": "GSI1SK",
        },
        ExpressionAttributeValues: {
          ":gsi1pk": `SESSION#${token}`,
          ":gsi1sk": `SESSION#${token}`,
        },
      }))

      return format.from(session.Items?.[0])
    },
    async account({ provider, providerAccountId }) {
      const account = await client.send(new QueryCommand({
        TableName,
        IndexName: "GSI1",
        KeyConditionExpression: "#gsi1pk = :gsi1pk AND #gsi1sk = :gsi1sk",
        ExpressionAttributeNames: {
          "#gsi1pk": "GSI1PK",
          "#gsi1sk": "GSI1SK",
        },
        ExpressionAttributeValues: {
          ":gsi1pk": `ACCOUNT#${provider}`,
          ":gsi1sk": `ACCOUNT#${providerAccountId}`,
        },
      }))

      return format.from(account.Items?.[0])
    },
    async verificationToken({ token, identifier }) {
      const vt = await client.send(new GetCommand({
        TableName,
        Key: {
          pk: `VT#${identifier}`,
          sk: `VT#${token}`,
        },
      }))
      return format.from(vt.Item)
    },
  },
})
