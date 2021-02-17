package main

import (
	"cloud-box-backend/source/config"
	boxControllerConstructor "cloud-box-backend/source/controllers/box"
	registrationControllerConstructor "cloud-box-backend/source/controllers/registration"
	sessionControllerConstructor "cloud-box-backend/source/controllers/session"
	boxRepositoryConstructor "cloud-box-backend/source/repositories/box"
	"cloud-box-backend/source/repositories/connection"
	userRepositoryConstructor "cloud-box-backend/source/repositories/user"
	boxServiceConstructor "cloud-box-backend/source/services/box"
	boxRegistrationServiceConstructor "cloud-box-backend/source/services/registration/box"
	userRegistrationServiceConstructor "cloud-box-backend/source/services/registration/user"
	sessionServiceConstructor "cloud-box-backend/source/services/session"
	"cloud-box-backend/source/shared/logger"
	"flag"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
	"os"
)

var (
	configFilePath = flag.String("config", "/dev/null", "Set path to configs file")

	configsRepository config.Repository

	userRepository userRepositoryConstructor.Repository
	boxRepository  boxRepositoryConstructor.Repository

	userRegistrationService userRegistrationServiceConstructor.Service
	boxRegistrationService  boxRegistrationServiceConstructor.Service
	boxService              boxServiceConstructor.Service
	sessionService          sessionServiceConstructor.Service

	registrationController registrationControllerConstructor.Controller
	boxController          boxControllerConstructor.Controller
	sessionController      sessionControllerConstructor.Controller
)

func init() {
	flag.Parse()

	configsRepository = config.MustNew(*configFilePath)

	db := sqlx.MustOpen("postgres", connection.BuildPostgresString(configsRepository))

	userRepository = userRepositoryConstructor.New(db)
	boxRepository = boxRepositoryConstructor.New(db)

	userRegistrationService = userRegistrationServiceConstructor.New(userRepository)
	boxRegistrationService = boxRegistrationServiceConstructor.New(boxRepository)
	boxService = boxServiceConstructor.New(boxRepository)
	sessionService = sessionServiceConstructor.New(configsRepository, userRepository)

	registrationController = registrationControllerConstructor.New(userRegistrationService, boxRegistrationService)
	boxController = boxControllerConstructor.New(boxService)
	sessionController = sessionControllerConstructor.New(sessionService)
}

func main() {
	r := gin.Default()

	initRoutes(r)

	err := r.Run(fmt.Sprintf(":%d", configsRepository.ServerPort()))
	if err != nil {
		logger.ErrorF("Unable to start server: %v", err)
		os.Exit(1)
	}
}

func initRoutes(
	r *gin.Engine,
) {
	r.POST("/registration/user", registrationController.RegisterUser)

	r.GET("/session", sessionController.GetSession)
	r.POST("/session", sessionController.CreateSession)
	r.DELETE("/session", sessionController.DeleteSession)

	sessionTokenAuthorized := r.Group("/")
	sessionTokenAuthorized.Use(sessionService.HasSession())
	{
		sessionTokenAuthorized.GET("/boxes/:account_hash", boxController.GetBoxes)
		sessionTokenAuthorized.POST("/box", boxController.BindBoxWithAccount)
	}

	boxBasicAuthorized := r.Group("/")
	boxBasicAuthorized.Use(gin.BasicAuth(gin.Accounts{
		configsRepository.AuthBasicBoxUser(): configsRepository.AuthBasicBoxPassword(),
	}))
	{
		boxBasicAuthorized.POST("/registration/box", registrationController.RegisterBox)
	}
}
