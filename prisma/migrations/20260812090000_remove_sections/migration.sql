ALTER TABLE "survey_questions" ADD COLUMN "surveyId" TEXT;

UPDATE "survey_questions" q
SET "surveyId" = s."surveyId"
FROM "survey_sections" s
WHERE q."sectionId" = s."id";

ALTER TABLE "survey_questions" ALTER COLUMN "surveyId" SET NOT NULL;

ALTER TABLE "survey_questions" DROP CONSTRAINT IF EXISTS "survey_questions_sectionId_fkey";
ALTER TABLE "survey_questions" DROP COLUMN "sectionId";

ALTER TABLE "survey_questions"
  ADD CONSTRAINT "survey_questions_surveyId_fkey"
  FOREIGN KEY ("surveyId") REFERENCES "surveys"("id") ON DELETE CASCADE ON UPDATE CASCADE;

DROP TABLE "survey_sections";