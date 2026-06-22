/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

let supabaseInstance: ReturnType<typeof createClient> | null = null;
let supabaseAdminInstance: ReturnType<typeof createClient> | null = null;

/**
 * Gets a configured Supabase client using client-level configurations.
 * If keys are missing, returns null gracefully with a descriptive developer console message.
 */
export function getSupabase() {
  if (!supabaseInstance) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.warn(
        "[Supabase] Warning: SUPABASE_URL or SUPABASE_ANON_KEY is missing. " +
        "Ensure these keys are configured on the deployment platform."
      );
      return null;
    }

    try {
      supabaseInstance = createClient(supabaseUrl, supabaseKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        }
      });
      console.log("[Supabase] Client initialized successfully.");
    } catch (err: any) {
      console.error("[Supabase] Initialization failed:", err.message);
      return null;
    }
  }
  return supabaseInstance;
}

/**
 * Gets a configured Supabase client using Service Role config (Admin bypass).
 * This allows backend administrative updates (like verified status, resolving issues).
 */
export function getSupabaseAdmin() {
  if (!supabaseAdminInstance) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.warn(
        "[Supabase Admin] Warning: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing. " +
        "Backend administrative procedures will remain suspended."
      );
      return null;
    }

    try {
      supabaseAdminInstance = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        }
      });
      console.log("[Supabase Admin] client initialized successfully with elevated permissions.");
    } catch (err: any) {
      console.error("[Supabase Admin] Initialization failed:", err.message);
      return null;
    }
  }
  return supabaseAdminInstance;
}
