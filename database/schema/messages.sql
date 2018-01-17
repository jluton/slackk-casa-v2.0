--   CREATE TABLE IF NOT EXISTS $1 (
-- 	"id" serial NOT NULL,
-- 	"text" varchar(1024) NOT NULL,
--   "username" varchar(1024) NOT NULL,
--   "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
-- 	CONSTRAINT $1_pk PRIMARY KEY ("id")
-- ) WITH (
--   OIDS=FALSE
-- );

CREATE TABLE IF NOT EXISTS messages (
"id" serial NOT NULL,
"text" varchar(1024) NOT NULL,
"username" varchar(1024) NOT NULL,
"workspace_id" varchar(1024),
"special_type" varchar(100),
"createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
CONSTRAINT messages_pk PRIMARY KEY ("id")
) WITH (
OIDS=FALSE
);
