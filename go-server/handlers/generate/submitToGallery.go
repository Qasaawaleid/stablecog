package generate

import (
	"bytes"
	"context"
	"fmt"
	"io/ioutil"
	"log"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/getsentry/sentry-go"
	"github.com/google/uuid"
	"github.com/h2non/bimg"
	"github.com/yekta/stablecog/go-server/shared"
)

var webpOptionsGallery = bimg.Options{
	Quality: 90,
	Type:    bimg.WEBP,
}

func SubmitToGallery(p SSubmitToGalleryProps) {
	promptId := <-p.PromptIdChan
	negativePromptId := <-p.NegativePromptIdChan
	close(p.PromptIdChan)
	close(p.NegativePromptIdChan)
	s := time.Now().UTC().UnixMilli()

	buff, bErr := shared.BufferFromB64(p.ImageB64)
	if bErr != nil {
		sentry.CaptureException(bErr)
		log.Printf("-- Gallery - Error decoding base64 image: %v --", bErr)
	}

	// Vips process for converting to WebP
	sVips := time.Now().UTC().UnixMilli()
	webpBuff, errBuff := bimg.NewImage(buff).Process(webpOptionsGallery)
	webpMeta, errMeta := bimg.Metadata(webpBuff)
	if errBuff != nil {
		sentry.CaptureException(errBuff)
		log.Printf("-- Gallery - Error converting to WebP: %v --", errBuff)
		return
	}
	if errMeta != nil {
		sentry.CaptureException(errMeta)
		log.Printf("-- Gallery - Error getting WebP metadata: %v --", errMeta)
		return
	}
	eVips := time.Now().UTC().UnixMilli()
	log.Printf("-- Gallery - Converted to WebP in: %s--", green(eVips-sVips, "ms"))
	// Vips process for converting to WebP - END

	log.Printf("-- Gallery - Image metadata - %s - %s --",
		green(webpMeta.Size.Width, " × ", webpMeta.Size.Height),
		green(len(webpBuff)/1000, "KB"),
	)
	id := uuid.New()
	imgId := id.String()
	imgKey := fmt.Sprintf("%s.webp", imgId)

	// Upload the file to S3
	input := &s3.PutObjectInput{
		Bucket:      aws.String(shared.S3BucketPublic),
		Key:         aws.String(imgKey),
		Body:        bytes.NewReader(webpBuff),
		ContentType: aws.String("image/webp"),
	}
	_, err := shared.S3Client.PutObject(context.Background(), input)
	if err != nil {
		sentry.CaptureException(err)
		log.Printf("-- Gallery - Error uploading to S3: %v --", err)
		return
	}
	log.Printf("-- Gallery - Uploaded to S3: %s --", yellow(imgKey))
	// Upload the file to S3 - END

	// Insert to DB
	var insertRes SDBGalleryInsertRes
	_, insertErr := shared.SupabaseDb.From("generation_g").Insert(SDBGenerationGInsertBody{
		ImageId:           imgId,
		Width:             webpMeta.Size.Width,
		Height:            webpMeta.Size.Height,
		Hidden:            p.Hidden,
		PromptId:          promptId,
		NegativePromptId:  negativePromptId,
		ModelId:           p.ModelId,
		SchedulerId:       p.SchedulerId,
		NumInferenceSteps: p.NumInferenceSteps,
		GuidanceScale:     p.GuidanceScale,
		Seed:              p.Seed,
		UserId:            p.UserId,
		UserTier:          p.UserTier,
	}, false, "", "", "").Single().ExecuteTo(&insertRes)
	if insertErr != nil {
		sentry.CaptureException(insertErr)
		log.Printf("-- Gallery - Error inserting to DB: %v --", insertErr)
		return
	}
	// Insert to DB - END

	e := time.Now().UTC().UnixMilli()
	log.Printf("-- DB - Submitted to gallery in: %s --", green(e-s, "ms"))
}

func SubmitToGalleryV2(p SSubmitToGalleryPropsV2) {
	promptId := <-p.PromptIdChan
	negativePromptId := <-p.NegativePromptIdChan
	close(p.PromptIdChan)
	close(p.NegativePromptIdChan)
	s := time.Now().UTC().UnixMilli()

	for _, imageUrl := range p.Output {
		splitStr := strings.Split(imageUrl, fmt.Sprintf("%s/", shared.S3PrivateUrl))
		if len(splitStr) < 2 {
			log.Printf("Couldn't split the image url string: %s", imageUrl)
			continue
		}
		key := splitStr[1]
		res, err := shared.S3Client.GetObject(context.Background(), &s3.GetObjectInput{
			Bucket: &shared.S3BucketPrivate,
			Key:    &key,
		})
		if err != nil {
			log.Printf("Failed to get object from S3: %v", err)
			continue
		}
		defer res.Body.Close()

		buff, bErr := ioutil.ReadAll(res.Body)
		if bErr != nil {
			sentry.CaptureException(bErr)
			log.Printf("-- Gallery - Error decoding base64 image: %v --", bErr)
		}

		// Vips process for converting to WebP
		sVips := time.Now().UTC().UnixMilli()
		webpBuff, errBuff := bimg.NewImage(buff).Process(webpOptionsGallery)
		webpMeta, errMeta := bimg.Metadata(webpBuff)
		if errBuff != nil {
			sentry.CaptureException(errBuff)
			log.Printf("-- Gallery - Error converting to WebP: %v --", errBuff)
			continue
		}
		if errMeta != nil {
			sentry.CaptureException(errMeta)
			log.Printf("-- Gallery - Error getting WebP metadata: %v --", errMeta)
			continue
		}
		eVips := time.Now().UTC().UnixMilli()
		log.Printf("-- Gallery - Converted to WebP in: %s--", green(eVips-sVips, "ms"))
		// Vips process for converting to WebP - END

		log.Printf("-- Gallery - Image metadata - %s - %s --",
			green(webpMeta.Size.Width, " × ", webpMeta.Size.Height),
			green(len(webpBuff)/1000, "KB"),
		)
		id := uuid.New()
		imgId := id.String()
		imgKey := fmt.Sprintf("%s.webp", imgId)

		// Upload the file to S3
		input := &s3.PutObjectInput{
			Bucket:      aws.String(shared.S3BucketPublic),
			Key:         aws.String(imgKey),
			Body:        bytes.NewReader(webpBuff),
			ContentType: aws.String("image/webp"),
		}
		_, errPut := shared.S3Client.PutObject(context.Background(), input)
		if errPut != nil {
			sentry.CaptureException(err)
			log.Printf("-- Gallery - Error uploading to S3: %v --", err)
			return
		}
		log.Printf("-- Gallery - Uploaded to S3: %s --", yellow(imgKey))
		// Upload the file to S3 - END

		// Insert to DB
		var insertRes SDBGalleryInsertRes
		_, insertErr := shared.SupabaseDb.From("generation_g").Insert(SDBGenerationGInsertBody{
			ImageId:           imgId,
			Width:             webpMeta.Size.Width,
			Height:            webpMeta.Size.Height,
			Hidden:            p.Hidden,
			PromptId:          promptId,
			NegativePromptId:  negativePromptId,
			ModelId:           p.ModelId,
			SchedulerId:       p.SchedulerId,
			NumInferenceSteps: p.NumInferenceSteps,
			GuidanceScale:     p.GuidanceScale,
			Seed:              p.Seed,
			UserId:            p.UserId,
			UserTier:          p.UserTier,
		}, false, "", "", "").Single().ExecuteTo(&insertRes)
		if insertErr != nil {
			sentry.CaptureException(insertErr)
			log.Printf("-- Gallery - Error inserting to DB: %v --", insertErr)
			return
		}
		// Insert to DB - END
	}

	e := time.Now().UTC().UnixMilli()
	log.Printf("-- DB - Submitted to gallery in: %s --", green(e-s, "ms"))
}

type SSubmitToGalleryProps struct {
	ImageB64             string
	PromptIdChan         chan string
	NegativePromptIdChan chan string
	ModelId              string
	SchedulerId          string
	NumInferenceSteps    int
	GuidanceScale        int
	Seed                 int
	UserId               string
	UserTier             string
	Hidden               bool
}

type SSubmitToGalleryPropsV2 struct {
	Output               []string
	PromptIdChan         chan string
	NegativePromptIdChan chan string
	ModelId              string
	SchedulerId          string
	NumInferenceSteps    int
	GuidanceScale        int
	Seed                 int
	UserId               string
	UserTier             string
	Hidden               bool
}

type SDBGenerationGInsertBody struct {
	ImageId           string `json:"image_id"`
	Width             int    `json:"width"`
	Height            int    `json:"height"`
	Hidden            bool   `json:"hidden"`
	PromptId          string `json:"prompt_id"`
	NegativePromptId  string `json:"negative_prompt_id,omitempty"`
	ModelId           string `json:"model_id"`
	SchedulerId       string `json:"scheduler_id"`
	NumInferenceSteps int    `json:"num_inference_steps"`
	GuidanceScale     int    `json:"guidance_scale"`
	Seed              int    `json:"seed"`
	UserId            string `json:"user_id,omitempty"`
	UserTier          string `json:"user_tier"`
}

type SDBGalleryInsertRes struct {
	Id                string `json:"id"`
	PromptId          string `json:"prompt_id"`
	NegativePromptId  string `json:"negative_prompt_id,omitempty"`
	Hidden            bool   `json:"hidden"`
	ImageId           string `json:"image_id"`
	Width             int    `json:"width"`
	Height            int    `json:"height"`
	ModelId           string `json:"model_id"`
	SchedulerId       string `json:"scheduler_id"`
	NumInferenceSteps int    `json:"num_inference_steps"`
	GuidanceScale     int    `json:"guidance_scale"`
	Seed              int    `json:"seed"`
	UserId            string `json:"user_id,omitempty"`
	UserTier          string `json:"user_tier"`
	CreatedAt         string `json:"created_at"`
	UpdatedAt         string `json:"updated_at"`
}
