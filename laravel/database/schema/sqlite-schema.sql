CREATE TABLE IF NOT EXISTS "migrations"(
  "id" integer primary key autoincrement not null,
  "migration" varchar not null,
  "batch" integer not null
);
CREATE TABLE IF NOT EXISTS "personal_access_tokens"(
  "id" integer primary key autoincrement not null,
  "tokenable_type" varchar not null,
  "tokenable_id" integer not null,
  "name" varchar not null,
  "token" varchar not null,
  "abilities" text,
  "last_used_at" datetime,
  "expires_at" datetime,
  "created_at" datetime not null,
  "updated_at" datetime not null
);
CREATE INDEX "personal_access_tokens_tokenable_type_tokenable_id_index" on "personal_access_tokens"(
  "tokenable_type",
  "tokenable_id"
);
CREATE UNIQUE INDEX "personal_access_tokens_token_unique" on "personal_access_tokens"(
  "token"
);
CREATE TABLE IF NOT EXISTS "users"(
  "id" integer primary key autoincrement not null,
  "email" varchar not null,
  "username" varchar not null,
  "password" varchar not null,
  "date_format" varchar not null default 'dd/mm/yyyy',
  "created_at" datetime,
  "updated_at" datetime
);
CREATE UNIQUE INDEX "users_email_unique" on "users"("email");
CREATE TABLE IF NOT EXISTS "categories"(
  "id" integer primary key autoincrement not null,
  "title" varchar not null,
  "user_id" integer not null,
  "created_at" datetime,
  "updated_at" datetime,
  foreign key("user_id") references "users"("id") on delete cascade
);
CREATE TABLE IF NOT EXISTS "journals"(
  "id" integer primary key autoincrement not null,
  "title" varchar not null,
  "entry" text not null,
  "user_id" integer not null,
  "created_at" datetime,
  "updated_at" datetime,
  foreign key("user_id") references "users"("id") on delete cascade
);
CREATE TABLE IF NOT EXISTS "habits"(
  "id" integer primary key autoincrement not null,
  "title" varchar not null,
  "user_id" integer not null,
  "frequency" varchar not null,
  "repeat_interval" integer not null default '1',
  "custom_days" text,
  "start_date" date not null,
  "end_date" date,
  "created_at" datetime,
  "updated_at" datetime,
  foreign key("user_id") references "users"("id") on delete cascade
);
CREATE TABLE IF NOT EXISTS "habit_completions"(
  "id" integer primary key autoincrement not null,
  "habit_id" integer not null,
  "date" date not null,
  "created_at" datetime,
  "updated_at" datetime,
  foreign key("habit_id") references "habits"("id") on delete cascade
);
CREATE UNIQUE INDEX "habit_completions_habit_id_date_unique" on "habit_completions"(
  "habit_id",
  "date"
);
CREATE TABLE IF NOT EXISTS "category_habit"(
  "habit_id" integer not null,
  "category_id" integer not null,
  foreign key("habit_id") references "habits"("id") on delete cascade,
  foreign key("category_id") references "categories"("id") on delete cascade,
  primary key("habit_id", "category_id")
);

INSERT INTO migrations VALUES(1,'000_personal_access_tokens',1);
INSERT INTO migrations VALUES(2,'001_users',1);
INSERT INTO migrations VALUES(3,'002_categories',1);
INSERT INTO migrations VALUES(4,'003_journals',1);
INSERT INTO migrations VALUES(5,'004_habits',1);
INSERT INTO migrations VALUES(6,'005_habit_completions',1);
INSERT INTO migrations VALUES(7,'006_category_habit',1);
