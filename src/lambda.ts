import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import express, { Express, Request, Response } from "express";

import cors from "cors";
import router from "./routes/routes"; // Adjust this path if necessary

const createApp = (): Express => {
  const app = express();
  app.use(express.json());

  // Enable CORS
  app.use(cors());

  app.use("/api/count-paths", router); // Correct route
  return app;
};

let cachedApp: Express | null = null;

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  context.callbackWaitsForEmptyEventLoop = false;

  if (!cachedApp) {
    cachedApp = createApp();
  }

  return new Promise((resolve) => {
    const req = createRequest(event);
    const res = createResponse(resolve);

    cachedApp(req, res);
  });
};

// Create request from the event
const createRequest = (event: APIGatewayProxyEvent): Request => {
  const { httpMethod, path, headers, queryStringParameters, body } = event;

  return {
    method: httpMethod,
    url: path,
    headers: headers as any,
    query: queryStringParameters as any,
    body: body ? JSON.parse(body) : null, // Parse the body if it exists
  } as Request;
};

// Create response to resolve promise
const createResponse = (
  resolve: (
    value?: APIGatewayProxyResult | PromiseLike<APIGatewayProxyResult>
  ) => void
): Response => {
  const res: Partial<Response> = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    },
    status(code: number) {
      this.statusCode = code;
      return this as Response;
    },
    send(body: any) {
      resolve({
        statusCode: this.statusCode || 200,
        body: JSON.stringify(body),
        headers: this.headers,
      });
      return this as Response;
    },
    json(body: any) {
      this.send(body);
    },
    setHeader(name: string, value: string) {
      this.headers![name] = value;
      return this as Response;
    },
    end(body?: any) {
      resolve({
        statusCode: this.statusCode || 200,
        body: body ? JSON.stringify(body) : "",
        headers: this.headers,
      });
    },
    on(event: string, handler: Function) {
      if (event === "end") {
        handler();
      }
      return this as Response;
    },
  };

  return res as Response;
};
