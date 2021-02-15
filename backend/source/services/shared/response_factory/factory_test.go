package response_factory

import (
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestDefaultResponse(t *testing.T) {
	response := DefaultResponse()

	assert.Equal(t, statusOk, response.GetStatus())
	assert.False(t, response.HasData())
	assert.False(t, response.IsClientError())
	assert.False(t, response.IsServerError())
	assert.Nil(t, response.GetData())
}

func TestSuccessResponse(t *testing.T) {
	someData := `data`
	response := SuccessResponse(someData)

	assert.Equal(t, statusOk, response.GetStatus())
	assert.True(t, response.HasData())
	assert.False(t, response.IsClientError())
	assert.False(t, response.IsServerError())
	assert.Equal(t, someData, response.GetData())
}

func TestServerErrorResponse(t *testing.T) {
	someData := `data`
	response := ServerError(someData)

	assert.Equal(t, statusError, response.GetStatus())
	assert.True(t, response.HasData())
	assert.True(t, response.IsServerError())
	assert.False(t, response.IsClientError())
	assert.Equal(t, someData, response.GetData())
}

func TestClientErrorResponse(t *testing.T) {
	someData := `data`
	response := ClientError(someData)

	assert.Equal(t, statusError, response.GetStatus())
	assert.True(t, response.HasData())
	assert.False(t, response.IsServerError())
	assert.True(t, response.IsClientError())
	assert.Equal(t, someData, response.GetData())
}
