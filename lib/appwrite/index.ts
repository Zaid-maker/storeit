"use server";

import { Account, Avatars, Client, Databases, Storage } from "node-appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { cookies } from "next/headers";

/**
 * Creates an Appwrite client using the session cookie.
 * 
 * @throws Will throw an error if no session with the given ID is found.
 * 
 * @returns An object containing accessors for the `account` and `database`
 * services authenticated with the session.
 */
export const createSessionClient = async () => {
  const client = new Client()
    .setEndpoint(appwriteConfig.endpointUrl)
    .setProject(appwriteConfig.projectId);

  const session = (await cookies()).get("appwrite-session");

  if (!session || !session.value)
    throw new Error("No session with that ID found");

  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
    get database() {
      return new Databases(client);
    },
  };
};

/**
 * Creates an Appwrite client with the `secretKey` that is used to perform
 * actions that require admin permissions.
 *
 * @returns An object with methods for performing admin actions on the
 * `account`, `database`, `storage`, and `avatars` services.
 */
export const createAdminClient = async () => {
  const client = new Client()
    .setEndpoint(appwriteConfig.endpointUrl)
    .setProject(appwriteConfig.projectId)
    .setKey(appwriteConfig.secretKey);

  return {
    get account() {
      return new Account(client);
    },
    get database() {
      return new Databases(client);
    },
    get storage() {
      return new Storage(client);
    },
    get avatars() {
      return new Avatars(client);
    },
  };
};
