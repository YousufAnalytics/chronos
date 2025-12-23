package storage

import (
	"encoding/json"
	"log"
	"os"
	"sync"

	"github.com/YousufAnalytics/chronos/internal/domain"
)

var (
	mu sync.Mutex
)

func SaveEvent(event domain.Event) {
	mu.Lock()
	defer mu.Unlock()

	file, err := os.OpenFile(
		"events.log",
		os.O_CREATE|os.O_APPEND|os.O_WRONLY,
		0644,
	)
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()

	data, _ := json.Marshal(event)
	file.Write(append(data, '\n'))
}
