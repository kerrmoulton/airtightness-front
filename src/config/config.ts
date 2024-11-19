interface Config {
  API_BASE: string;
  WS_BASE: string;
  APP_TITLE: string;
  API_TIMEOUT: number;
}

const config: Config = {
  API_BASE: import.meta.env.VITE_API_BASE,
  WS_BASE: import.meta.env.VITE_WS_BASE,
  APP_TITLE: import.meta.env.VITE_APP_TITLE,
  API_TIMEOUT: Number(import.meta.env.VITE_API_TIMEOUT) || 10000
};

export default config; 