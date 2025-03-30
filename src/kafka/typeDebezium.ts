export interface DebeziumEnvelope<T> {
    schema: {
      type: string;
      fields: any[]; // Pode ser tipado melhor se necessário
      optional: boolean;
      name: string;
      version: number;
    };
    payload: {
      before: T | null;
      after: T | null;
      source: {
        version: string;
        connector: string;
        name: string;
        ts_ms: number;
        snapshot: string;
        db: string;
        sequence: string | string[];
        schema: string;
        table: string;
        txId: number;
        lsn: number;
        xmin: number | null;
      };
      op: string;
      ts_ms: number;
      transaction: any | null;
    };
  }
  

  export enum OperationType {
    c = 'CREATE',
    u = 'UPDATE',
    d = 'DELETE',
}