-- Phase 1: Golden-path demo foundation.
--
-- This migration is additive except for the unique ParameterValue constraint.
-- Before applying to a database that may contain existing values, run the
-- duplicate preflight documented in backend/docs/PHASE1_MIGRATION_NOTES.md.

-- AlterTable
ALTER TABLE "Entity" ADD COLUMN "owner_user_id" INTEGER;
ALTER TABLE "Entity" ADD COLUMN "area" TEXT;

-- AlterTable
ALTER TABLE "ParameterMaster" ADD COLUMN "field_key" TEXT;
ALTER TABLE "ParameterMaster" ADD COLUMN "label" TEXT;
ALTER TABLE "ParameterMaster" ADD COLUMN "display_order" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "ParameterMaster" ADD COLUMN "options" JSONB;

-- AlterTable
ALTER TABLE "AuditLog" ADD COLUMN "actor_user_id" INTEGER;
ALTER TABLE "AuditLog" ADD COLUMN "old_status" TEXT;
ALTER TABLE "AuditLog" ADD COLUMN "new_status" TEXT;

-- CreateTable
CREATE TABLE "ApprovalHistory" (
    "approval_history_id" SERIAL NOT NULL,
    "entity_id" INTEGER NOT NULL,
    "actor_user_id" INTEGER,
    "from_status" TEXT,
    "to_status" TEXT NOT NULL,
    "reason" TEXT,
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApprovalHistory_pkey" PRIMARY KEY ("approval_history_id")
);

-- CreateTable
CREATE TABLE "AIExecutionLog" (
    "ai_execution_log_id" SERIAL NOT NULL,
    "entity_id" INTEGER NOT NULL,
    "requested_by_user_id" INTEGER,
    "provider" TEXT NOT NULL DEFAULT 'gemini',
    "model" TEXT,
    "prompt" TEXT,
    "response" TEXT,
    "status" TEXT NOT NULL DEFAULT 'completed',
    "error_message" TEXT,
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIExecutionLog_pkey" PRIMARY KEY ("ai_execution_log_id")
);

-- CreateIndex
CREATE INDEX "Entity_owner_user_id_idx" ON "Entity"("owner_user_id");
CREATE INDEX "Entity_area_status_idx" ON "Entity"("area", "status");
CREATE UNIQUE INDEX "ParameterMaster_subsection_id_field_key_key" ON "ParameterMaster"("subsection_id", "field_key");
CREATE INDEX "ParameterMaster_subsection_id_display_order_idx" ON "ParameterMaster"("subsection_id", "display_order");
CREATE UNIQUE INDEX "ParameterValue_entity_id_parameter_id_key" ON "ParameterValue"("entity_id", "parameter_id");
CREATE INDEX "AuditLog_entity_id_datetime_idx" ON "AuditLog"("entity_id", "datetime");
CREATE INDEX "AuditLog_actor_user_id_idx" ON "AuditLog"("actor_user_id");
CREATE INDEX "ApprovalHistory_entity_id_created_date_idx" ON "ApprovalHistory"("entity_id", "created_date");
CREATE INDEX "ApprovalHistory_actor_user_id_idx" ON "ApprovalHistory"("actor_user_id");
CREATE INDEX "AIExecutionLog_entity_id_created_date_idx" ON "AIExecutionLog"("entity_id", "created_date");
CREATE INDEX "AIExecutionLog_requested_by_user_id_idx" ON "AIExecutionLog"("requested_by_user_id");

-- AddForeignKey
ALTER TABLE "Entity" ADD CONSTRAINT "Entity_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actor_user_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ApprovalHistory" ADD CONSTRAINT "ApprovalHistory_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "Entity"("entity_id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ApprovalHistory" ADD CONSTRAINT "ApprovalHistory_actor_user_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "AIExecutionLog" ADD CONSTRAINT "AIExecutionLog_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "Entity"("entity_id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "AIExecutionLog" ADD CONSTRAINT "AIExecutionLog_requested_by_user_id_fkey" FOREIGN KEY ("requested_by_user_id") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
