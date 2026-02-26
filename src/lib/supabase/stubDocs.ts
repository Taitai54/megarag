// Simple in-memory storage for document statuses when Supabase is unavailable.

type DocStatus = {
  status: string;
  chunks_count?: number;
  error_message?: string;
};

const docMap = new Map<string, DocStatus>();

export function addStubDoc(id: string, status: DocStatus) {
  docMap.set(id, status);
}

export function getStubDoc(id: string): DocStatus | undefined {
  return docMap.get(id);
}

export function updateStubDoc(id: string, updates: Partial<DocStatus>) {
  const existing = docMap.get(id);
  if (existing) {
    Object.assign(existing, updates);
  }
}
