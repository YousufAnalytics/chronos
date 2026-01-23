
export interface Span {
  trace_id: string;
  span_id: string;
  parent_span_id?: string;
  operation: string;
  timestamp: string;
  service: string;
  type: "start" | "end" | "error";
}


export interface Traces {
    trace_id: string;
  method: string;
  path: string;
  service: string;
  status: number;
  duration: string;
  time: string;
  spans?: Span[];
}
