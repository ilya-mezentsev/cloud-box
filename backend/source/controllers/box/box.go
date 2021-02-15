package box

import (
	"cloud-box-backend/source/controllers/presenter"
	"cloud-box-backend/source/meta/models"
	"cloud-box-backend/source/services/box"
	"github.com/gin-gonic/gin"
)

type Controller struct {
	service box.Service
}

func New(service box.Service) Controller {
	return Controller{service}
}

func (c Controller) GetBoxes(context *gin.Context) {
	accountHash := context.Param("account_hash")

	presenter.MakeJsonResponse(
		context,
		c.service.Boxes(accountHash),
	)
}

func (c Controller) BindBoxWithAccount(context *gin.Context) {
	var b models.BindBoxWithAccount
	if err := context.BindJSON(&b); err != nil {
		presenter.MakeInvalidJsonResponse(context)
		return
	}

	presenter.MakeJsonResponse(
		context,
		c.service.BindBoxWithAccount(b),
	)
}
