-- CreateTable
CREATE TABLE "Domain" (
    "domain_id" SERIAL NOT NULL,
    "domain_name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Domain_pkey" PRIMARY KEY ("domain_id")
);

-- CreateTable
CREATE TABLE "EntityType" (
    "entity_type_id" SERIAL NOT NULL,
    "domain_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "EntityType_pkey" PRIMARY KEY ("entity_type_id")
);

-- CreateTable
CREATE TABLE "Entity" (
    "entity_id" SERIAL NOT NULL,
    "entity_type_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT,
    "status" TEXT,

    CONSTRAINT "Entity_pkey" PRIMARY KEY ("entity_id")
);

-- CreateTable
CREATE TABLE "EntityRelationshipRule" (
    "rule_id" SERIAL NOT NULL,
    "source_entity_type_id" INTEGER NOT NULL,
    "target_entity_type_id" INTEGER NOT NULL,
    "event" TEXT,
    "auto_create" BOOLEAN NOT NULL DEFAULT false,
    "auto_approve" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "EntityRelationshipRule_pkey" PRIMARY KEY ("rule_id")
);

-- CreateTable
CREATE TABLE "FormMaster" (
    "form_id" SERIAL NOT NULL,
    "entity_type_id" INTEGER NOT NULL,
    "form_name" TEXT NOT NULL,
    "version" TEXT,
    "status" TEXT,

    CONSTRAINT "FormMaster_pkey" PRIMARY KEY ("form_id")
);

-- CreateTable
CREATE TABLE "SectionMaster" (
    "section_id" SERIAL NOT NULL,
    "form_id" INTEGER NOT NULL,
    "section_name" TEXT NOT NULL,
    "display_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "SectionMaster_pkey" PRIMARY KEY ("section_id")
);

-- CreateTable
CREATE TABLE "SubsectionMaster" (
    "subsection_id" SERIAL NOT NULL,
    "section_id" INTEGER NOT NULL,
    "subsection_name" TEXT NOT NULL,

    CONSTRAINT "SubsectionMaster_pkey" PRIMARY KEY ("subsection_id")
);

-- CreateTable
CREATE TABLE "ParameterCategory" (
    "category_id" SERIAL NOT NULL,
    "category_name" TEXT NOT NULL,

    CONSTRAINT "ParameterCategory_pkey" PRIMARY KEY ("category_id")
);

-- CreateTable
CREATE TABLE "ParameterMaster" (
    "parameter_id" SERIAL NOT NULL,
    "subsection_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,
    "field_type" TEXT,
    "control_type" TEXT,
    "mandatory" BOOLEAN NOT NULL DEFAULT false,
    "validation_rule" TEXT,

    CONSTRAINT "ParameterMaster_pkey" PRIMARY KEY ("parameter_id")
);

-- CreateTable
CREATE TABLE "ParameterValue" (
    "value_id" SERIAL NOT NULL,
    "parameter_id" INTEGER NOT NULL,
    "entity_id" INTEGER NOT NULL,
    "value" TEXT,
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ParameterValue_pkey" PRIMARY KEY ("value_id")
);

-- CreateTable
CREATE TABLE "WorkflowMaster" (
    "workflow_id" SERIAL NOT NULL,
    "entity_type_id" INTEGER NOT NULL,
    "trigger" TEXT,
    "action" TEXT,
    "stage" TEXT,

    CONSTRAINT "WorkflowMaster_pkey" PRIMARY KEY ("workflow_id")
);

-- CreateTable
CREATE TABLE "ApprovalMatrix" (
    "approval_id" SERIAL NOT NULL,
    "entity_type_id" INTEGER NOT NULL,
    "form_id" INTEGER NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "approver" TEXT,

    CONSTRAINT "ApprovalMatrix_pkey" PRIMARY KEY ("approval_id")
);

-- CreateTable
CREATE TABLE "EmailTemplate" (
    "template_id" SERIAL NOT NULL,
    "template_name" TEXT NOT NULL,
    "subject" TEXT,
    "body" TEXT,

    CONSTRAINT "EmailTemplate_pkey" PRIMARY KEY ("template_id")
);

-- CreateTable
CREATE TABLE "NotificationRule" (
    "notification_id" SERIAL NOT NULL,
    "workflow_id" INTEGER NOT NULL,
    "template_id" INTEGER NOT NULL,
    "event_name" TEXT,
    "notify_role" TEXT,

    CONSTRAINT "NotificationRule_pkey" PRIMARY KEY ("notification_id")
);

-- CreateTable
CREATE TABLE "SecurityRole" (
    "role_id" SERIAL NOT NULL,
    "form_id" INTEGER NOT NULL,
    "role_name" TEXT NOT NULL,
    "permission" TEXT,
    "scope" TEXT,

    CONSTRAINT "SecurityRole_pkey" PRIMARY KEY ("role_id")
);

-- CreateTable
CREATE TABLE "ReportMaster" (
    "report_id" SERIAL NOT NULL,
    "entity_type_id" INTEGER NOT NULL,
    "report_name" TEXT NOT NULL,
    "filters" TEXT,
    "output_format" TEXT,

    CONSTRAINT "ReportMaster_pkey" PRIMARY KEY ("report_id")
);

-- CreateTable
CREATE TABLE "DashboardMaster" (
    "dashboard_id" SERIAL NOT NULL,
    "entity_type_id" INTEGER NOT NULL,
    "widget_name" TEXT NOT NULL,
    "metric" TEXT,
    "filter" TEXT,
    "display_type" TEXT,

    CONSTRAINT "DashboardMaster_pkey" PRIMARY KEY ("dashboard_id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "audit_id" SERIAL NOT NULL,
    "entity_id" INTEGER NOT NULL,
    "action" TEXT,
    "user" TEXT,
    "datetime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason" TEXT,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("audit_id")
);

-- CreateTable
CREATE TABLE "FileRepository" (
    "file_id" SERIAL NOT NULL,
    "entity_id" INTEGER NOT NULL,
    "parameter_id" INTEGER NOT NULL,
    "file_name" TEXT NOT NULL,
    "path" TEXT,

    CONSTRAINT "FileRepository_pkey" PRIMARY KEY ("file_id")
);

-- AddForeignKey
ALTER TABLE "EntityType" ADD CONSTRAINT "EntityType_domain_id_fkey" FOREIGN KEY ("domain_id") REFERENCES "Domain"("domain_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entity" ADD CONSTRAINT "Entity_entity_type_id_fkey" FOREIGN KEY ("entity_type_id") REFERENCES "EntityType"("entity_type_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityRelationshipRule" ADD CONSTRAINT "EntityRelationshipRule_source_entity_type_id_fkey" FOREIGN KEY ("source_entity_type_id") REFERENCES "EntityType"("entity_type_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityRelationshipRule" ADD CONSTRAINT "EntityRelationshipRule_target_entity_type_id_fkey" FOREIGN KEY ("target_entity_type_id") REFERENCES "EntityType"("entity_type_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormMaster" ADD CONSTRAINT "FormMaster_entity_type_id_fkey" FOREIGN KEY ("entity_type_id") REFERENCES "EntityType"("entity_type_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SectionMaster" ADD CONSTRAINT "SectionMaster_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "FormMaster"("form_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubsectionMaster" ADD CONSTRAINT "SubsectionMaster_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "SectionMaster"("section_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParameterMaster" ADD CONSTRAINT "ParameterMaster_subsection_id_fkey" FOREIGN KEY ("subsection_id") REFERENCES "SubsectionMaster"("subsection_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParameterMaster" ADD CONSTRAINT "ParameterMaster_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "ParameterCategory"("category_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParameterValue" ADD CONSTRAINT "ParameterValue_parameter_id_fkey" FOREIGN KEY ("parameter_id") REFERENCES "ParameterMaster"("parameter_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParameterValue" ADD CONSTRAINT "ParameterValue_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "Entity"("entity_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowMaster" ADD CONSTRAINT "WorkflowMaster_entity_type_id_fkey" FOREIGN KEY ("entity_type_id") REFERENCES "EntityType"("entity_type_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprovalMatrix" ADD CONSTRAINT "ApprovalMatrix_entity_type_id_fkey" FOREIGN KEY ("entity_type_id") REFERENCES "EntityType"("entity_type_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprovalMatrix" ADD CONSTRAINT "ApprovalMatrix_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "FormMaster"("form_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationRule" ADD CONSTRAINT "NotificationRule_workflow_id_fkey" FOREIGN KEY ("workflow_id") REFERENCES "WorkflowMaster"("workflow_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationRule" ADD CONSTRAINT "NotificationRule_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "EmailTemplate"("template_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SecurityRole" ADD CONSTRAINT "SecurityRole_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "FormMaster"("form_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportMaster" ADD CONSTRAINT "ReportMaster_entity_type_id_fkey" FOREIGN KEY ("entity_type_id") REFERENCES "EntityType"("entity_type_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DashboardMaster" ADD CONSTRAINT "DashboardMaster_entity_type_id_fkey" FOREIGN KEY ("entity_type_id") REFERENCES "EntityType"("entity_type_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "Entity"("entity_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileRepository" ADD CONSTRAINT "FileRepository_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "Entity"("entity_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileRepository" ADD CONSTRAINT "FileRepository_parameter_id_fkey" FOREIGN KEY ("parameter_id") REFERENCES "ParameterMaster"("parameter_id") ON DELETE RESTRICT ON UPDATE CASCADE;
