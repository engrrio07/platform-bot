import { Hono } from "hono";
import { Bindings } from "./bindings";
import { renderPlugin } from "./plugins/renderPlugin";
import { argoPlugin } from "./plugins/argoPlugin";

const api = new Hono<{ Bindings: Bindings }>();

api.get("/", (c) => {
  return c.json({ message: "Hello Hono!" });
});

api.get("/getLastDeployment", async (c) => {
  const { environment } = c.req.query();

  if (
    !environment ||
    !["staging", "sandbox", "production"].includes(environment)
  ) {
    return c.json({
      message:
        "Missing environment. Must be one of staging, sandbox or production.",
    });
  }

  const renderResponse = await renderPlugin(
    c.env.RENDER_SERVICE_IDS,
    c.env.RENDER_API_KEY,
    environment
  );

  const argoResponse = await argoPlugin(
    c.env.DEVTRON_APPS_STAGING,
    c.env.DEVTRON_APPS_PRODUCTION,
    c.env.DEVTRON_APPS_SANDBOX,
    c.env.ARGO_API_KEY,
    environment
  );

  const argoResponseCleaned = argoResponse.replace(
    "Here are the details of our recent deployments:\n",
    ""
  );
  const combinedResponse = renderResponse + "\n" + argoResponseCleaned;
  return c.json({ response: combinedResponse });
});

export default api;
