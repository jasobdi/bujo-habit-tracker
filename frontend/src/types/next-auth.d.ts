import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
    interface Session extends DefaultSession {
        accessToken: string;
        user: DefaultSession["user"] & {
            id: string | number;
            username: string;
            email: string;
        };
    }

    interface User extends DefaultUser {
        id: string | number;
        username: string;
        accessToken: string;
    }
}

    declare module "next-auth/jwt" {
        interface JWT {
            accessToken: string;
            id?: string | number;
            username?: string;
            email?: string;
        }
    }
