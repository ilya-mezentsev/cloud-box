package user

import (
	"cloud-box-backend/source/meta/mock/services"
	"cloud-box-backend/source/meta/models"
	"cloud-box-backend/source/services/shared/error_codes"
	"cloud-box-backend/source/services/shared/errors"
	"cloud-box-backend/source/services/shared/response_factory"
	"github.com/stretchr/testify/assert"
	"io/ioutil"
	"log"
	"os"
	"testing"
)

var (
	mockRepository      = &services.UserCredentialsRepositoryMock{}
	expectedOkStatus    = response_factory.DefaultResponse().GetStatus()
	expectedErrorStatus = response_factory.ServerError(nil).GetStatus()
)

func init() {
	mockRepository.Reset()
}

func TestMain(m *testing.M) {
	log.SetOutput(ioutil.Discard)
	os.Exit(m.Run())
}

func TestService_RegisterSuccess(t *testing.T) {
	defer mockRepository.Reset()
	user := models.UserCredentials{
		Mail:     "some@mail.ru",
		Password: "some-password",
	}

	response := New(mockRepository).Register(user)

	assert.True(t, mockRepository.Has(user))
	assert.Equal(t, expectedOkStatus, response.GetStatus())
	assert.False(t, response.IsClientError())
	assert.False(t, response.IsServerError())
	assert.False(t, response.HasData())
	assert.Nil(t, response.GetData())
}

func TestService_RegisterMailAlreadyExists(t *testing.T) {
	defer mockRepository.Reset()

	response := New(mockRepository).Register(models.UserCredentials{
		Mail:     services.ExistsUserMail,
		Password: "some-password",
	})

	assert.Equal(t, expectedErrorStatus, response.GetStatus())
	assert.True(t, response.HasData())
	assert.True(t, response.IsClientError())
	assert.False(t, response.IsServerError())
	assert.Equal(t, MailAlreadyExistsErrorCode, response.GetData().(errors.ServiceError).Code)
	assert.Equal(t, MailAlreadyExistsErrorDescription, response.GetData().(errors.ServiceError).Description)
}

func TestService_RegisterValidationError(t *testing.T) {
	defer mockRepository.Reset()
	user := models.UserCredentials{
		Mail: "bad-mail",
	}

	response := New(mockRepository).Register(user)

	assert.False(t, mockRepository.Has(user))
	assert.True(t, response.HasData())
	assert.True(t, response.IsClientError())
	assert.False(t, response.IsServerError())
	assert.Equal(t, expectedErrorStatus, response.GetStatus())
	assert.Equal(t, error_codes.ValidationErrorCode, response.GetData().(errors.ServiceError).Code)
}

func TestService_RegisterUnknownError(t *testing.T) {
	defer mockRepository.Reset()
	user := models.UserCredentials{
		Mail:     services.BadUserMail,
		Password: "some-password",
	}

	response := New(mockRepository).Register(user)

	assert.False(t, mockRepository.Has(user))
	assert.Equal(t, expectedErrorStatus, response.GetStatus())
	assert.True(t, response.HasData())
	assert.False(t, response.IsClientError())
	assert.True(t, response.IsServerError())
	assert.Equal(t, error_codes.UnknownRepositoryErrorCode, response.GetData().(errors.ServiceError).Code)
	assert.Equal(t, error_codes.UnknownRepositoryErrorDescription, response.GetData().(errors.ServiceError).Description)
}
