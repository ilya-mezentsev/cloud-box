package password

import (
	"cloud-box-backend/source/meta/models"
	"cloud-box-backend/source/services/shared/hash"
	"fmt"
)

func Generate(u models.UserCredentials) string {
	return hash.Md5(fmt.Sprintf("%s_%s", u.Mail, u.Password))
}
