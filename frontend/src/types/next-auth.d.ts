import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        accessToken: string;
        user: {
            id: string;
            username: string;
            email: string;
        };
    }

    interface User {
        id: string;
        username: string;
        email: string;
        accessToken: string; // Laravel's Bearer token
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        username: string;
        email: string;
        accessToken: string;
    }
}
