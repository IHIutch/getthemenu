import { createServerSideHelpers } from "@trpc/react-query/server";
import SuperJSON from "superjson";
import { appRouter } from ".";
import { Context } from "./init";

export default async function (ctx: Context) {
  return createServerSideHelpers({
    router: appRouter,
    ctx,
    transformer: SuperJSON,
  });
}
