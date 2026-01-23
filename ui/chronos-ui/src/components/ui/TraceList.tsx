import "./TraceList.css";

interface Traces {
  id: string;
  method: string;
  path: string;
  service: string;
  status: number;
  duration: string;
  time: string;
}

interface TraceListProps {
  traces: Traces[];
  traceClicked?: (trace: Traces) => void;
  traceId?: string | null;
}

const TraceList: React.FC<TraceListProps> = ({ traces, traceClicked, traceId }) => {
  return (
    <div className="trace-list">
      {traces.map((trace) => {
        const isSelected =
          trace.id === traceId;
        return (
          <div
            key={trace.id}
            className={`trace-row ${isSelected ? "selected" : ""}`}
            onClick={() => traceClicked?.(trace)}
          >
            <div className="trace-main">
          <span className="trace-id">{trace.id}</span>
        </div>

            <div className="trace-meta">
          <span className="trace-time">{new Date(trace.time).toLocaleTimeString()}</span>
        </div>
          </div>
        );
      })}
    </div>
  );
};

export default TraceList;
