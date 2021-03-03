package box

import (
	"cloud-box-backend/source/meta/mock/services"
	"cloud-box-backend/source/meta/models"
	"cloud-box-backend/source/services/shared/error_codes"
	"cloud-box-backend/source/services/shared/errors"
	"cloud-box-backend/source/services/shared/response_factory"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"testing"
)

var (
	mockRepository      = &services.BoxRegistrationRepositoryMock{}
	expectedOkStatus    = response_factory.DefaultResponse().ApplicationStatus()
	expectedErrorStatus = response_factory.ServerError(nil).ApplicationStatus()
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
	box := models.BoxRegistration{
		TunnelDomain: "some.domain.com",
		UUID:         uuid.NewString(),
	}

	response := New(mockRepository).Register(box)

	assert.True(t, mockRepository.Has(box))
	assert.Equal(t, expectedOkStatus, response.ApplicationStatus())
	assert.Equal(t, http.StatusNoContent, response.HttpStatus())
	assert.False(t, response.HasData())
	assert.Nil(t, response.GetData())
}

func TestService_RegisterValidationError(t *testing.T) {
	defer mockRepository.Reset()
	box := models.BoxRegistration{
		TunnelDomain: "https://some.domain.com",
		UUID:         uuid.NewString(),
	}

	response := New(mockRepository).Register(box)

	assert.False(t, mockRepository.Has(box))
	assert.Equal(t, expectedErrorStatus, response.ApplicationStatus())
	assert.Equal(t, http.StatusBadRequest, response.HttpStatus())
	assert.True(t, response.HasData())
	assert.Equal(t, error_codes.ValidationErrorCode, response.GetData().(errors.ServiceError).Code)
}

func TestService_RegisterUnknownError(t *testing.T) {
	defer mockRepository.Reset()
	box := models.BoxRegistration{
		TunnelDomain: "some.domain.com",
		UUID:         services.BadUUID,
	}

	response := New(mockRepository).Register(box)

	assert.False(t, mockRepository.Has(box))
	assert.Equal(t, expectedErrorStatus, response.ApplicationStatus())
	assert.Equal(t, http.StatusInternalServerError, response.HttpStatus())
	assert.True(t, response.HasData())
	assert.Equal(t, error_codes.UnknownRepositoryErrorCode, response.GetData().(errors.ServiceError).Code)
	assert.Equal(t, error_codes.UnknownRepositoryErrorDescription, response.GetData().(errors.ServiceError).Description)
}
