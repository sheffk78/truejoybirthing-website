import { onRequestPost as __api_ambassador_ts_onRequestPost } from "/Users/socializerender/Projects/truejoybirthing-website/functions/api/ambassador.ts"
import { onRequestPost as __api_contact_ts_onRequestPost } from "/Users/socializerender/Projects/truejoybirthing-website/functions/api/contact.ts"
import { onRequest as __admin___path___ts_onRequest } from "/Users/socializerender/Projects/truejoybirthing-website/functions/admin/[[path]].ts"

export const routes = [
    {
      routePath: "/api/ambassador",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_ambassador_ts_onRequestPost],
    },
  {
      routePath: "/api/contact",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_contact_ts_onRequestPost],
    },
  {
      routePath: "/admin/:path*",
      mountPath: "/admin",
      method: "",
      middlewares: [],
      modules: [__admin___path___ts_onRequest],
    },
  ]