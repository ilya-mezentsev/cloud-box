package interfaces

import "cloud-box-backend/source/meta/models"

type (
	UserRegistrationRepository interface {
		Register(user models.UserRegistration) error
	}

	UserCredentialsRepository interface {
		GetHash(user models.UserCredentials) (string, error)
		HashExists(hash string) (bool, error)
	}

	BoxRegistrationRepository interface {
		Register(box models.BoxRegistration) error
	}

	BoxRepository interface {
		GetBoxes(accountHash string) ([]models.Box, error)
		BindBoxWithAccount(accountHash, boxUUID string) error
	}
)
