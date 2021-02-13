package repositories

import (
	"cloud-box-backend/source/repositories/schema"
	"github.com/jmoiron/sqlx"
)

const (
	dropAccount     = `drop table if exists account cascade`
	dropCredentials = `drop table if exists account_credentials`
	dropBox         = `drop table if exists box`
)

func MustDropTables(db *sqlx.DB) {
	for _, q := range []string{dropAccount, dropCredentials, dropBox} {
		db.MustExec(q)
	}
}

func MustDropAccount(db *sqlx.DB) {
	db.MustExec(dropAccount)
}

func MustDropCredentials(db *sqlx.DB) {
	db.MustExec(dropCredentials)
}

func MustDropBox(db *sqlx.DB) {
	db.MustExec(dropBox)
}

func MustReinstall(db *sqlx.DB) {
	MustDropTables(db)

	db.MustExec(schema.Schema)
}
