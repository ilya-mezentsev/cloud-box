package box

import (
	"cloud-box-backend/source/meta/models"
	"github.com/jmoiron/sqlx"
)

const (
	getAccountBoxesQuery = `select trim(tunnel_domain) tunnel_domain, trim(uuid) uuid from box where account_hash = $1`

	setAccountHashToBoxQuery = `update box set account_hash = $1 where uuid = $2`

	addBoxQuery = `
	insert into box(tunnel_domain, uuid)
	values(:tunnel_domain, :uuid)
	on conflict (uuid)
	do update
	set tunnel_domain = :tunnel_domain`
)

type Repository struct {
	db *sqlx.DB
}

func New(db *sqlx.DB) Repository {
	return Repository{db}
}

func (r Repository) GetBoxes(accountHash string) ([]models.Box, error) {
	var boxes []models.Box
	err := r.db.Select(&boxes, getAccountBoxesQuery, accountHash)

	return boxes, err
}

func (r Repository) BindBoxWithAccount(accountHash, boxUUID string) error {
	_, err := r.db.Exec(setAccountHashToBoxQuery, accountHash, boxUUID)

	return err
}

func (r Repository) Register(box models.BoxRegistration) error {
	_, err := r.db.NamedExec(addBoxQuery, box)

	return err
}
