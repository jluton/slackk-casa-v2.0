CREATE TABLE IF NOT EXISTS "workspacemembers" (
	"id" serial NOT NULL,
  "username" varchar(60) not NULL,
	"workspace_id" INT NOT NULL,
	CONSTRAINT channels_members_pk PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);
