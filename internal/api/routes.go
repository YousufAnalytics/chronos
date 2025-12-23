package api

import "github.com/gofiber/fiber/v2"

func registerRoutes(app *fiber.App) {
	app.Post("/events", handleEvent)
}
