import { onRequestPost as __api_contact_ts_onRequestPost } from "/Users/socializerender/.openclaw/workspace/Kit/life/brands/TrueJoyBirthing/web-strategy/truejoybirthing-website/functions/api/contact.ts"

export const routes = [
    {
      routePath: "/api/contact",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_contact_ts_onRequestPost],
    },
  ]