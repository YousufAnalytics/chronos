package cli

import (
	"log"
	"os"
	"os/exec"
)

func StartUI() {
	cmd := exec.Command("npm", "run", "dev")
	cmd.Dir = "./ui/chronos-ui"

	cmd.Env = append(os.Environ(),
		"VITE_CHRONOS_API=http://localhost:7366",
	)

	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	log.Println("Starting Chronos UI...")

	if err := cmd.Start(); err != nil {
		log.Println("Failed to start UI:", err)
	}
}
