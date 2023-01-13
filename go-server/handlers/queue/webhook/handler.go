package queueWebhook

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/getsentry/sentry-go"
	"github.com/gofiber/fiber/v2"
	"github.com/yekta/stablecog/go-server/shared"
)

// HTTP Post endpoint from the cog
func Handler(c *fiber.Ctx) error {
	var req shared.WebhookRequest
	if err := c.BodyParser(&req); err != nil {
		log.Printf("-- Invalid request body: %v --", err)
		sentry.CaptureException(err)
		return c.SendStatus(http.StatusBadRequest)
	}

	if req.Status == shared.WebhookComplete || req.Status == shared.WebhookFailed {
		// Publish to redis channel
		marshalled, err := json.Marshal(req)
		if err != nil {
			log.Printf("-- Error marshalling webhook request: %v --", err)
			sentry.CaptureException(err)
			return c.SendStatus(http.StatusInternalServerError)
		}
		shared.Redis.Publish(c.Context(), shared.WEBHOOK_QUEUE_COMPLETE_CHANNEL, string(marshalled))
	}

	return c.SendStatus(200)
}