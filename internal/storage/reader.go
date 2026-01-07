package storage

import (
	"bufio"
	"encoding/json"
	"os"
	"sync"

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

	return traces, nil
}
