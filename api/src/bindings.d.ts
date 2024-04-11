export type Bindings = {
  RENDER_SERVICE_IDS: string[];
  RENDER_API_KEY: string;
  ARGO_API_KEY: string;
  DEVTRON_APPS_STAGING: string[];
  DEVTRON_APPS_SANDBOX: string[];
  DEVTRON_APPS_PRODUCTION: string[];
};

declare global {
  function getMiniflareBindings(): Bindings;
}
