package api

type Event struct {
	SessionID string `json:"session_id"`
	TraceID   string `json:"trace_id"`
	Service   string `json:"service"`
	Operation string `json:"operation"`
	Type      string `json:"type"` // start | end | log | error
	Timestamp string `json:"timestamp"`
}
