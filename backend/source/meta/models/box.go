package models

type (
	Box BoxRegistration

	BindBoxWithAccount struct {
		AccountHash string `json:"account_hash"`
		BoxUUID     string `json:"box_uuid" validate:"required,uuid4"`
	}
)
