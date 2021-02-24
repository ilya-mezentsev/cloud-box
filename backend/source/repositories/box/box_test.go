package box

import (
	"cloud-box-backend/source/config"
	"cloud-box-backend/source/meta/mock/repositories"
	"cloud-box-backend/source/meta/models"
	"cloud-box-backend/source/repositories/connection"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
	"github.com/stretchr/testify/assert"
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

func TestRepository_GetBoxesEmpty(t *testing.T) {
	defer repositories.MustReinstall(db)

	boxes, err := repository.GetBoxes("some-hash")

	assert.Nil(t, err)
	assert.Empty(t, boxes)
}

func TestRepository_GetBoxesSuccess(t *testing.T) {
	defer repositories.MustReinstall(db)
	h := "some-hash"
	b := models.BoxView{
		TunnelDomain: "www.google.com",
		UUID:         "some-uuid",
		Alias:        "",
	}
	db.MustExec(`insert into account(hash) values($1)`, h)
	_, err := db.NamedExec(
		`insert into box(tunnel_domain, uuid, account_hash) values(:tunnel_domain, :uuid, :account_hash)`,
		map[string]interface{}{
			"tunnel_domain": b.TunnelDomain,
			"uuid":          b.UUID,
			"account_hash":  h,
		},
	)
	assert.Nil(t, err)

	boxes, err := repository.GetBoxes("some-hash")

	assert.Nil(t, err)
	assert.Contains(t, boxes, b)
}

func TestRepository_GetBoxesNoTableError(t *testing.T) {
	repositories.MustDropBox(db)
	defer repositories.MustReinstall(db)

	_, err := repository.GetBoxes("some-hash")

	assert.NotNil(t, err)
}

func TestRepository_BindBoxWithAccountSuccess(t *testing.T) {
	defer repositories.MustReinstall(db)
	h := "some-hash"
	b := models.BoxView{
		TunnelDomain: "www.google.com",
		UUID:         "some-uuid",
		Alias:        "some-alias",
	}
	db.MustExec(`insert into account(hash) values($1)`, h)
	_, err := db.NamedExec(`insert into box(tunnel_domain, uuid, alias) values(:tunnel_domain, :uuid, :alias)`, b)
	assert.Nil(t, err)

	err = repository.BindBoxWithAccount(models.BindBoxWithAccount{
		AccountHash: h,
		BoxUUID:     b.UUID,
		BoxAlias:    "some-another-alias",
	})

	var boxAccountHash string
	_ = db.Get(&boxAccountHash, `select trim(account_hash) from box where uuid = $1`, b.UUID)

	var boxAlias string
	_ = db.Get(&boxAlias, `select trim(alias) from box where uuid = $1`, b.UUID)

	assert.Nil(t, err)
	assert.Equal(t, h, boxAccountHash)
	assert.Equal(t, "some-another-alias", boxAlias)
}

func TestRepository_BindBoxWithAccountNotExistsHash(t *testing.T) {
	defer repositories.MustReinstall(db)
	h := "some-hash"
	b := models.BoxView{
		TunnelDomain: "www.google.com",
		UUID:         "some-uuid",
	}
	_, err := db.NamedExec(`insert into box(tunnel_domain, uuid) values(:tunnel_domain, :uuid)`, b)
	assert.Nil(t, err)

	err = repository.BindBoxWithAccount(models.BindBoxWithAccount{
		AccountHash: h,
		BoxUUID:     b.UUID,
		BoxAlias:    "some-alias",
	})

	var boxAccountHash string
	_ = db.Get(&boxAccountHash, `select trim(account_hash) from box where uuid = $1`, b.UUID)

	assert.NotNil(t, err)
	assert.Empty(t, boxAccountHash)
}

func TestRepository_RegisterSuccess(t *testing.T) {
	defer repositories.MustReinstall(db)
	b := models.BoxRegistration{
		TunnelDomain: "www.google.com",
		UUID:         "some-uuid",
	}

	err := repository.Register(b)

	var boxExists bool
	_ = db.Get(&boxExists, `select 1 from box where uuid = $1`, b.UUID)

	assert.Nil(t, err)
	assert.True(t, boxExists)
}

func TestRepository_RegisterWithExistsUUID(t *testing.T) {
	defer repositories.MustReinstall(db)
	b := models.BoxRegistration{
		TunnelDomain: "www.google.com",
		UUID:         "some-uuid",
	}
	_, err := db.NamedExec(`insert into box(tunnel_domain, uuid) values(:tunnel_domain, :uuid)`, b)
	assert.Nil(t, err)

	b.TunnelDomain = "yandex.ru"

	err = repository.Register(b)

	var updatedBox models.BoxView
	_ = db.Get(&updatedBox, `select trim(tunnel_domain) tunnel_domain, trim(uuid) uuid from box where uuid = $1`, b.UUID)

	assert.Nil(t, err)
	assert.Equal(t, b.TunnelDomain, updatedBox.TunnelDomain)
}

func TestRepository_UpdateBoxSuccess(t *testing.T) {
	defer repositories.MustReinstall(db)

	b := models.BoxRegistration{
		TunnelDomain: "www.google.com",
		UUID:         "some-uuid",
	}
	_, err := db.NamedExec(`insert into box(tunnel_domain, uuid) values(:tunnel_domain, :uuid)`, b)
	assert.Nil(t, err)

	err = repository.UpdateBox(models.BoxUpdate{
		UUID:  b.UUID,
		Alias: "some-another-alias",
	})

	var boxAlias string
	_ = db.Get(&boxAlias, `select trim(alias) from box where uuid = $1`, b.UUID)

	assert.Nil(t, err)
	assert.Equal(t, "some-another-alias", boxAlias)
}

func TestRepository_UpdateBoxNotTableError(t *testing.T) {
	repositories.MustDropBox(db)
	defer repositories.MustReinstall(db)

	err := repository.UpdateBox(models.BoxUpdate{
		UUID:  "some-uuid",
		Alias: "some-another-alias",
	})

	assert.NotNil(t, err)
}
