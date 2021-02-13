package models

type (
	UserCredentials struct {
		Mail     string `json:"mail" db:"mail" validate:"required,email"`
		Password string `json:"password" db:"password" validate:"required,min=6,max=24"`
	}

	UserRegistration struct {
		UserCredentials
		Hash string `db:"hash"`
	}

	BoxRegistration struct {
		TunnelDomain string `json:"tunnel_domain" db:"tunnel_domain" validate:"required,fqdn"`
		UUID         string `json:"uuid" db:"uuid" validate:"required,uuid4"`
	}
)
