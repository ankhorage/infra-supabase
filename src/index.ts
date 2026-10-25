/** Public Supabase platform adapter package boundary. */
export { infraAdapterDescriptor } from './constants/infra.js';
export { createFetchSupabaseControlPlane } from './features/platform-infrastructure/adapters/outbound/createFetchSupabaseControlPlane.js';
export { createInfraAdapter } from './features/platform-infrastructure/composition/createInfraAdapter.js';
export type {
  SupabaseAdapterOptions,
  SupabaseControlPlane,
  SupabaseControlPlaneRequest,
} from './types/supabase.js';
