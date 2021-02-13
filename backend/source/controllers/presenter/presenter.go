package presenter

import (
	"cloud-box-backend/source/meta/interfaces"
	"github.com/gin-gonic/gin"
	"net/http"
)

func MakeJsonResponse(c *gin.Context, r interfaces.Response) {
	var status int
	if r.IsClientError() {
		status = http.StatusBadRequest
	} else if r.IsServerError() {
		status = http.StatusInternalServerError
	} else {
		status = http.StatusOK
	}

	if r.HasData() {
		c.JSON(status, gin.H{
			"status": r.GetStatus(),
			"data":   r.GetData(),
		})
	} else {
		c.JSON(status, gin.H{
			"status": r.GetStatus(),
		})
	}
}

func MakeInvalidJsonResponse(c *gin.Context) {
	c.String(http.StatusBadRequest, InvalidJSONFormatMessage)
}
