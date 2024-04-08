export type Bindings = {
  RENDER_SERVICE_IDS: string[];
  RENDER_API_KEY: string;
};

declare global {
  function getMiniflareBindings(): Bindings;
}
