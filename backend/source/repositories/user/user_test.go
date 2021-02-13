package user

import (
	"cloud-box-backend/source/config"
	"cloud-box-backend/source/meta/mock/repositories"
	"cloud-box-backend/source/meta/models"
	"cloud-box-backend/source/meta/types"
	"cloud-box-backend/source/repositories/connection"
	"errors"
	"flag"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
	"github.com/stretchr/testify/assert"
	"io/ioutil"
	"log"
	"os"
	"testing"
)

var (
	db         *sqlx.DB
	repository Repository
)

func init() {
	db = sqlx.MustOpen(
		"postgres",
		connection.BuildPostgresString(config.Default()),
	)
	repository = New(db)

	repositories.MustReinstall(db)
}

func TestMain(m *testing.M) {
	flag.Parse()
	testing.Init()

	if testing.Short() {
		os.Exit(0)
	} else {
		log.SetOutput(ioutil.Discard)
		os.Exit(m.Run())
	}
}

func TestRepository_RegisterSuccess(t *testing.T) {
	defer repositories.MustReinstall(db)
	u := models.UserRegistration{
		UserCredentials: models.UserCredentials{
			Mail:     "user@mail.ru",
			Password: "some-password",
		},
		Hash: "some-hash",
	}

	err := repository.Register(u)

	var hashExists bool
	_ = db.Get(&hashExists, `select 1 from account where hash = $1`, u.Hash)

	var credentialsExist bool
	_ = db.Get(&credentialsExist, `select 1 from account_credentials where mail = $1 and password = $2`, u.Mail, u.Password)

	assert.Nil(t, err)
	assert.True(t, hashExists)
	assert.True(t, credentialsExist)
}

func TestRepository_RegisterMailAlreadyExists(t *testing.T) {
	defer repositories.MustReinstall(db)
	u := models.UserRegistration{
		UserCredentials: models.UserCredentials{
			Mail:     "user@mail.ru",
			Password: "some-password",
		},
		Hash: "some-hash",
	}

	db.MustExec(addHashQuery, u.Hash)
	_, err := db.NamedExec(addCredentialsQuery, u)
	assert.Nil(t, err)

	err = repository.Register(u)

	assert.True(t, errors.As(err, &types.MailAlreadyExists{}))
}

func TestRepository_RegisterCredentialsTableNotExists(t *testing.T) {
	repositories.MustDropCredentials(db)
	defer repositories.MustReinstall(db)
	u := models.UserRegistration{
		UserCredentials: models.UserCredentials{
			Mail:     "user@mail.ru",
			Password: "some-password",
		},
		Hash: "some-hash",
	}

	err := repository.Register(u)

	assert.NotNil(t, err)
}

func TestRepository_RegisterAccountTableNotExists(t *testing.T) {
	repositories.MustDropAccount(db)
	defer repositories.MustReinstall(db)
	u := models.UserRegistration{
		UserCredentials: models.UserCredentials{
			Mail:     "user@mail.ru",
			Password: "some-password",
		},
		Hash: "some-hash",
	}

	err := repository.Register(u)

	assert.NotNil(t, err)
}

func TestRepository_GetHashSuccess(t *testing.T) {
	defer repositories.MustReinstall(db)
	u := models.UserRegistration{
		UserCredentials: models.UserCredentials{
			Mail:     "user@mail.ru",
			Password: "some-password",
		},
		Hash: "some-hash",
	}

	db.MustExec(addHashQuery, u.Hash)
	_, err := db.NamedExec(addCredentialsQuery, u)
	assert.Nil(t, err)

	hash, err := repository.GetHash(u.UserCredentials)

	assert.Nil(t, err)
	assert.Equal(t, u.Hash, hash)
}

func TestRepository_GetHashCredentialsNotFound(t *testing.T) {
	defer repositories.MustReinstall(db)
	u := models.UserRegistration{
		UserCredentials: models.UserCredentials{
			Mail:     "user@mail.ru",
			Password: "some-password",
		},
		Hash: "some-hash",
	}

	_, err := repository.GetHash(u.UserCredentials)

	assert.True(t, errors.As(err, &types.CredentialsNotFound{}))
}

func TestRepository_GetHashCredentialsTableNotExists(t *testing.T) {
	repositories.MustDropCredentials(db)
	defer repositories.MustReinstall(db)

	u := models.UserRegistration{
		UserCredentials: models.UserCredentials{
			Mail:     "user@mail.ru",
			Password: "some-password",
		},
		Hash: "some-hash",
	}

	_, err := repository.GetHash(u.UserCredentials)

	assert.NotNil(t, err)
}

func TestRepository_HashExistsTrue(t *testing.T) {
	defer repositories.MustReinstall(db)

	db.MustExec(addHashQuery, "some-hash")

	hashExists, err := repository.HashExists("some-hash")

	assert.Nil(t, err)
	assert.True(t, hashExists)
}

func TestRepository_HashExistsFalse(t *testing.T) {
	defer repositories.MustReinstall(db)

	hashExists, err := repository.HashExists("some-hash")

	assert.Nil(t, err)
	assert.False(t, hashExists)
}
