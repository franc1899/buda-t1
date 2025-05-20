-- CreateTable
CREATE TABLE "SpreadRecord" (
    "id" SERIAL NOT NULL,
    "market" VARCHAR(20) NOT NULL,
    "value" DECIMAL(20,8) NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SpreadRecord_pkey" PRIMARY KEY ("id")
);
