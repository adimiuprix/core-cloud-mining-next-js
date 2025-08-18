import { cookies } from "next/headers";
import { getIronSession, SessionOptions } from 'iron-session';

export async function getSession() {
  const cookieStore = await cookies();
  const session = await getIronSession(cookieStore, sessionOptions);
  return session;
}

export const sessionOptions: SessionOptions = {
  password: "aVeryLongSuperSecretPasswordWith32Chars",
  cookieName: "nexta",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
}

export async function createCookieStore() {
  const cookieStore = await cookies();
  return {
    get: async (key: string) => {
      const c = cookieStore.get(key);
      return c ? { name: c.name, value: c.value } : undefined;
    },
    set: async (key: string, value: string) => {
      cookieStore.set(key, value);
      return cookieStore;
    },
    delete: async (key: string) => {
      cookieStore.delete(key);
      return cookieStore;
    },
  };
}