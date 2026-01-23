import "./TraceDetails.css";
import { BiCheckCircle } from "react-icons/bi";
import { FaRegCircleXmark } from "react-icons/fa6";

export type TraceEvent = {
  trace_id: string;
  span_id: string;
  parent_span_id?: string;
  service: string;
  operation: string;
  type: "start" | "end" | "error";
  timestamp: string;
  status_code?: number;
  success?: boolean;
  error_message?: string;
};

type TraceNode = {
  span_id: string;
  operation: string;
  timeStamp: string;
  duration: number | null;
  error?: {
    message: string;
    status_code?: number;
  };
  children: TraceNode[];
};

const parseTimestamp = (ts: string): number => {
  const num = Number(ts);
  return Number.isNaN(num) ? Date.parse(ts) : num;
};

interface SpanEventPair {
  start?: TraceEvent;
  end?: TraceEvent;
}

function buildTraceTree(events: TraceEvent[]): TraceNode[] {
  const nodeMap: Record<string, TraceNode> = {};

  const roots: TraceNode[] = [];

  const spanEvents: Record<string, SpanEventPair> = {};

  events.forEach((e: TraceEvent) => {
    if (!spanEvents[e.span_id]) {
      spanEvents[e.span_id] = {};
    }

    if (e.type === "start") {
      spanEvents[e.span_id].start = e;
    } else if (e.type === "end") {
      spanEvents[e.span_id].end = e;
    }
  });

  // Build nodes with duration
  Object.values(spanEvents).forEach(({ start, end }) => {
    if (!start) return;

    const startTime = parseTimestamp(start.timestamp);
    const endTime = end ? parseTimestamp(end.timestamp) : null;

    nodeMap[start.span_id] = {
      span_id: start.span_id,
      operation: start.operation,
      timeStamp: start.timestamp,
      children: [],
      duration: endTime !== null ? endTime - startTime : null,
    };
  });

  // 1. Create nodes from START events
  // events
  //   .filter(e => e.type === "start")
  //   .forEach(e => {
  //     nodeMap[e.span_id] = {
  //       span_id: e.span_id,
  //       operation: e.operation,
  //       timeStamp: e.timestamp,
  //       children: [],
  //     };
  //   });

  // 2. Attach ERROR events to their span
  events
    .filter((e) => e.type === "error")
    .forEach((e) => {
      const node = nodeMap[e.span_id];
      if (node) {
        node.error = {
          message: e.error_message ?? "Unknown error",
          status_code: e.status_code,
        };
      }
    });

  // 3. Parent → child wiring
  events
    .filter((e) => e.type === "start")
    .forEach((e) => {
      const node = nodeMap[e.span_id];
      console.log("Processing node:", node);

      if (e.parent_span_id && nodeMap[e.parent_span_id]) {
        nodeMap[e.parent_span_id].children.push(node);
      } else {
        roots.push(node);
      }
    });

  console.log("Built trace tree with roots:", roots);
  return roots;
}

type TracePathNodeProps = {
  node: {
    span_id: string;
    operation: string;
    children: any[];
    timeStamp: string;
    duration: number | null;
    error?: {
      message: string;
      status_code?: number;
    };
  };
  level: number;
};

const TracePathNode: React.FC<TracePathNodeProps> = ({ node, level }) => {
  console.log("Rendering TracePathNode:", node, "at level", level);
  const iconStyles = {
    color: node.error ? "red" : "green",
    fontSize: "1.4em", // Note: fontSize is used instead of size for inline styles
    borderRadius: "50%",
  };
  return (
    <>
      <div className="trace-node">
        <div
          className={`trace-path-item ${node.error ? "error" : ""}`}
          style={{
            color: "black",
            textDecoration: "bold",
            marginLeft: level * 16,
            background: `${level !== 0 && node.error?.message !== "Unknown error" ? (node.error ? "#ffebee" : "#def4d1ff") : "#f0e9e9"}`,
            borderRadius: "6px",
            opacity: node.error ? 1 : 0.7,
          }}
        >
          <span style={{ display: "flex", gap: "7px" }}>
            {node.error?.message !== "Unknown error" &&
              (node.error ? (
                <FaRegCircleXmark style={iconStyles} />
              ) : (
                <BiCheckCircle style={iconStyles} />
              ))}
            {node.operation}{" "}
            <span style={{ textDecoration: "bold" }}>
              {node.duration !== null ? `${node.duration}ms` : "N/A"}
            </span>
          </span>

          {node.error && (
            <div className="trace-error">
              <div>{node.error.message}</div>
            </div>
          )}
        </div>
      </div>

      {node.children.map((child) => (
        <TracePathNode key={child.span_id} node={child} level={level + 1} />
      ))}
    </>
  );
};

type TraceDetailsProps = {
  traces: TraceEvent[];
};

function keepOnlyFirstErrorMessage(events: any[]) {
  let firstErrorFound = false;

  return events.map((event) => {
    // Check if this event has an error_message property
    if ("error_message" in event) {
      // If this is the first error_message we've encountered, keep it
      if (!firstErrorFound) {
        firstErrorFound = true;
        return event; // Keep the object as is
      } else {
        // Remove error_message from this object
        const { error_message, ...rest } = event;
        return rest;
      }
    }
    // If no error_message, return the object as is
    return event;
  });
}

const TraceDetails: React.FC<TraceDetailsProps> = ({ traces }) => {
  if (!traces || traces.length === 0) {
    return <div className="no-trace-selected">No trace selected</div>;
  }

  traces = keepOnlyFirstErrorMessage(traces);

  const tree = buildTraceTree(traces);

  console.log("Trace tree:", tree);

  return (
    <div className="trace-details-card">
      <div className="trace-details-section">
        <div className="trace-heading">
          Trace Details:{" "}
          <strong className="traceid">{traces[0].trace_id}</strong>
        </div>
        <div className="section-title">Request Path</div>

        <div className="trace-path">
          {tree.map((node) => (
            <TracePathNode key={node.span_id} node={node} level={0} />
          ))}
        </div>
      </div>
    </div>
  );
};
export default TraceDetails;
