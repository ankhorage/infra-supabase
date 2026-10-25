import type { InfraExecutionContext, InfraResult } from '@ankhorage/contracts/infra';

import { SUPABASE_BOOTSTRAP_CREDENTIAL } from '../../constants/supabase.js';
import { resolveSupabaseDesiredState } from '../../domain/resolveSupabaseDesiredState.js';
import { validateSupabaseBootstrapCredentials } from '../../utils/validateSupabaseBootstrapCredentials.js';
import { resolveSupabaseBootstrapCredentialsAsync } from './resolveSupabaseBootstrapCredentialsAsync.js';
import { validateSupabasePersistenceCredentialsAsync } from './validateSupabasePersistenceCredentialsAsync.js';

/*** Validate Supabase selection and credentials without mutating provisionable local bootstrap state. */
export async function validateSupabaseAsync(
  context: InfraExecutionContext,
): Promise<InfraResult<null>> {
  const desired = resolveSupabaseDesiredState(context);
  if (!desired.ok) return desired;
  const found = await context.credentials.findAsync(SUPABASE_BOOTSTRAP_CREDENTIAL);
  if (!found.ok) return found;
  if (found.value !== null) {
    const bootstrap = validateSupabaseBootstrapCredentials(found.value);
    if (!bootstrap.ok) return bootstrap;
  } else if (context.environment !== 'local') {
    const required = await resolveSupabaseBootstrapCredentialsAsync(context);
    if (!required.ok) return required;
  }
  return validateSupabasePersistenceCredentialsAsync(context);
}
