import { createInfraAdapter, infraAdapterDescriptor } from '@ankhorage/infra-supabase';

const adapter = createInfraAdapter();

console.log(infraAdapterDescriptor.id, adapter.descriptor.package);
