// import NextAuth, { DefaultSession } from "next-auth";
// import { JWT } from "next-auth/jwt";

import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
    interface Session extends DefaultSession {
        accessToken: string;
        user: DefaultSession["user"] & {
            id: string;
            username: string;
        };
    }

    interface User extends DefaultUser {
        id: string;
        username: string;
        accessToken: string;
    }
}
