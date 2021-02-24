package box

import (
	"cloud-box-backend/source/meta/models"
	"github.com/jmoiron/sqlx"
)

const (
	getAccountBoxesQuery = `
	select trim(tunnel_domain) tunnel_domain, trim(uuid) uuid, trim(alias) alias from box
	where account_hash = $1`

	setAccountHashToBoxQuery = `update box set account_hash = :account_hash, alias = :alias where uuid = :uuid`

	updateBoxQuery = `update box set alias = :alias where uuid = :uuid`

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

func (r Repository) GetBoxes(accountHash string) ([]models.BoxView, error) {
	var boxes []models.BoxView
	err := r.db.Select(&boxes, getAccountBoxesQuery, accountHash)

	return boxes, err
}

func (r Repository) BindBoxWithAccount(bindBox models.BindBoxWithAccount) error {
	_, err := r.db.NamedExec(setAccountHashToBoxQuery, bindBox)

	return err
}

func (r Repository) UpdateBox(box models.BoxUpdate) error {
	_, err := r.db.NamedExec(updateBoxQuery, box)

	return err
}

func (r Repository) Register(box models.BoxRegistration) error {
	_, err := r.db.NamedExec(addBoxQuery, box)

	return err
}
