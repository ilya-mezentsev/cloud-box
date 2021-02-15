package user

import (
	"cloud-box-backend/source/meta/models"
	"cloud-box-backend/source/meta/types"
	"database/sql"
	"github.com/jmoiron/sqlx"
)

const (
	addHashQuery        = `insert into account(hash) values($1)`
	addCredentialsQuery = `insert into account_credentials(mail, password, account_hash) values(:mail, :password, :hash)`
	mailExistsQuery     = `select 1 from account_credentials where mail = $1`

	getHashQuery = `select trim(account_hash) account_hash from account_credentials where mail = $1 and password = $2`

	hashExistsQuery = `select 1 from account where hash = $1`
)

type Repository struct {
	db *sqlx.DB
}

func New(db *sqlx.DB) Repository {
	return Repository{db}
}

func (r Repository) Register(user models.UserRegistration) error {
	var mailExists bool
	err := r.db.Get(&mailExists, mailExistsQuery, user.Mail)
	if err != nil && err != sql.ErrNoRows {
		return err
	} else if mailExists {
		return types.MailAlreadyExists{}
	}

	_, err = r.db.Exec(addHashQuery, user.Hash)
	if err != nil {
		return err
	}

	_, err = r.db.NamedExec(addCredentialsQuery, user)

	return err
}

func (r Repository) GetHash(user models.UserCredentials) (string, error) {
	var hash string
	err := r.db.Get(&hash, getHashQuery, user.Mail, user.Password)
	if err == sql.ErrNoRows {
		err = types.CredentialsNotFound{}
	}

	return hash, err
}

func (r Repository) HashExists(hash string) (bool, error) {
	var hashExists bool
	err := r.db.Get(&hashExists, hashExistsQuery, hash)
	if err == sql.ErrNoRows {
		hashExists = false
		err = nil
	}

	return hashExists, err
}
