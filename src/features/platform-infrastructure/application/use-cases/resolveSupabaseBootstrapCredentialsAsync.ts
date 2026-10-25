import type { InfraExecutionContext, InfraResult } from '@ankhorage/contracts/infra';

import type { SupabaseBootstrapCredentials } from '../../../../types/supabase.js';
import { SUPABASE_BOOTSTRAP_CREDENTIAL } from '../../constants/supabase.js';
import { validateSupabaseBootstrapCredentials } from '../../utils/validateSupabaseBootstrapCredentials.js';

/*** Resolve and validate the execution-only Supabase bootstrap credential bundle. */
export async function resolveSupabaseBootstrapCredentialsAsync(
  context: InfraExecutionContext,
): Promise<InfraResult<SupabaseBootstrapCredentials>> {
  const resolved = await context.credentials.resolveAsync(SUPABASE_BOOTSTRAP_CREDENTIAL);
  return resolved.ok ? validateSupabaseBootstrapCredentials(resolved.value) : resolved;
}
