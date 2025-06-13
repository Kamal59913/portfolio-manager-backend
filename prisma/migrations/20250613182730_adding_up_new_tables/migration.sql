-- AlterTable
ALTER TABLE "user" ADD COLUMN     "cv_pdf" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "image_url" TEXT;

-- CreateTable
CREATE TABLE "user_title" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "user_title_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_social_link" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "user_social_link_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "about" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image_url" TEXT,
    "projects_completed" INTEGER NOT NULL,
    "years_experience" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "about_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skill" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "skill_icon" TEXT NOT NULL,
    "experience" TEXT,
    "projects" INTEGER NOT NULL DEFAULT 0,
    "proficiency_rank" INTEGER NOT NULL,
    "skill_type" TEXT NOT NULL,
    "level_of_skill" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "technology" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "projects_completed" INTEGER NOT NULL,
    "years_experience" INTEGER NOT NULL,
    "certifications" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "technology_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "experience" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "fromDate" TIMESTAMP(3) NOT NULL,
    "toDate" TIMESTAMP(3),
    "details" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_experience" (
    "id" TEXT NOT NULL,
    "years" INTEGER NOT NULL,
    "projects_delivered" INTEGER NOT NULL,
    "team_members_mentored" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "work_experience_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_social_link_type_userId_key" ON "user_social_link"("type", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "about_userId_key" ON "about"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "work_experience_userId_key" ON "work_experience"("userId");

-- AddForeignKey
ALTER TABLE "user_title" ADD CONSTRAINT "user_title_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_social_link" ADD CONSTRAINT "user_social_link_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "about" ADD CONSTRAINT "about_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skill" ADD CONSTRAINT "skill_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "technology" ADD CONSTRAINT "technology_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experience" ADD CONSTRAINT "experience_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_experience" ADD CONSTRAINT "work_experience_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
