import dotenv from "dotenv"

const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development"

dotenv.config({ path: envFile })

export const env = {
  PORT: process.env.PORT || 5000,
  DATABASE_URL: process.env.DATABASE_URL || ""
}