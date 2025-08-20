PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "migrations"(
  "id" integer primary key autoincrement not null,
  "migration" varchar not null,
  "batch" integer not null
);
INSERT INTO migrations VALUES(1,'000_personal_access_tokens',1);
INSERT INTO migrations VALUES(2,'001_users',1);
INSERT INTO migrations VALUES(3,'002_categories',1);
INSERT INTO migrations VALUES(4,'003_journals',1);
INSERT INTO migrations VALUES(5,'004_habits',1);
INSERT INTO migrations VALUES(6,'005_habit_completions',1);
INSERT INTO migrations VALUES(7,'006_category_habit',1);
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
INSERT INTO personal_access_tokens VALUES(1,'App\Models\User',1,'API Token','e3a94983e8d0b91338362eae7d292ec48772ba599fcfe0d2eb8a39e7e766e164','["*"]','2025-08-20 07:09:55',NULL,'2025-08-20 07:07:24','2025-08-20 07:09:55');
CREATE TABLE IF NOT EXISTS "users"(
  "id" integer primary key autoincrement not null,
  "email" varchar not null,
  "username" varchar not null,
  "password" varchar not null,
  "date_format" varchar not null default 'dd/mm/yyyy',
  "created_at" datetime,
  "updated_at" datetime
);
INSERT INTO users VALUES(1,'test@example.com','Test User','$2y$12$UiehJ9Fxh/dannNMtcGoYeX.2VUh5X0XFcu0mizaNsrD3OdOS63ae','dd/mm/yyyy','2025-08-20 07:06:35','2025-08-20 07:06:35');
CREATE TABLE IF NOT EXISTS "categories"(
  "id" integer primary key autoincrement not null,
  "title" varchar not null,
  "user_id" integer not null,
  "created_at" datetime,
  "updated_at" datetime,
  foreign key("user_id") references "users"("id") on delete cascade
);
INSERT INTO categories VALUES(1,'Fitness',1,'2025-08-20 07:06:35','2025-08-20 07:06:35');
INSERT INTO categories VALUES(2,'Self-care',1,'2025-08-20 07:06:35','2025-08-20 07:06:35');
INSERT INTO categories VALUES(3,'Health',1,'2025-08-20 07:06:35','2025-08-20 07:06:35');
INSERT INTO categories VALUES(4,'Finance',1,'2025-08-20 07:06:35','2025-08-20 07:06:35');
INSERT INTO categories VALUES(5,'Learning',1,'2025-08-20 07:06:35','2025-08-20 07:06:35');
INSERT INTO categories VALUES(6,'Nutrition',1,'2025-08-20 07:06:35','2025-08-20 07:06:35');
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
INSERT INTO habits VALUES(1,'Duolingo',1,'daily',1,NULL,'2025-08-20 00:00:00',NULL,'2025-08-20 07:06:35','2025-08-20 07:06:35');
INSERT INTO habits VALUES(2,'Home Workout',1,'custom_daily',3,NULL,'2025-06-01 00:00:00',NULL,'2025-08-20 07:06:35','2025-08-20 07:06:35');
INSERT INTO habits VALUES(3,'Pay Bills',1,'monthly',1,NULL,'2025-01-25 00:00:00',NULL,'2025-08-20 07:06:35','2025-08-20 07:06:35');
INSERT INTO habits VALUES(4,'Yoga',1,'custom_weekly',1,'["Monday","Tuesday","Friday","Sunday"]','2025-05-01 00:00:00',NULL,'2025-08-20 07:06:35','2025-08-20 07:06:35');
INSERT INTO habits VALUES(5,'Drink enough water',1,'daily',1,NULL,'2025-05-15 00:00:00',NULL,'2025-08-20 07:06:35','2025-08-20 07:06:35');
INSERT INTO habits VALUES(6,'Make Bed',1,'daily',1,NULL,'2025-03-27 00:00:00',NULL,'2025-08-20 07:06:35','2025-08-20 07:06:35');
INSERT INTO habits VALUES(7,'Screentime under 3h',1,'daily',1,NULL,'2025-01-01 00:00:00',NULL,'2025-08-20 07:06:35','2025-08-20 07:06:35');
INSERT INTO habits VALUES(8,'5 fruits or veggies',1,'daily',1,NULL,'2025-01-01 00:00:00',NULL,'2025-08-20 07:06:35','2025-08-20 07:06:35');
INSERT INTO habits VALUES(9,'2h Programming',1,'custom_weekly',1,'["Saturday","Sunday"]','2025-04-30 00:00:00',NULL,'2025-08-20 07:06:35','2025-08-20 07:06:35');
CREATE TABLE IF NOT EXISTS "habit_completions"(
  "id" integer primary key autoincrement not null,
  "habit_id" integer not null,
  "date" date not null,
  "created_at" datetime,
  "updated_at" datetime,
  foreign key("habit_id") references "habits"("id") on delete cascade
);
CREATE TABLE IF NOT EXISTS "category_habit"(
  "habit_id" integer not null,
  "category_id" integer not null,
  foreign key("habit_id") references "habits"("id") on delete cascade,
  foreign key("category_id") references "categories"("id") on delete cascade,
  primary key("habit_id", "category_id")
);
INSERT INTO category_habit VALUES(1,5);
INSERT INTO category_habit VALUES(2,1);
INSERT INTO category_habit VALUES(2,3);
INSERT INTO category_habit VALUES(3,4);
INSERT INTO category_habit VALUES(4,2);
INSERT INTO category_habit VALUES(4,3);
INSERT INTO category_habit VALUES(5,3);
INSERT INTO category_habit VALUES(6,2);
INSERT INTO category_habit VALUES(7,2);
INSERT INTO category_habit VALUES(8,3);
INSERT INTO category_habit VALUES(8,6);
INSERT INTO category_habit VALUES(9,5);
DELETE FROM sqlite_sequence;
INSERT INTO sqlite_sequence VALUES('migrations',7);
INSERT INTO sqlite_sequence VALUES('users',1);
INSERT INTO sqlite_sequence VALUES('categories',6);
INSERT INTO sqlite_sequence VALUES('habits',9);
INSERT INTO sqlite_sequence VALUES('personal_access_tokens',1);
CREATE INDEX "personal_access_tokens_tokenable_type_tokenable_id_index" on "personal_access_tokens"(
  "tokenable_type",
  "tokenable_id"
);
CREATE UNIQUE INDEX "personal_access_tokens_token_unique" on "personal_access_tokens"(
  "token"
);
CREATE UNIQUE INDEX "users_email_unique" on "users"("email");
CREATE UNIQUE INDEX "habit_completions_habit_id_date_unique" on "habit_completions"(
  "habit_id",
  "date"
);
COMMIT;
