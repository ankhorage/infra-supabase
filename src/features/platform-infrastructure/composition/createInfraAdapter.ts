import type { InfraServiceAdapter } from '@ankhorage/contracts/infra';

import { infraAdapterDescriptor } from '../../../constants/infra.js';
import type { SupabaseAdapterOptions } from '../../../types/supabase.js';
import { createFetchSupabaseControlPlane } from '../adapters/outbound/createFetchSupabaseControlPlane.js';
import { destroySupabaseAsync } from '../application/use-cases/destroySupabaseAsync.js';
import { getSupabaseStatusAsync } from '../application/use-cases/getSupabaseStatusAsync.js';
import { planSupabase } from '../application/use-cases/planSupabase.js';
import { prepareSupabaseBootstrapCredentialsAsync } from '../application/use-cases/prepareSupabaseBootstrapCredentialsAsync.js';
import { reconcileSupabaseAsync } from '../application/use-cases/reconcileSupabaseAsync.js';
import { validateSupabaseAsync } from '../application/use-cases/validateSupabaseAsync.js';
import { createSupabaseWorkloads } from '../domain/createSupabaseWorkloads.js';
import { resolveSupabaseDesiredState } from '../domain/resolveSupabaseDesiredState.js';

/***
 * Create the canonical runtime-neutral Supabase platform adapter.
 *
 * The provider contributes portable workloads and reconciles Supabase-owned API resources after
 * the selected runtime is ready. Resolved bootstrap secrets never cross the execution boundary.
 *
 * @readme
 */
export function createInfraAdapter(options: SupabaseAdapterOptions = {}): InfraServiceAdapter {
  const controlPlane = options.controlPlane ?? createFetchSupabaseControlPlane();
  return {
    descriptor: infraAdapterDescriptor,
    validateAsync: (context) => validateSupabaseAsync(context),
    planAsync: (context) => Promise.resolve(planSupabase(context)),
    prepareAsync: (context) => prepareSupabaseBootstrapCredentialsAsync(context),
    desiredWorkloadsAsync: (context) => {
      const desired = resolveSupabaseDesiredState(context);
      return Promise.resolve(
        desired.ok
          ? { ok: true, value: createSupabaseWorkloads(context), diagnostics: [] }
          : desired,
      );
    },
    reconcileAsync: (context, runtimeOutputs) =>
      reconcileSupabaseAsync(controlPlane, context, runtimeOutputs),
    statusAsync: (context) => getSupabaseStatusAsync(controlPlane, context),
    destroyAsync: (context, request) => destroySupabaseAsync(controlPlane, context, request),
  };
}
