package presenter

import (
	"cloud-box-backend/source/meta/interfaces"
	"github.com/gin-gonic/gin"
	"net/http"
)

func MakeJsonResponse(c *gin.Context, r interfaces.Response) {
	c.Status(r.HttpStatus())
	if r.HasData() {
		c.JSON(r.HttpStatus(), gin.H{
			"status": r.ApplicationStatus(),
			"data":   r.GetData(),
		})
	}
}

func MakeInvalidJsonResponse(c *gin.Context) {
	c.String(http.StatusBadRequest, InvalidJSONFormatMessage)
}
