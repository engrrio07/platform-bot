import { Hono } from "hono";
import { Bindings } from "./bindings";
import { renderPlugin } from "./plugins/renderPlugin";

const api = new Hono<{ Bindings: Bindings }>();

api.get("/", (c) => {
  return c.json({ message: "Hello Hono!" });
});

api.get("/getLastDeployment", async (c) => {
  const response = await renderPlugin(
    c.env.RENDER_SERVICE_IDS,
    c.env.RENDER_API_KEY
  );
  return c.json({ response: response });
});

export default api;
