import { useQueryClient } from '@tanstack/react-query';
import { useTelemetrySync, telemetryQueryKey } from '@/src/features/telemetry/hooks';
import type { TelemetrySyncResponse } from '@/src/features/telemetry/api';
import { Doc } from '@/src/types';

export function useDocuments() {
  const { data, ...rest } = useTelemetrySync();
  return { documents: data?.documents ?? [], ...rest };
}

export function useAddDocumentLocal() {
  const queryClient = useQueryClient();
  return (newDoc: Doc) => {
    queryClient.setQueryData<TelemetrySyncResponse>(telemetryQueryKey, (prev) =>
      prev ? { ...prev, documents: [newDoc, ...prev.documents] } : prev
    );
  };
}
