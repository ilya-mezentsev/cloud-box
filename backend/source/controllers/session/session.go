package session

import (
	"cloud-box-backend/source/controllers/presenter"
	"cloud-box-backend/source/meta/models"
	"cloud-box-backend/source/services/session"
	"github.com/gin-gonic/gin"
)

type Controller struct {
	sessionService session.Service
}

func New(sessionService session.Service) Controller {
	return Controller{sessionService}
}

func (c Controller) HasSession() gin.HandlerFunc {
	return func(context *gin.Context) {
		interceptResponse := c.sessionService.CheckSession(context)
		if interceptResponse != nil {
			presenter.MakeJsonResponse(context, interceptResponse)
			context.Abort()
		} else {
			context.Next()
		}
	}
}

func (c Controller) GetSession(context *gin.Context) {
	presenter.MakeJsonResponse(
		context,
		c.sessionService.GetSession(context),
	)
}

func (c Controller) CreateSession(context *gin.Context) {
	var u models.UserCredentials
	if err := context.ShouldBindJSON(&u); err != nil {
		presenter.MakeInvalidJsonResponse(context)
		return
	}

	presenter.MakeJsonResponse(
		context,
		c.sessionService.CreateSession(context, u),
	)
}

func (c Controller) DeleteSession(context *gin.Context) {
	presenter.MakeJsonResponse(
		context,
		c.sessionService.DeleteSession(context),
	)
}
