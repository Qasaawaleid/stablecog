CREATE extension IF NOT EXISTS moddatetime schema extensions;

CREATE TYPE user_subscription_tier_enum AS ENUM ('FREE', 'PRO');

CREATE TYPE user_subscription_category_enum AS ENUM ('GIFTED', 'FRIEND_BOUGHT');

-- Generation Table
CREATE TYPE generation_status_enum AS ENUM ('started', 'succeeded', 'failed', 'rejected');

CREATE TABLE "generation" (
    "prompt_id" UUID REFERENCES prompt(id),
    "negative_prompt_id" UUID REFERENCES negative_prompt(id),
    "model_id" UUID REFERENCES model(id) NOT NULL,
    "scheduler_id" UUID REFERENCES scheduler(id) NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "seed" BIGINT NOT NULL,
    "num_inference_steps" INTEGER NOT NULL,
    "guidance_scale" DOUBLE PRECISION NOT NULL,
    "server_url" TEXT NOT NULL,
    "duration_ms" INTEGER,
    "status" generation_status_enum NOT NULL,
    "failure_reason" TEXT,
    "country_code" TEXT,
    "device_type" TEXT,
    "device_os" TEXT,
    "device_browser" TEXT,
    "user_agent" TEXT,
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "user_id" UUID REFERENCES auth.users(id),
    "user_tier" user_tier_enum NOT NULL DEFAULT 'FREE',
    "image_object_name" TEXT,
    "created_at" TIMESTAMPTZ DEFAULT TIMEZONE(' utc ' :: TEXT, NOW()) NOT NULL,
    "updated_at" TIMESTAMPTZ DEFAULT TIMEZONE(' utc ' :: TEXT, NOW()) NOT NULL,
    PRIMARY KEY(id)
);

CREATE trigger handle_updated_at before
UPDATE
    ON generation FOR each ROW EXECUTE PROCEDURE moddatetime (updated_at);

ALTER TABLE
    generation ENABLE ROW LEVEL SECURITY;

CREATE TABLE "prompt" (
    "text" TEXT NOT NULL UNIQUE,
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMPTZ DEFAULT TIMEZONE(' utc ' :: TEXT, NOW()) NOT NULL,
    "updated_at" TIMESTAMPTZ DEFAULT TIMEZONE(' utc ' :: TEXT, NOW()) NOT NULL,
    PRIMARY KEY(id)
);

CREATE trigger handle_updated_at before
UPDATE
    ON prompt FOR each ROW EXECUTE PROCEDURE moddatetime (updated_at);

ALTER TABLE
    prompt ENABLE ROW LEVEL SECURITY;

CREATE TABLE "negative_prompt" (
    "text" TEXT NOT NULL UNIQUE,
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMPTZ DEFAULT TIMEZONE(' utc ' :: TEXT, NOW()) NOT NULL,
    "updated_at" TIMESTAMPTZ DEFAULT TIMEZONE(' utc ' :: TEXT, NOW()) NOT NULL,
    PRIMARY KEY(id)
);

CREATE trigger handle_updated_at before
UPDATE
    ON negative_prompt FOR each ROW EXECUTE PROCEDURE moddatetime (updated_at);

ALTER TABLE
    negative_prompt ENABLE ROW LEVEL SECURITY;

CREATE TABLE "model" (
    "name" TEXT NOT NULL UNIQUE,
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMPTZ DEFAULT TIMEZONE(' utc ' :: TEXT, NOW()) NOT NULL,
    "updated_at" TIMESTAMPTZ DEFAULT TIMEZONE(' utc ' :: TEXT, NOW()) NOT NULL,
    PRIMARY KEY(id)
);

CREATE trigger handle_updated_at before
UPDATE
    ON model FOR each ROW EXECUTE PROCEDURE moddatetime (updated_at);

ALTER TABLE
    model ENABLE ROW LEVEL SECURITY;

CREATE TABLE "scheduler" (
    "name" TEXT NOT NULL UNIQUE,
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMPTZ DEFAULT TIMEZONE(' utc ' :: TEXT, NOW()) NOT NULL,
    "updated_at" TIMESTAMPTZ DEFAULT TIMEZONE(' utc ' :: TEXT, NOW()) NOT NULL,
    PRIMARY KEY(id)
);

CREATE trigger handle_updated_at before
UPDATE
    ON scheduler FOR each ROW EXECUTE PROCEDURE moddatetime (updated_at);

ALTER TABLE
    scheduler ENABLE ROW LEVEL SECURITY;

-- Upscale Table
CREATE TYPE upscale_status_enum AS ENUM (' started ', ' succeeded ', ' failed ');

CREATE TABLE "upscale" (
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "scale" INTEGER NOT NULL,
    "status" upscale_status_enum NOT NULL,
    "server_url" TEXT NOT NULL,
    "duration_ms" INTEGER,
    "type" TEXT,
    "prompt" TEXT,
    "negative_prompt" TEXT,
    "seed" BIGINT,
    "num_inference_steps" INTEGER,
    "guidance_scale" DOUBLE PRECISION,
    "country_code" TEXT,
    "device_type" TEXT,
    "device_os" TEXT,
    "device_browser" TEXT,
    "user_agent" TEXT,
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "user_id" UUID REFERENCES auth.users(id),
    "user_tier" user_tier_enum NOT NULL DEFAULT 'FREE',
    "created_at" TIMESTAMPTZ DEFAULT TIMEZONE(' utc ' :: TEXT, NOW()) NOT NULL,
    "updated_at" TIMESTAMPTZ DEFAULT TIMEZONE(' utc ' :: TEXT, NOW()) NOT NULL,
    PRIMARY KEY(id)
);

CREATE trigger handle_updated_at before
UPDATE
    ON upscale FOR each ROW EXECUTE PROCEDURE moddatetime (updated_at);

ALTER TABLE
    upscale ENABLE ROW LEVEL SECURITY;

-- Server Table
CREATE TABLE "server" (
    "url" TEXT NOT NULL,
    "healthy" BOOLEAN NOT NULL DEFAULT TRUE,
    "enabled" BOOLEAN NOT NULL DEFAULT TRUE,
    "last_health_check_at" TIMESTAMPTZ DEFAULT TIMEZONE(' utc ' :: TEXT, NOW()) NOT NULL,
    "features" JSONB,
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMPTZ DEFAULT TIMEZONE(' utc ' :: TEXT, NOW()) NOT NULL,
    "updated_at" TIMESTAMPTZ DEFAULT TIMEZONE(' utc ' :: TEXT, NOW()) NOT NULL,
    PRIMARY KEY(id)
);

CREATE trigger handle_updated_at before
UPDATE
    ON server FOR each ROW EXECUTE PROCEDURE moddatetime (updated_at);

ALTER TABLE
    server ENABLE ROW LEVEL SECURITY;

-- Generation peripheral stuff
CREATE VIEW generation_public AS
SELECT
    id,
    duration_ms,
    status,
    country_code,
    created_at,
    updated_at,
    user_tier
FROM
    generation;

CREATE
OR REPLACE FUNCTION generation_count() RETURNS BIGINT AS $ $
SELECT
    COUNT(*)
FROM
    generation_public
WHERE
    status = ' succeeded '
    OR status IS NULL $ $ language SQL;

CREATE
OR REPLACE FUNCTION generation_count_with_null_duration_ms() RETURNS BIGINT AS $ $
SELECT
    COUNT(*)
FROM
    generation_public
WHERE
    duration_ms IS NULL
    AND (
        status IS NULL
        OR status = 'succeeded'
    ) $ $ language SQL;

CREATE
OR REPLACE FUNCTION generation_with_non_null_duration_ms_total() RETURNS BIGINT AS $ $
SELECT
    SUM (duration_ms) generation_with_non_null_duration_ms_total
FROM
    generation_public
WHERE
    duration_ms IS NOT NULL
    AND (
        status IS NULL
        or status = 'succeeded'
    ) $ $ language SQL;

CREATE
OR REPLACE FUNCTION generation_with_non_null_duration_ms_average() RETURNS BIGINT AS $ $
SELECT
    SUM (duration_ms) / COUNT(' * ') AS generation_with_non_null_duration_ms_average
FROM
    generation_public
WHERE
    duration_ms IS NOT NULL
    AND (
        status IS NULL
        or status = 'succeeded'
    ) $ $ language SQL;

CREATE
OR REPLACE FUNCTION generation_duration_ms_total_estimate() RETURNS BIGINT AS $ $
SELECT
    generation_with_non_null_duration_ms_total() + generation_count_with_null_duration_ms() * generation_with_non_null_duration_ms_average() $ $ language SQL;

CREATE
OR REPLACE FUNCTION generation_duration_ms_total_estimate_with_constant() RETURNS BIGINT AS $ $
SELECT
    generation_with_non_null_duration_ms_total() + generation_count_with_null_duration_ms() * 12000 $ $ language SQL;

CREATE TABLE "generation_realtime" (
    "status" generation_status_enum NOT NULL,
    "duration_ms" INTEGER,
    "country_code" TEXT,
    "uses_default_server" BOOLEAN NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "num_inference_steps" INTEGER,
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "user_tier" user_tier_enum NOT NULL DEFAULT 'FREE',
    "created_at" TIMESTAMPTZ DEFAULT TIMEZONE(' utc ' :: TEXT, NOW()) NOT NULL,
    "updated_at" TIMESTAMPTZ DEFAULT TIMEZONE(' utc ' :: TEXT, NOW()) NOT NULL,
    PRIMARY KEY(id)
);

ALTER TABLE
    generation_realtime ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can read generation_realtime" ON public.generation_realtime FOR
SELECT
    USING (TRUE);

CREATE
OR REPLACE FUNCTION duplicate_to_generation_realtime() RETURNS trigger AS $ $ BEGIN IF EXISTS(
    SELECT
        id
    FROM
        generation_realtime
    WHERE
        id = new.id
) THEN
UPDATE
    generation_realtime
SET
    status = new.status,
    updated_at = new.updated_at,
    duration_ms = new.duration_ms
WHERE
    id = new.id;

ELSE
INSERT INTO
    generation_realtime (
        id,
        status,
        created_at,
        updated_at,
        country_code,
        duration_ms,
        uses_default_server,
        width,
        height,
        num_inference_steps,
        user_tier
    )
VALUES
    (
        new.id,
        new.status,
        new.created_at,
        new.updated_at,
        new.country_code,
        new.duration_ms,
        new.server_url IN (
            SELECT
                url
            FROM
                server
        ),
        new.width,
        new.height,
        new.num_inference_steps,
        new.user_tier
    );

END IF;

RETURN new;

END;

$ $ language plpgsql SECURITY DEFINER;

CREATE trigger generation_created_or_updated
AFTER
INSERT
    OR
UPDATE
    ON generation FOR EACH ROW EXECUTE PROCEDURE duplicate_to_generation_realtime();

CREATE
OR REPLACE FUNCTION prune_generation_realtime() RETURNS trigger AS $ $ BEGIN
DELETE FROM
    generation_realtime
WHERE
    created_at < TIMEZONE('utc' :: TEXT, NOW()) - INTERVAL '2 hours';

RETURN NULL;

END;

$ $ language plpgsql SECURITY DEFINER;

CREATE trigger generation_created_or_updated_prune
AFTER
INSERT
    OR
UPDATE
    ON generation FOR EACH ROW EXECUTE PROCEDURE prune_generation_realtime();

-- Upscale peripheral stuff
CREATE VIEW upscale_public AS
SELECT
    id,
    duration_ms,
    status,
    country_code,
    created_at,
    updated_at,
    user_tier
FROM
    upscale;

CREATE
OR REPLACE FUNCTION upscale_count() RETURNS BIGINT AS $ $
SELECT
    COUNT(*)
FROM
    upscale_public
WHERE
    status = ' succeeded '
    OR status IS NULL $ $ language SQL;

CREATE
OR REPLACE FUNCTION upscale_count_with_null_duration_ms() RETURNS BIGINT AS $ $
SELECT
    COUNT(*)
FROM
    upscale_public
WHERE
    duration_ms IS NULL
    AND (
        status IS NULL
        OR status = ' succeeded '
    ) $ $ language SQL;

CREATE
OR REPLACE FUNCTION upscale_with_non_null_duration_ms_total() RETURNS BIGINT AS $ $
SELECT
    SUM (duration_ms) upscale_with_non_null_duration_ms_total
FROM
    upscale_public
WHERE
    duration_ms IS NOT NULL
    AND (
        status IS NULL
        or status = ' succeeded '
    ) $ $ language SQL;

CREATE
OR REPLACE FUNCTION upscale_with_non_null_duration_ms_average() RETURNS BIGINT AS $ $
SELECT
    SUM (duration_ms) / COUNT(' * ') AS upscale_with_non_null_duration_ms_average
FROM
    upscale_public
WHERE
    duration_ms IS NOT NULL
    AND (
        status IS NULL
        or status = ' succeeded '
    ) $ $ language SQL;

CREATE
OR REPLACE FUNCTION upscale_duration_ms_total_estimate() RETURNS BIGINT AS $ $
SELECT
    upscale_with_non_null_duration_ms_total() + upscale_count_with_null_duration_ms() * upscale_with_non_null_duration_ms_average() $ $ language SQL;

CREATE
OR REPLACE FUNCTION upscale_duration_ms_total_estimate_with_constant() RETURNS BIGINT AS $ $
SELECT
    upscale_with_non_null_duration_ms_total() + upscale_count_with_null_duration_ms() * 12000 $ $ language SQL;

CREATE TABLE "upscale_realtime" (
    "status" upscale_status_enum NOT NULL,
    "duration_ms" INTEGER,
    "country_code" TEXT,
    "uses_default_server" BOOLEAN NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "scale" INTEGER,
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "user_tier" user_tier_enum NOT NULL DEFAULT 'FREE',
    "created_at" TIMESTAMPTZ DEFAULT TIMEZONE('utc' :: TEXT, NOW()) NOT NULL,
    "updated_at" TIMESTAMPTZ DEFAULT TIMEZONE('utc' :: TEXT, NOW()) NOT NULL,
    PRIMARY KEY(id)
);

ALTER TABLE
    upscale_realtime ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can read upscale_realtime" ON public.upscale_realtime FOR
SELECT
    USING (TRUE);

CREATE
OR REPLACE FUNCTION duplicate_to_upscale_realtime() RETURNS trigger AS $ $ BEGIN IF EXISTS(
    SELECT
        id
    FROM
        upscale_realtime
    WHERE
        id = new.id
) THEN
UPDATE
    upscale_realtime
SET
    status = new.status,
    updated_at = new.updated_at,
    duration_ms = new.duration_ms
WHERE
    id = new.id;

ELSE
INSERT INTO
    upscale_realtime (
        id,
        status,
        created_at,
        updated_at,
        country_code,
        duration_ms,
        uses_default_server,
        width,
        height,
        scale,
        user_tier
    )
VALUES
    (
        new.id,
        new.status,
        new.created_at,
        new.updated_at,
        new.country_code,
        new.duration_ms,
        new.server_url IN (
            SELECT
                url
            FROM
                server
        ),
        new.width,
        new.height,
        new.scale,
        new.user_tier
    );

END IF;

RETURN new;

END;

$ $ language plpgsql SECURITY DEFINER;

CREATE trigger upscale_created_or_updated
AFTER
INSERT
    OR
UPDATE
    ON upscale FOR EACH ROW EXECUTE PROCEDURE duplicate_to_upscale_realtime();

CREATE
OR REPLACE FUNCTION prune_upscale_realtime() RETURNS trigger AS $ $ BEGIN
DELETE FROM
    upscale_realtime
WHERE
    created_at < TIMEZONE(' utc ' :: TEXT, NOW()) - INTERVAL ' 2 hours ';

RETURN NULL;

END;

$ $ language plpgsql SECURITY DEFINER;

CREATE trigger upscale_created_or_updated_prune
AFTER
INSERT
    OR
UPDATE
    ON upscale FOR EACH ROW EXECUTE PROCEDURE prune_upscale_realtime();

-- Admin Table
CREATE TABLE "admin" (
    "id" UUID REFERENCES auth.users(id) NOT NULL ON DELETE CASCADE,
    "created_at" TIMESTAMPTZ DEFAULT TIMEZONE(' utc ' :: TEXT, NOW()) NOT NULL,
    "updated_at" TIMESTAMPTZ DEFAULT TIMEZONE(' utc ' :: TEXT, NOW()) NOT NULL,
    PRIMARY KEY(id)
);

CREATE POLICY "Everyone can see admins" ON public.admin FOR
SELECT
    USING (TRUE);

CREATE trigger handle_updated_at before
UPDATE
    ON admin FOR each ROW EXECUTE PROCEDURE moddatetime (updated_at);

ALTER TABLE
    admin ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can edit servers" ON public.server FOR ALL USING (
    auth.uid() IN (
        SELECT
            id
        FROM
            admin
    )
);

CREATE POLICY "Admins can select users" ON public.user FOR
SELECT
    USING (
        auth.uid() IN (
            SELECT
                id
            FROM
                admin
        )
    );

CREATE TABLE "generation_g" (
    "prompt_id" UUID REFERENCES prompt(id) NOT NULL,
    "negative_prompt_id" UUID REFERENCES negative_prompt(id),
    "model_id" UUID REFERENCES model(id) NOT NULL,
    "scheduler_id" UUID REFERENCES scheduler(id) NOT NULL,
    "image_id" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "seed" BIGINT NOT NULL,
    "num_inference_steps" INTEGER,
    "guidance_scale" DOUBLE PRECISION NOT NULL,
    "hidden" BOOLEAN NOT NULL DEFAULT FALSE,
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "user_id" UUID REFERENCES auth.users(id),
    "user_tier" user_tier_enum NOT NULL DEFAULT ' FREE ',
    "created_at" TIMESTAMPTZ DEFAULT TIMEZONE(' utc ' :: TEXT, NOW()) NOT NULL,
    "updated_at" TIMESTAMPTZ DEFAULT TIMEZONE(' utc ' :: TEXT, NOW()) NOT NULL,
    PRIMARY KEY(id)
);

CREATE trigger handle_updated_at before
UPDATE
    ON generation_g FOR each ROW EXECUTE PROCEDURE moddatetime (updated_at);

ALTER TABLE
    generation_g ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can edit generation_g" ON public.generation_g FOR ALL USING (
    auth.uid() IN (
        SELECT
            id
        FROM
            admin
    )
);

CREATE POLICY "Admins can edit models" ON public.model FOR ALL USING (
    auth.uid() IN (
        SELECT
            id
        FROM
            admin
    )
);

CREATE TABLE public."user" (
    "id" UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    "email" TEXT NOT NULL,
    "subscription_tier" user_subscription_tier_enum DEFAULT 'FREE' NOT NULL,
    "subscription_category" user_subscription_cateogry_enum,
    "created_at" TIMESTAMPTZ DEFAULT TIMEZONE(' utc ' :: TEXT, NOW()) NOT NULL,
    "updated_at" TIMESTAMPTZ DEFAULT TIMEZONE(' utc ' :: TEXT, NOW()) NOT NULL,
    "confirmed_at" TIMESTAMPTZ DEFAULT TIMEZONE(' utc ' :: TEXT, NOW()) NOT NULL,
    "stripe_customer_id" TEXT,
    PRIMARY KEY(id)
);

CREATE trigger handle_updated_at before
UPDATE
    ON public.user FOR each ROW EXECUTE PROCEDURE moddatetime (updated_at);

ALTER TABLE
    public.user ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select their own entry" ON public.user FOR
SELECT
    USING (auth.uid() = id);

create function handle_new_user() returns trigger as $ $ begin
insert into
    public.user (id, email)
values
    (new.id, new.email);

return new;

end;

$ $ language plpgsql security definer;

-- Trigger the function every time a user is created
create trigger on_auth_user_created
after
insert
    on auth.users for each row execute procedure handle_new_user();

create function handle_updated_user() returns trigger as $ $ begin
update
    public.user
set
    confirmed_at = new.confirmed_at
where
    id = new.id
    and confirmed_at is null;

return new;

end;

$ $ language plpgsql security definer;

create trigger on_auth_user_updated
after
update
    on auth.users for each row execute procedure handle_updated_user();

CREATE POLICY "Give users access to their own folder in generation bucket" ON storage.objects FOR ALL TO public USING (
    bucket_id = ' generation '
    AND auth.uid() :: text = (storage.foldername(name)) [1]
);