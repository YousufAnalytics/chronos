package main

import (
	"fmt"
	"os"

	"github.com/YousufAnalytics/chronos/internal/api"
	"github.com/YousufAnalytics/chronos/internal/cli"
)

func main() {

	if len(os.Args) < 2 {
		fmt.Println("usage : timeline <run|view>")
	}

	ready := make(chan struct{})

	// Start the API server in a separate goroutine
	go api.StartRecorder(ready)

	// Wait for the API server to be ready
	<-ready

	cli.StartUI()

	// Handle CLI commands
	switch os.Args[1] {
	case "run":
		cli.RunCommand()
	}

}
