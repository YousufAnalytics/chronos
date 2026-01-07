package api

import (
	"log"

	"github.com/YousufAnalytics/chronos/internal/domain"
	"github.com/YousufAnalytics/chronos/internal/storage"

	"github.com/gofiber/fiber/v2"
)

func handleEvent(ctx *fiber.Ctx) error {
	log.Println("Received event payload:", string(ctx.Body()))

	var event domain.Event
	if err := ctx.BodyParser(&event); err != nil {
		return ctx.Status(400).SendString("invalid payload")
	}

	storage.SaveEvent(event)
	return ctx.SendStatus(202)
}

func GetTraces(c *fiber.Ctx) error {
	traces, err := storage.ReadTraces()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"count": len(traces),
		"data":  traces,
	})
}
