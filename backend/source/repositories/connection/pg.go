package connection

import (
	"cloud-box-backend/source/config"
	"fmt"
)

func BuildPostgresString(c config.DBConfigsRepository) string {
	return fmt.Sprintf(
		"host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		c.DBHost(),
		c.DBPort(),
		c.DBUser(),
		c.DBPassword(),
		c.DBName(),
	)
}
