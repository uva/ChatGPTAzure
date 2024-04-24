import { DefaultSession } from "next-auth";

// https://next-auth.js.org/getting-started/typescript#module-augmentation

declare module "next-auth" {
  interface Session {
    user: {
      isAdmin: boolean;
      isTeacher: boolean;
    } & DefaultSession["user"];
  }

  interface Token {
    isAdmin: boolean;
    isTeacher: boolean;
  }

  interface User {
    isAdmin: boolean;
    isTeacher: boolean;
  }
}
