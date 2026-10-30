-- ============================================================
-- CIVIC BUZZ — Migration
-- Tables: buzz_posts, buzz_votes, buzz_follows, buzz_comments,
--         buzz_events, buzz_reports
-- ============================================================

-- 1. buzz_posts
CREATE TABLE "buzz_posts" (
    "id"          SERIAL NOT NULL,
    "author_id"   INTEGER NOT NULL,
    "linked_type" TEXT NOT NULL,          -- 'issue' | 'initiative'
    "linked_id"   INTEGER NOT NULL,       -- entity_id of the linked record
    "template"    TEXT NOT NULL,          -- 'meme' | 'awareness' | 'initiative'
    "style"       TEXT NOT NULL,          -- 'funny' | 'informative' | 'emotional'
    "image_url"   TEXT,
    "caption"     TEXT NOT NULL,
    "cta_text"    TEXT,
    "status"      TEXT NOT NULL DEFAULT 'draft',  -- 'draft' | 'published' | 'hidden'
    "created_at"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "buzz_posts_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "buzz_posts_author_id_idx" ON "buzz_posts"("author_id");
CREATE INDEX "buzz_posts_linked_idx"    ON "buzz_posts"("linked_type", "linked_id");
CREATE INDEX "buzz_posts_status_created_idx" ON "buzz_posts"("status", "created_at" DESC);

ALTER TABLE "buzz_posts"
    ADD CONSTRAINT "buzz_posts_author_id_fkey"
    FOREIGN KEY ("author_id") REFERENCES "User"("user_id")
    ON DELETE CASCADE ON UPDATE CASCADE;

-- 2. buzz_votes  (unique voter per post)
CREATE TABLE "buzz_votes" (
    "id"         SERIAL NOT NULL,
    "post_id"    INTEGER NOT NULL,
    "user_id"    INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "buzz_votes_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "buzz_votes_post_user_key" ON "buzz_votes"("post_id", "user_id");
CREATE INDEX "buzz_votes_post_id_idx" ON "buzz_votes"("post_id");

ALTER TABLE "buzz_votes"
    ADD CONSTRAINT "buzz_votes_post_id_fkey"
    FOREIGN KEY ("post_id") REFERENCES "buzz_posts"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "buzz_votes"
    ADD CONSTRAINT "buzz_votes_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "User"("user_id")
    ON DELETE CASCADE ON UPDATE CASCADE;

-- 3. buzz_follows  (unique follower per post)
CREATE TABLE "buzz_follows" (
    "id"         SERIAL NOT NULL,
    "post_id"    INTEGER NOT NULL,
    "user_id"    INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "buzz_follows_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "buzz_follows_post_user_key" ON "buzz_follows"("post_id", "user_id");
CREATE INDEX "buzz_follows_post_id_idx" ON "buzz_follows"("post_id");

ALTER TABLE "buzz_follows"
    ADD CONSTRAINT "buzz_follows_post_id_fkey"
    FOREIGN KEY ("post_id") REFERENCES "buzz_posts"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "buzz_follows"
    ADD CONSTRAINT "buzz_follows_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "User"("user_id")
    ON DELETE CASCADE ON UPDATE CASCADE;

-- 4. buzz_comments
CREATE TABLE "buzz_comments" (
    "id"         SERIAL NOT NULL,
    "post_id"    INTEGER NOT NULL,
    "user_id"    INTEGER NOT NULL,
    "text"       TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "buzz_comments_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "buzz_comments_post_id_idx" ON "buzz_comments"("post_id", "created_at");

ALTER TABLE "buzz_comments"
    ADD CONSTRAINT "buzz_comments_post_id_fkey"
    FOREIGN KEY ("post_id") REFERENCES "buzz_posts"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "buzz_comments"
    ADD CONSTRAINT "buzz_comments_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "User"("user_id")
    ON DELETE CASCADE ON UPDATE CASCADE;

-- 5. buzz_events  (analytics: view | click_issue | share | join)
CREATE TABLE "buzz_events" (
    "id"         SERIAL NOT NULL,
    "post_id"    INTEGER NOT NULL,
    "user_id"    INTEGER,               -- nullable = anonymous
    "type"       TEXT NOT NULL,         -- 'view' | 'click_issue' | 'share' | 'join'
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "buzz_events_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "buzz_events_post_type_idx" ON "buzz_events"("post_id", "type");
CREATE INDEX "buzz_events_created_idx"   ON "buzz_events"("created_at");

ALTER TABLE "buzz_events"
    ADD CONSTRAINT "buzz_events_post_id_fkey"
    FOREIGN KEY ("post_id") REFERENCES "buzz_posts"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "buzz_events"
    ADD CONSTRAINT "buzz_events_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "User"("user_id")
    ON DELETE SET NULL ON UPDATE CASCADE;

-- 6. buzz_reports  (unique reporter per post; 3 unique reports → auto-hide)
CREATE TABLE "buzz_reports" (
    "id"         SERIAL NOT NULL,
    "post_id"    INTEGER NOT NULL,
    "user_id"    INTEGER NOT NULL,
    "reason"     TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "buzz_reports_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "buzz_reports_post_user_key" ON "buzz_reports"("post_id", "user_id");
CREATE INDEX "buzz_reports_post_id_idx" ON "buzz_reports"("post_id");

ALTER TABLE "buzz_reports"
    ADD CONSTRAINT "buzz_reports_post_id_fkey"
    FOREIGN KEY ("post_id") REFERENCES "buzz_posts"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "buzz_reports"
    ADD CONSTRAINT "buzz_reports_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "User"("user_id")
    ON DELETE CASCADE ON UPDATE CASCADE;

