CREATE TABLE IF NOT EXISTS "workspaceMembers" (
	"id" serial NOT NULL,
  "user_id" INT not NULL,
	"channel_id" INT NOT NULL UNIQUE,
	CONSTRAINT channels_members_pk PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);
