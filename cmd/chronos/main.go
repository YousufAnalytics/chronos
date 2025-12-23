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

	go api.StartRecorder(ready)

	<-ready

	switch os.Args[1] {
	case "run":
		cli.RunCommand()
	}

}
