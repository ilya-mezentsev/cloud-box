package registration

import (
	"cloud-box-backend/source/controllers/presenter"
	"cloud-box-backend/source/meta/models"
	"cloud-box-backend/source/services/registration/box"
	"cloud-box-backend/source/services/registration/user"
	"github.com/gin-gonic/gin"
)

type Controller struct {
	registerUserService user.Service
	registerBoxService  box.Service
}

func New(
	registerUserService user.Service,
	registerBoxService box.Service,
) Controller {
	return Controller{
		registerUserService: registerUserService,
		registerBoxService:  registerBoxService,
	}
}

func (c Controller) RegisterUser(context *gin.Context) {
	var u models.UserCredentials
	if err := context.ShouldBindJSON(&u); err != nil {
		presenter.MakeInvalidJsonResponse(context)
		return
	}

	presenter.MakeJsonResponse(
		context,
		c.registerUserService.Register(u),
	)
}

func (c Controller) RegisterBox(context *gin.Context) {
	var b models.BoxRegistration
	if err := context.ShouldBindJSON(&b); err != nil {
		presenter.MakeInvalidJsonResponse(context)
		return
	}

	presenter.MakeJsonResponse(
		context,
		c.registerBoxService.Register(b),
	)
}
