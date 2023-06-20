import { TRPCError } from "@trpc/server";

export class ServerError extends TRPCError {}

export class UserError extends TRPCError {}
