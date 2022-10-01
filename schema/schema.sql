CREATE extension IF NOT EXISTS moddatetime schema extensions;

CREATE TABLE "generation" (
    "prompt" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "seed" BIGINT NOT NULL,
    "num_inference_steps" INTEGER NOT NULL,
    "guidance_scale" DOUBLE PRECISION NOT NULL,
    "server_url" TEXT NOT NULL,
    "country_code" TEXT NOT NULL,
    "device_type" TEXT NOT NULL,
    "device_os" TEXT NOT NULL,
    "device_browser" TEXT NOT NULL,
    "user_agent" TEXT NOT NULL,
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMPTZ DEFAULT TIMEZONE('utc' :: TEXT, NOW()) NOT NULL,
    "updated_at" TIMESTAMPTZ DEFAULT TIMEZONE('utc' :: TEXT, NOW()) NOT NULL,
    PRIMARY KEY(id)
);

CREATE trigger handle_updated_at before
UPDATE
    ON generation FOR each ROW EXECUTE PROCEDURE moddatetime (updated_at);

ALTER TABLE
    generation ENABLE ROW LEVEL SECURITY;