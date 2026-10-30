CREATE TABLE "CivicCampaignEvent" (
    "id" SERIAL NOT NULL,
    "campaign_id" INTEGER NOT NULL,
    "event_type" TEXT NOT NULL,
    "user_id" INTEGER,
    "session_id" TEXT,
    "dedupe_key" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CivicCampaignEvent_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "CivicCampaignEvent_dedupe_key_key"
ON "CivicCampaignEvent"("dedupe_key");

CREATE INDEX "CivicCampaignEvent_campaign_id_event_type_idx"
ON "CivicCampaignEvent"("campaign_id", "event_type");

ALTER TABLE "CivicCampaignEvent"
ADD CONSTRAINT "CivicCampaignEvent_campaign_id_fkey"
FOREIGN KEY ("campaign_id") REFERENCES "Entity"("entity_id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CivicCampaignEvent"
ADD CONSTRAINT "CivicCampaignEvent_user_id_fkey"
FOREIGN KEY ("user_id") REFERENCES "User"("user_id")
ON DELETE SET NULL ON UPDATE CASCADE;
