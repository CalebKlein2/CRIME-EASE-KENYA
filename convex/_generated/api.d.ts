/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as admin from "../admin.js";
import type * as auth from "../auth.js";
import type * as cases from "../cases.js";
import type * as crimeReports_createCrimeReport from "../crimeReports/createCrimeReport.js";
import type * as evidence from "../evidence.js";
import type * as http from "../http.js";
import type * as interviews from "../interviews.js";
import type * as officers from "../officers.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  admin: typeof admin;
  auth: typeof auth;
  cases: typeof cases;
  "crimeReports/createCrimeReport": typeof crimeReports_createCrimeReport;
  evidence: typeof evidence;
  http: typeof http;
  interviews: typeof interviews;
  officers: typeof officers;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
