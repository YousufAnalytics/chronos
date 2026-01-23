package api

import (
	"log"
	"net"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func StartRecorder(ready chan<- struct{}) {
	app := fiber.New()

	app.Use(cors.New())

	registerRoutes(app)

	ln, err := net.Listen("tcp", ":7366")
	if err != nil {
		log.Fatal(err)
	}

	log.Println("Chronos listening on :7366")

	close(ready) // signal readiness

	log.Fatal(app.Listener(ln))
}
