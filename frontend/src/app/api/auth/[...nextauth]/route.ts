import NextAuth from 'next-auth';
import { authOptions } from './auth-options';

/* 
* This file handles the NextAuth API routes for authentication.
*/

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
