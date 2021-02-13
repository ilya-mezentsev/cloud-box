package services

import (
	"cloud-box-backend/source/meta/models"
	"cloud-box-backend/source/services/shared/hash"
	"cloud-box-backend/source/services/shared/password"
	"github.com/google/uuid"
)

const (
	BadUserMail           = "bad@mail.ru"
	ExistsUserMail        = "exists@mail.ru"
	ExistsHash            = "exists-hash"
	DecodedExistsPassword = "some-password"
)

var (
	ExistsPassword = password.Generate(models.UserCredentials{
		Mail:     ExistsUserMail,
		Password: DecodedExistsPassword,
	})
	ExistsUUID = uuid.NewString()
	BadHash    = hash.Md5WithTimeAsKey("bad-hash")
	BadUUID    = uuid.NewString()
)
