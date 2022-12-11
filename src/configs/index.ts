export const Configs = {
    mongo: {
        host: process.env.MONGODB_HOST || "",
        user: process.env.MONGODB_USER || "",
        db: process.env.MONGODB_NAME || "",
        pass: process.env.MONGODB_PASS || ""
      },
    auth: {
      jwtSecret: process.env.JWT_SECRET || ""
    }
}