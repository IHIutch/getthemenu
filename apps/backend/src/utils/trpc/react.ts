import { createTRPCContext } from "@trpc/tanstack-react-query";
import { AppRouter } from "./routes";

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();