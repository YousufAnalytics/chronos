package cli

import (
	"log"
	"os"
	"os/exec"

	"github.com/google/uuid"
)

func RunCommand() {

	cmd := exec.Command("npm", "run", "start:dev")

	cmd.Dir = `C:\Users\yousu\OneDrive\Desktop\clients\orders-service`

	// Forward output to your terminal
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	runID := uuid.New().String()

	cmd.Env = append(os.Environ(),
		"TIMELINE_RUN_ID="+runID,
		"TIMELINE_RECORDER=http://127.0.0.1:7366/events",
	)

	if err := cmd.Run(); err != nil {
		log.Println("process exited with error:", err)
	}

	cmd.Wait()

}
