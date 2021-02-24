package models

type (
	BoxUpdate struct {
		UUID  string `json:"uuid" db:"uuid" validate:"required,uuid4"`
		Alias string `json:"alias" db:"alias" validate:"required,min=3"`
	}

	BoxView struct {
		UUID         string `json:"uuid" db:"uuid"`
		Alias        string `json:"alias" db:"alias"`
		TunnelDomain string `json:"tunnel_domain" db:"tunnel_domain"`
	}

	BindBoxWithAccount struct {
		AccountHash string `json:"account_hash" db:"account_hash" validate:"required"`
		BoxUUID     string `json:"uuid" db:"uuid" validate:"required,uuid4"`
		BoxAlias    string `json:"alias" db:"alias" validate:"required,min=3"`
	}
)
