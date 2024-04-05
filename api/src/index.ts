import { Hono } from "hono";
import { poweredBy } from "hono/powered-by";
import { logger } from "hono/logger";
// import { basicAuth } from "hono/basic-auth";
import { prettyJSON } from "hono/pretty-json";
import api from "./api";
import { Bindings } from "./bindings";

const app = new Hono();
app.use(poweredBy());
app.use(logger());
app.use(prettyJSON());
app.get("/", (c) => {
  return c.text("Platform Bot API");
});
app.notFound((c) => c.json({ message: "Not Found" }, 404));

const middleware = new Hono<{ Bindings: Bindings }>();
middleware.use("*", prettyJSON());

// TODO:Basic AUTH
// middleware.use('/posts/*', async (c, next) => {
//   if (c.req.method !== 'GET') {
//     const auth = basicAuth({ username: c.env.USERNAME, password: c.env.PASSWORD })
//     return auth(c, next)
//   } else {
//     await next()
//   }
// })

app.route("/api", middleware);
app.route("/api", api);

export default app;
