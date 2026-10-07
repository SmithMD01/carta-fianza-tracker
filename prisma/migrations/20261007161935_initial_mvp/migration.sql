-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "projectCode" TEXT NOT NULL,
    "cui" TEXT NOT NULL,
    "referenceName" TEXT NOT NULL,
    "formalName" TEXT NOT NULL,
    "entityName" TEXT NOT NULL,
    "projectValue" DECIMAL(18,2) NOT NULL,
    "selectionProcess" TEXT NOT NULL,
    "consortiumWith" TEXT,
    "wonWith" TEXT,
    "projectStage" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinancialEntity" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinancialEntity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Guarantee" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "financialEntityId" TEXT,
    "guaranteeNumber" TEXT,
    "guaranteeReason" TEXT NOT NULL,
    "guaranteeGroups" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "validFrom" DATE,
    "validityDays" INTEGER,
    "expiresAt" DATE,
    "requestingArea" TEXT NOT NULL,
    "vof" TEXT,
    "carPolicy" TEXT,
    "guaranteeValue" DECIMAL(18,2) NOT NULL,
    "guaranteePercentage" DECIMAL(7,4),
    "componentValue" DECIMAL(18,2),
    "costCenter" TEXT,
    "observations" TEXT,
    "premium" DECIMAL(18,2),
    "collateral" DECIMAL(18,2),
    "collateralPercentage" DECIMAL(7,4),
    "renewalDays" INTEGER NOT NULL DEFAULT 0,
    "renewalNumber" INTEGER,
    "originalGuaranteeId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Solicitud',
    "requestStatus" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Guarantee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_projectCode_key" ON "Project"("projectCode");

-- CreateIndex
CREATE UNIQUE INDEX "Project_cui_key" ON "Project"("cui");

-- CreateIndex
CREATE INDEX "Project_projectStage_idx" ON "Project"("projectStage");

-- CreateIndex
CREATE UNIQUE INDEX "FinancialEntity_name_key" ON "FinancialEntity"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Guarantee_guaranteeNumber_key" ON "Guarantee"("guaranteeNumber");

-- CreateIndex
CREATE INDEX "Guarantee_projectId_idx" ON "Guarantee"("projectId");

-- CreateIndex
CREATE INDEX "Guarantee_financialEntityId_idx" ON "Guarantee"("financialEntityId");

-- CreateIndex
CREATE INDEX "Guarantee_expiresAt_idx" ON "Guarantee"("expiresAt");

-- CreateIndex
CREATE INDEX "Guarantee_status_idx" ON "Guarantee"("status");

-- CreateIndex
CREATE INDEX "Guarantee_projectId_status_idx" ON "Guarantee"("projectId", "status");

-- AddForeignKey
ALTER TABLE "Guarantee" ADD CONSTRAINT "Guarantee_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guarantee" ADD CONSTRAINT "Guarantee_financialEntityId_fkey" FOREIGN KEY ("financialEntityId") REFERENCES "FinancialEntity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guarantee" ADD CONSTRAINT "Guarantee_originalGuaranteeId_fkey" FOREIGN KEY ("originalGuaranteeId") REFERENCES "Guarantee"("id") ON DELETE SET NULL ON UPDATE CASCADE;
