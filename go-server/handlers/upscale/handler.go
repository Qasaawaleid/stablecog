package upscale

import (
	"encoding/base64"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/getsentry/sentry-go"
	"github.com/go-redis/redis/v8"
	"github.com/google/uuid"

	"github.com/fatih/color"
	"github.com/gofiber/fiber/v2"
	"github.com/mileusna/useragent"
	"github.com/yekta/stablecog/go-server/loggers"
	"github.com/yekta/stablecog/go-server/shared"
)

var green = color.New(color.FgHiGreen).SprintFunc()

const upscaleType = "Real-World Image Super-Resolution-Large"
const processType = "upscale"
const scale = 4

var UPSCALE_MIN_WAIT_FREE = shared.GetDurationFromEnv("UPSCALE_MIN_WAIT_FREE", "10")

func Handler(c *fiber.Ctx) error {
	start := time.Now().UTC().UnixMilli()

	countryCode := c.Get("CF-IPCountry")
	if countryCode == "" {
		countryCode = c.Get("X-Vercel-IP-Country")
	}

	var req shared.SUpscaleRequestBody
	if err := c.BodyParser(&req); err != nil {
		sentry.CaptureException(err)
		return c.Status(http.StatusBadRequest).JSON(
			SUpscaleResponse{Error: "Invalid request body"},
		)
	}

	supabaseUserId := shared.GetSupabaseUserIdFromAccessToken(req.AccessToken)
	subscriptionTier := "FREE"
	plan := "ANONYMOUS"

	if supabaseUserId != "" {
		var res shared.SUserResponse
		_, err := shared.SupabaseDb.From("user").Select("subscription_tier", "", false).Eq("id", supabaseUserId).Single().ExecuteTo(&res)
		if err != nil {
			sentry.CaptureException(err)
			log.Printf("-- Upscale - Failed to get user tier: %v --", err)
		} else {
			subscriptionTier = res.SubsciptionTier
			plan = res.SubsciptionTier
		}
	} else {
		return c.Status(http.StatusBadRequest).JSON(
			SUpscaleResponse{Error: "You need to create an account to upsale images."},
		)
	}

	log.Printf("-- Upscale - User plan: %s --", plan)

	if plan != "PRO" && plan != "FREE" {
		return c.Status(http.StatusBadRequest).JSON(
			SUpscaleResponse{Error: "You need to create an account to upscale images."},
		)
	}

	if plan != "PRO" {
		return c.Status(http.StatusBadRequest).JSON(
			SUpscaleResponse{Error: "Upscale feature isn't available on the free plan :("},
		)
	}

	hasOnGoingGenerationOrUpscale := shared.HasOnGoingGenerationOrUpscale("goa_active", supabaseUserId)
	onGoingGenerationOrUpscaleResponse := SUpscaleResponse{Error: "Please wait for your ongoing generation or upscale to finish."}
	if hasOnGoingGenerationOrUpscale {
		log.Printf("-- Generation - Has ongoing generation or upscale: %s --", countryCode)
		return c.Status(http.StatusTooManyRequests).JSON(onGoingGenerationOrUpscaleResponse)
	}

	durationOngoing := 15 * time.Second
	shared.SetOngoingGenerationOrUpscale("goa_active", durationOngoing, supabaseUserId)

	if plan == "FREE" {
		time.Sleep(UPSCALE_MIN_WAIT_FREE)
	}

	cleanedPrompt := shared.FormatPrompt(req.Prompt)
	cleanedNegativePrompt := shared.FormatPrompt(req.NegativePrompt)

	userAgent := c.Get("User-Agent")
	client := useragent.Parse(userAgent)
	upscaleIdChan := make(chan string)

	var logObj = loggers.SUpscaleLogObject{
		Prompt:            cleanedPrompt,
		NegativePrompt:    cleanedNegativePrompt,
		Scale:             scale,
		Type:              upscaleType,
		Width:             req.Width,
		Height:            req.Height,
		NumInferenceSteps: req.NumInferenceSteps,
		GuidanceScale:     req.GuidanceScale,
		Seed:              req.Seed,
		CountryCode:       countryCode,
		ServerUrl:         shared.DEFAULT_SERVER_URL,
	}
	loggers.LogUpscale("Upscale started", logObj)

	go InsertUpscaleInitial(SInsertUpscaleProps{
		Status:            "started",
		Scale:             scale,
		Type:              upscaleType,
		Prompt:            cleanedPrompt,
		NegativePrompt:    cleanedNegativePrompt,
		Width:             req.Width,
		Height:            req.Height,
		GuidanceScale:     req.GuidanceScale,
		NumInferenceSteps: req.NumInferenceSteps,
		Seed:              req.Seed,
		UserId:            supabaseUserId,
		UserTier:          subscriptionTier,
		ServerUrl:         shared.DEFAULT_SERVER_URL,
		UserAgent:         userAgent,
		DeviceType:        shared.GetDeviceType(client),
		CountryCode:       countryCode,
		DeviceOS:          client.OS,
		DeviceBrowser:     client.Name,
		LogObject:         logObj,
		UpscaleIdChan:     upscaleIdChan,
	})

	requestId := uuid.NewString()
	cogReqBody := shared.SCogUpscaleRequestQueue{
		WebhookEventsFilter: []shared.WebhookEventFilterOption{"start", "completed"},
		Webhook:             fmt.Sprintf("%s/queue/webhook/%s", shared.PUBLIC_API_URL, shared.QUEUE_SECRET),
		Input: shared.SCogUpscaleRequestInput{
			ID:          requestId,
			Image:       req.ImageB64,
			Task:        upscaleType,
			ProcessType: processType,
		},
	}
	upscaleCogStart := time.Now().UTC().UnixMilli()

	// ! Start V2 stuff
	// Create channel
	upscaleChannel := make(chan shared.WebhookRequest)
	// Cleanup
	defer close(upscaleChannel)
	// Add channel to sync array (basically a thread-safe map)
	shared.RequestSyncMap.Put(requestId, upscaleChannel)
	// Cleanup
	defer shared.RequestSyncMap.Delete(requestId)

	// Send request to cog
	_, err := shared.Redis.XAdd(c.Context(), &redis.XAddArgs{
		Stream: "input_queue",
		ID:     "*", // Auto generate ID
		Values: []interface{}{"value", cogReqBody},
	}).Result()
	if err != nil {
		upscaleCogEnd := time.Now().UTC().UnixMilli()
		go UpdateUpscaleAsFailed(upscaleIdChan, upscaleCogEnd-upscaleCogStart)
		sentry.CaptureException(err)
		log.Printf("Error creating cog request: %v", err)
		shared.DeleteOngoingGenerationOrUpscale("goa_active", supabaseUserId)
		return c.Status(http.StatusInternalServerError).JSON(
			SUpscaleResponse{Error: "Error creating cog request"},
		)
	}

	// Wait for response on generateChannel with timeout
	var output string
	select {
	case response := <-upscaleChannel:
		if response.Status == shared.WebhookFailed {
			upscaleCogEnd := time.Now().UTC().UnixMilli()
			go UpdateUpscaleAsFailed(upscaleIdChan, upscaleCogEnd-upscaleCogStart)
			log.Printf("Cog returned an error in upscale: %v", response.Error)
			shared.DeleteOngoingGenerationOrUpscale("goa_active", supabaseUserId)
			return c.Status(http.StatusInternalServerError).JSON(
				SUpscaleResponse{Error: "Cog returned error during upscale"},
			)
		}
		// ! Success response
		if len(response.Output) == 0 {
			upscaleCogEnd := time.Now().UTC().UnixMilli()
			upscaleCogDurationMs := upscaleCogEnd - upscaleCogStart
			go UpdateUpscaleAsFailed(upscaleIdChan, upscaleCogDurationMs)
			shared.DeleteOngoingGenerationOrUpscale("goa_active", supabaseUserId)
			return c.Status(http.StatusInternalServerError).JSON(
				SUpscaleResponse{Error: "Cog server returned empty output"},
			)
		}
		output = response.Output[0]
		// Timeout
	case <-time.After(shared.GenerationOrUpscaleTimeout):
		upscaleCogEnd := time.Now().UTC().UnixMilli()
		go UpdateUpscaleAsFailed(upscaleIdChan, upscaleCogEnd-upscaleCogStart)
		log.Printf("Cog timed out during upscale: %s", requestId)
		shared.DeleteOngoingGenerationOrUpscale("goa_active", supabaseUserId)
		return c.Status(http.StatusInternalServerError).JSON(
			SUpscaleResponse{Error: "Cog returned error during upscale"},
		)
	}

	upscaleCogEnd := time.Now().UTC().UnixMilli()
	upscaleCogDurationMs := upscaleCogEnd - upscaleCogStart
	if output == "" {
		go UpdateUpscaleAsFailed(upscaleIdChan, upscaleCogDurationMs)
		shared.DeleteOngoingGenerationOrUpscale("goa_active", supabaseUserId)
		return c.Status(http.StatusInternalServerError).JSON(
			SUpscaleResponse{Error: "Cog server returned empty output"},
		)
	}
	loggers.LogUpscale(
		fmt.Sprintf(
			"Upscale duration on cog was: %v%s",
			green(upscaleCogDurationMs),
			green("ms"),
		),
		logObj,
	)

	// ! TODO this should all be re-usable, someday
	splitStr := strings.Split(output, "cloudflarestorage.com/")
	if len(splitStr) < 2 {
		go UpdateUpscaleAsFailed(upscaleIdChan, upscaleCogDurationMs)
		log.Printf("Cog server returned invalid output: %s", output)
		shared.DeleteOngoingGenerationOrUpscale("goa_active", supabaseUserId)
		return c.Status(http.StatusInternalServerError).JSON(
			SUpscaleResponse{Error: "Cog server returned invalid output"},
		)
	}
	key := splitStr[1]
	res, err := shared.S3Client.GetObject(c.Context(), &s3.GetObjectInput{
		Bucket: &shared.S3BucketPrivate,
		Key:    &key,
	})
	if err != nil {
		go UpdateUpscaleAsFailed(upscaleIdChan, upscaleCogDurationMs)
		log.Printf("Failed to get object from S3: %v", err)
		shared.DeleteOngoingGenerationOrUpscale("goa_active", supabaseUserId)
		return c.Status(http.StatusInternalServerError).JSON(
			SUpscaleResponse{Error: "Couldn't get the object from the bucket"},
		)
	}
	defer res.Body.Close()
	bytes, err := ioutil.ReadAll(res.Body)
	// Convert bytes to base64 string
	output = base64.StdEncoding.EncodeToString(bytes)
	output = "data:image/jpeg;base64," + output

	go UpdateUpscaleAsSucceeded(
		upscaleIdChan,
		upscaleCogDurationMs,
	)
	end := time.Now().UTC().UnixMilli()
	loggers.LogUpscale(fmt.Sprintf("Upscale successful result returned in: %v%s", green(end-start), green("ms")), logObj)
	shared.DeleteOngoingGenerationOrUpscale("goa_active", supabaseUserId)
	return c.Status(http.StatusOK).JSON(SUpscaleResponse{
		Data: SUpscaleResponseData{
			ImageB64:   output,
			DurationMs: upscaleCogDurationMs,
		},
	})
}

func HandlerV2(c *fiber.Ctx) error {
	start := time.Now().UTC().UnixMilli()

	countryCode := c.Get("CF-IPCountry")
	if countryCode == "" {
		countryCode = c.Get("X-Vercel-IP-Country")
	}

	var req shared.SUpscaleRequestBody
	if err := c.BodyParser(&req); err != nil {
		sentry.CaptureException(err)
		return c.Status(http.StatusBadRequest).JSON(
			SUpscaleResponseV2{Error: "Invalid request body"},
		)
	}

	supabaseUserId := shared.GetSupabaseUserIdFromAccessToken(req.AccessToken)
	subscriptionTier := "FREE"
	plan := "ANONYMOUS"

	if supabaseUserId != "" {
		var res shared.SUserResponse
		_, err := shared.SupabaseDb.From("user").Select("subscription_tier", "", false).Eq("id", supabaseUserId).Single().ExecuteTo(&res)
		if err != nil {
			sentry.CaptureException(err)
			log.Printf("-- Upscale - Failed to get user tier: %v --", err)
		} else {
			subscriptionTier = res.SubsciptionTier
			plan = res.SubsciptionTier
		}
	} else {
		return c.Status(http.StatusBadRequest).JSON(
			SUpscaleResponseV2{Error: "You need to create an account to upsale images."},
		)
	}

	log.Printf("-- Upscale - User plan: %s --", plan)

	if plan != "PRO" && plan != "FREE" {
		return c.Status(http.StatusBadRequest).JSON(
			SUpscaleResponseV2{Error: "You need to create an account to upscale images."},
		)
	}

	if plan != "PRO" {
		return c.Status(http.StatusBadRequest).JSON(
			SUpscaleResponseV2{Error: "Upscale feature isn't available on the free plan :("},
		)
	}

	hasOnGoingGenerationOrUpscale := shared.HasOnGoingGenerationOrUpscale("goa_active", supabaseUserId)
	onGoingGenerationOrUpscaleResponse := SUpscaleResponse{Error: "Please wait for your ongoing generation or upscale to finish."}
	if hasOnGoingGenerationOrUpscale {
		log.Printf("-- Generation - Has ongoing generation or upscale: %s --", countryCode)
		return c.Status(http.StatusTooManyRequests).JSON(onGoingGenerationOrUpscaleResponse)
	}

	durationOngoing := 15 * time.Second
	shared.SetOngoingGenerationOrUpscale("goa_active", durationOngoing, supabaseUserId)

	if plan == "FREE" {
		time.Sleep(UPSCALE_MIN_WAIT_FREE)
	}

	cleanedPrompt := shared.FormatPrompt(req.Prompt)
	cleanedNegativePrompt := shared.FormatPrompt(req.NegativePrompt)

	userAgent := c.Get("User-Agent")
	client := useragent.Parse(userAgent)
	upscaleIdChan := make(chan string)

	var logObj = loggers.SUpscaleLogObject{
		Prompt:            cleanedPrompt,
		NegativePrompt:    cleanedNegativePrompt,
		Scale:             scale,
		Type:              upscaleType,
		Width:             req.Width,
		Height:            req.Height,
		NumInferenceSteps: req.NumInferenceSteps,
		GuidanceScale:     req.GuidanceScale,
		Seed:              req.Seed,
		CountryCode:       countryCode,
		ServerUrl:         shared.DEFAULT_SERVER_URL,
	}
	loggers.LogUpscale("Upscale started", logObj)

	go InsertUpscaleInitial(SInsertUpscaleProps{
		Status:            "started",
		Scale:             scale,
		Type:              upscaleType,
		Prompt:            cleanedPrompt,
		NegativePrompt:    cleanedNegativePrompt,
		Width:             req.Width,
		Height:            req.Height,
		GuidanceScale:     req.GuidanceScale,
		NumInferenceSteps: req.NumInferenceSteps,
		Seed:              req.Seed,
		UserId:            supabaseUserId,
		UserTier:          subscriptionTier,
		ServerUrl:         shared.DEFAULT_SERVER_URL,
		UserAgent:         userAgent,
		DeviceType:        shared.GetDeviceType(client),
		CountryCode:       countryCode,
		DeviceOS:          client.OS,
		DeviceBrowser:     client.Name,
		LogObject:         logObj,
		UpscaleIdChan:     upscaleIdChan,
	})

	requestId := uuid.NewString()
	cogReqBody := shared.SCogUpscaleRequestQueue{
		WebhookEventsFilter: []shared.WebhookEventFilterOption{"start", "completed"},
		Webhook:             fmt.Sprintf("%s/queue/webhook/%s", shared.PUBLIC_API_URL, shared.QUEUE_SECRET),
		Input: shared.SCogUpscaleRequestInput{
			ID:          requestId,
			Image:       req.ImageB64,
			Task:        upscaleType,
			ProcessType: processType,
		},
	}
	upscaleCogStart := time.Now().UTC().UnixMilli()

	// ! Start V2 stuff
	// Create channel
	upscaleChannel := make(chan shared.WebhookRequest)
	// Cleanup
	defer close(upscaleChannel)
	// Add channel to sync array (basically a thread-safe map)
	shared.RequestSyncMap.Put(requestId, upscaleChannel)
	// Cleanup
	defer shared.RequestSyncMap.Delete(requestId)

	// Send request to cog
	_, err := shared.Redis.XAdd(c.Context(), &redis.XAddArgs{
		Stream: "input_queue",
		ID:     "*", // Auto generate ID
		Values: []interface{}{"value", cogReqBody},
	}).Result()
	if err != nil {
		upscaleCogEnd := time.Now().UTC().UnixMilli()
		go UpdateUpscaleAsFailed(upscaleIdChan, upscaleCogEnd-upscaleCogStart)
		sentry.CaptureException(err)
		log.Printf("Error creating cog request: %v", err)
		shared.DeleteOngoingGenerationOrUpscale("goa_active", supabaseUserId)
		return c.Status(http.StatusInternalServerError).JSON(
			SUpscaleResponseV2{Error: "Error creating cog request"},
		)
	}

	// Wait for response on generateChannel with timeout
	var output []string
	select {
	case response := <-upscaleChannel:
		if response.Status == shared.WebhookFailed {
			upscaleCogEnd := time.Now().UTC().UnixMilli()
			go UpdateUpscaleAsFailed(upscaleIdChan, upscaleCogEnd-upscaleCogStart)
			log.Printf("Cog returned an error in upscale: %v", response.Error)
			shared.DeleteOngoingGenerationOrUpscale("goa_active", supabaseUserId)
			return c.Status(http.StatusInternalServerError).JSON(
				SUpscaleResponseV2{Error: "Cog returned error during upscale"},
			)
		}
		// ! Success response
		if len(response.Output) == 0 {
			upscaleCogEnd := time.Now().UTC().UnixMilli()
			upscaleCogDurationMs := upscaleCogEnd - upscaleCogStart
			go UpdateUpscaleAsFailed(upscaleIdChan, upscaleCogDurationMs)
			shared.DeleteOngoingGenerationOrUpscale("goa_active", supabaseUserId)
			return c.Status(http.StatusInternalServerError).JSON(
				SUpscaleResponseV2{Error: "Cog server returned empty output"},
			)
		}
		output = response.Output
		// Timeout
	case <-time.After(shared.GenerationOrUpscaleTimeout):
		upscaleCogEnd := time.Now().UTC().UnixMilli()
		go UpdateUpscaleAsFailed(upscaleIdChan, upscaleCogEnd-upscaleCogStart)
		log.Printf("Cog timed out during upscale: %s", requestId)
		shared.DeleteOngoingGenerationOrUpscale("goa_active", supabaseUserId)
		return c.Status(http.StatusInternalServerError).JSON(
			SUpscaleResponseV2{Error: "Cog returned error during upscale"},
		)
	}

	upscaleCogEnd := time.Now().UTC().UnixMilli()
	upscaleCogDurationMs := upscaleCogEnd - upscaleCogStart
	if output == nil || len(output) == 0 {
		go UpdateUpscaleAsFailed(upscaleIdChan, upscaleCogDurationMs)
		shared.DeleteOngoingGenerationOrUpscale("goa_active", supabaseUserId)
		return c.Status(http.StatusInternalServerError).JSON(
			SUpscaleResponseV2{Error: "Cog server returned empty output"},
		)
	}
	loggers.LogUpscale(
		fmt.Sprintf(
			"Upscale duration on cog was: %v%s",
			green(upscaleCogDurationMs),
			green("ms"),
		),
		logObj,
	)

	for index, url := range output {
		splitStr := strings.Split(url, shared.S3Hostname)
		if len(splitStr) < 2 {
			log.Printf("Failed to split url: %s", url)
			continue
		}
		output[index] = fmt.Sprintf("%s%s", shared.S3PrivateUrl, splitStr[1])
	}

	// ! TODO this should all be re-usable, someday
	go UpdateUpscaleAsSucceeded(
		upscaleIdChan,
		upscaleCogDurationMs,
	)
	end := time.Now().UTC().UnixMilli()
	loggers.LogUpscale(fmt.Sprintf("Upscale successful result returned in: %v%s", green(end-start), green("ms")), logObj)
	shared.DeleteOngoingGenerationOrUpscale("goa_active", supabaseUserId)
	return c.Status(http.StatusOK).JSON(SUpscaleResponseV2{
		Data: SUpscaleResponseDataV2{
			ImageUrls:  output,
			DurationMs: upscaleCogDurationMs,
		},
	})
}

type SUpscaleResponse struct {
	Data  SUpscaleResponseData `json:"data,omitempty"`
	Error string               `json:"error,omitempty"`
}

type SUpscaleResponseV2 struct {
	Data  SUpscaleResponseDataV2 `json:"data,omitempty"`
	Error string                 `json:"error,omitempty"`
}

type SUpscaleResponseData struct {
	ImageB64   string `json:"image_b64"`
	DurationMs int64  `json:"duration_ms"`
}

type SUpscaleResponseDataV2 struct {
	ImageUrls  []string `json:"image_urls"`
	DurationMs int64    `json:"duration_ms"`
}
