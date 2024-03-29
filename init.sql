CREATE TABLE "session" (
    "sid" varchar NOT NULL COLLATE "default",
    "sess" json NOT NULL,
	"expire" TIMESTAMP(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");

CREATE TABLE "account_type" (
    "id" INTEGER PRIMARY KEY,
    "type" VARCHAR(50) NOT NULL
);

INSERT INTO "account_type" ("id", "type") VALUES
    (1, 'admin'),
    (2, 'normal'),
    (3, 'guest');

CREATE TABLE "users" (
    "id" SERIAL PRIMARY KEY,
    "account_type" INTEGER REFERENCES "account_type"("id") NOT NULL,
    "username" VARCHAR(30) UNIQUE NOT NULL,
    "display_name" VARCHAR(30) UNIQUE NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "salt" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "created_at" TIMESTAMP DEFAULT NOW()
);

CREATE INDEX "IDX_users_username" ON "users" ("username");

CREATE TABLE "quote" (
    "id" SERIAL PRIMARY KEY,
    "text" TEXT NOT NULL,
    "author" TEXT,
    "source" TEXT,
    "added_at" TIMESTAMP DEFAULT NOW()
);

ALTER SEQUENCE quote_id_seq RESTART WITH 1001;

CREATE TABLE "results" (
    "id" SERIAL PRIMARY KEY,
    "user_id" INTEGER REFERENCES "users"("id"),
    "quote_id" INTEGER REFERENCES "quote"("id"),
    "wpm" INTEGER NOT NULL,
    "accuracy" DECIMAL NOT NULL,
    "played_at" TIMESTAMP DEFAULT NOW()
);

CREATE FUNCTION generate_username() RETURNS text AS $$
DECLARE
    guest_username text;
    done bool;
BEGIN
    done := false;
    WHILE NOT done LOOP
        guest_username := concat('Guest', floor(random() * 900000) + 100000);
        done := NOT exists(SELECT 1 FROM users WHERE username=guest_username);
    END LOOP;
    RETURN guest_username;
END;
$$ LANGUAGE PLPGSQL VOLATILE;