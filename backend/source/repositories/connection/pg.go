package connection

import (
	"cloud-box-backend/source/config"
	"cloud-box-backend/source/shared/logger"
	"fmt"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
	"time"
)

func MustGetConnection(c config.DBConfigsRepository) *sqlx.DB {
	tryCount := 0
	for tryCount <= c.DBConnectionRetriesCount() {
		tryCount++

		db, err := sqlx.Open("postgres", BuildPostgresString(c))
		if err != nil {
			logger.WarningF("Unable to connect to DB. Try number: %d", tryCount)
			time.Sleep(time.Second * time.Duration(c.DBConnectionRetryTimeout()))
		} else {
			return db
		}
	}

	panic(fmt.Errorf("unable to connect to DB. retry count: %d", tryCount))
}

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
