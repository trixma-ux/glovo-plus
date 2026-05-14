import express, { type Express, type Request } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import { createProxyMiddleware } from "http-proxy-middleware";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function resolveTarget(req: Request): string | undefined {
  const p = req.path;
  if (p.startsWith("/auth") || p.startsWith("/users")) return "http://localhost:3001";
  if (p.startsWith("/restaurants") || p.startsWith("/products")) return "http://localhost:3002";
  if (p.startsWith("/orders")) return "http://localhost:3003";
  if (p.startsWith("/deliveries")) return "http://localhost:3004";
  if (p.startsWith("/ml")) return "http://localhost:3005";
  return undefined;
}

app.use(
  "/api",
  createProxyMiddleware({
    changeOrigin: true,
    router: resolveTarget,
    target: "http://localhost:3001",
    on: {
      error: (err, _req, res) => {
        logger.error({ err }, "Proxy error");
        (res as express.Response).status(503).json({ message: "Service indisponible", detail: (err as Error).message });
      },
    },
  }),
);

app.use("/api", router);

export default app;
