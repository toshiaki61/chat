export interface Env {
  REDIS_URI: string;
  MONGODB_URI: string;
  PORT: number;
  ADMIN_REDIS_URI: string;
  ADMIN_MONGODB_URI: string;
  ADMIN_PORT: number;
  SWAGGER_ENABLED: boolean;
}
