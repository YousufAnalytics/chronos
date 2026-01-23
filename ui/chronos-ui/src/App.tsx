import "./App.css";
import Navbar from "./components/ui/Navbar";
import TraceList from "./components/ui/TraceList";
import TraceDetails from "./components/ui/TraceDetails";
import { useState, useEffect } from "react";
import { fetchTraces } from "./services/trace.service";

interface Traces {
  id: string;
  method: string;
  path: string;
  service: string;
  status: number;
  duration: string;
  time: string;
}

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
};

function App() {
  const [selectedTrace, setSelectedTrace] = useState<TraceEvent[]>([]);
  const [traceData, setTraceData] = useState<Traces[]>([]);
  const [requestData, setRequestData] = useState<any>(null);
  const [selectedTraceId, setSelectedTraceId] = useState<string | null>(null);

  console.log("Trace data state:", traceData);

  useEffect(() => {
    fetchTraces()
      .then((data) => {
        setRequestData(data.data);
        for (const trace in data.data) {
          const length = data.data[trace].length;
          const start = new Date(data.data[trace][0].timestamp);
          const end = new Date(data.data[trace][length - 1].timestamp);
          const duration = end.getTime() - start.getTime();
          const traceItem: Traces = {
            id: trace,
            method: data.data[trace][0].operation.split("/")[0],
            path: data.data[trace][0].operation.split("/")[1],
            service: data.data[trace][0].service,
            status: data.data[trace].find(
              (item: { status_code: any }) => item.status_code,
            ).status_code,
            duration: duration.toString() + " ms",
            time: data.data[trace][0].timestamp,
          };
          console.log("traceItem:", data.data[trace][0].timestamp);
          setTraceData((prev) => [...prev, traceItem]);
        }
      })
      .catch((error) => {
        console.error("Error fetching traces:", error);
      });
  }, []);

  const handleTraceClick = (trace: Traces) => {
    const span = requestData[trace.id];
    setSelectedTraceId(trace.id);
    console.log("Selected trace spans:", span);
    setSelectedTrace(span);
  };
  return (
    <>
      <div className="app">
        <Navbar />
        <div className="traces-container">
          <TraceList traces={traceData} traceClicked={handleTraceClick} traceId={selectedTraceId} />
          <TraceDetails traces={selectedTrace} />
        </div>
      </div>
    </>
  );
}

export default App;
