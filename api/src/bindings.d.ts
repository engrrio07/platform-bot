export type Bindings = {
  RENDER_SERVICE_ID: string;
  RENDER_API_KEY: string;
};

declare global {
  function getMiniflareBindings(): Bindings;
}
