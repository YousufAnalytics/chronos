package storage

import (
	"bufio"
	"encoding/json"
	"os"
	"sort"
	"sync"
	"time"

	"github.com/YousufAnalytics/chronos/internal/domain"
)

var (
	EventFile = "events.log"
	FileMutex = &sync.RWMutex{}
)

func ReadTraces() (map[string][]domain.Event, error) {
	traces := make(map[string][]domain.Event)

	FileMutex.RLock()
	defer FileMutex.RUnlock()

	file, err := os.Open(EventFile)
	if err != nil {
		// If file doesn't exist yet, return empty result
		if os.IsNotExist(err) {
			return traces, nil
		}
		return nil, err
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)

	for scanner.Scan() {
		line := scanner.Text()

		var event domain.Event
		if err := json.Unmarshal([]byte(line), &event); err != nil {
			// Skip malformed / partial writes safely
			continue
		}

		if event.TraceID == "" {
			continue
		}

		traces[event.TraceID] = append(traces[event.TraceID], event)
	}

	if err := scanner.Err(); err != nil {
		return nil, err
	}

	for traceID, events := range traces {
		sort.Slice(events, func(i, j int) bool {
			ti, err1 := time.Parse(time.RFC3339Nano, events[i].Timestamp)
			tj, err2 := time.Parse(time.RFC3339Nano, events[j].Timestamp)

			// Fallback: keep original order if parsing fails
			if err1 != nil || err2 != nil {
				return i < j
			}

			return ti.Before(tj)
		})

		traces[traceID] = events
	}

	return traces, nil
}
