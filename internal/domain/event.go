package domain

type Event struct {
	// ---- Identity ----
	SessionID string `json:"session_id,omitempty"`
	TraceID   string `json:"trace_id"`

	SpanID       string `json:"span_id"`
	ParentSpanID string `json:"parent_span_id,omitempty"`

	// ---- Ownership ----
	Service   string `json:"service"`
	Operation string `json:"operation"` // Controller / Service / Method

	// ---- Span State ----
	Type string `json:"type"` // start | end | error

	// ---- Timing ----
	Timestamp  string `json:"timestamp"`
	DurationMs int64  `json:"duration_ms,omitempty"`

	// ---- HTTP Context (optional) ----
	HTTPMethod string `json:"http_method,omitempty"`
	HTTPPath   string `json:"http_path,omitempty"`
	StatusCode int    `json:"status_code,omitempty"`
	Success    *bool  `json:"success,omitempty"`

	// ---- Error Diagnostics ----
	ErrorMessage string `json:"error_message,omitempty"`
	ErrorCode    string `json:"error_code,omitempty"`

	FailedAt string `json:"failedAt,omitempty"`

	ErrorType string `json:"errorType,omitempty"`

	// ---- Arbitrary Metadata (future-proof) ----
	Attributes map[string]any `json:"attributes,omitempty"`
}
