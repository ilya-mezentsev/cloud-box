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
	"os"
	"testing"
)

var (
	mockRepository      = &services.BoxRepositoryMock{}
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

func TestService_BoxesSuccess(t *testing.T) {
	defer mockRepository.Reset()

	response := New(mockRepository).Boxes(services.ExistsHash)

	gotBoxes := response.GetData()
	expectedBoxes, _ := mockRepository.GetBoxes(services.ExistsHash)

	assert.Equal(t, expectedOkStatus, response.GetStatus())
	assert.False(t, response.IsServerError())
	assert.False(t, response.IsClientError())
	assert.True(t, response.HasData())
	for _, b := range expectedBoxes {
		assert.Contains(t, gotBoxes, b)
	}
}

func TestService_BoxesUnknownError(t *testing.T) {
	defer mockRepository.Reset()

	response := New(mockRepository).Boxes(services.BadHash)

	assert.Equal(t, expectedErrorStatus, response.GetStatus())
	assert.True(t, response.IsServerError())
	assert.False(t, response.IsClientError())
	assert.True(t, response.HasData())
	assert.Equal(t, error_codes.UnknownRepositoryErrorCode, response.GetData().(errors.ServiceError).Code)
	assert.Equal(t, error_codes.UnknownRepositoryErrorDescription, response.GetData().(errors.ServiceError).Description)
}

func TestService_BindBoxWithAccountSuccess(t *testing.T) {
	defer mockRepository.Reset()
	b := models.BindBoxWithAccount{
		AccountHash: services.ExistsHash,
		BoxUUID:     uuid.NewString(),
		BoxAlias:    "some-alias",
	}

	response := New(mockRepository).BindBoxWithAccount(b)

	assert.Equal(t, expectedOkStatus, response.GetStatus())
	assert.False(t, response.IsServerError())
	assert.False(t, response.IsClientError())
	assert.False(t, response.HasData())
	assert.True(t, mockRepository.Has(b))
}

func TestService_BindBoxWithAccountInvalidData(t *testing.T) {
	defer mockRepository.Reset()
	b := models.BindBoxWithAccount{
		AccountHash: services.ExistsHash,
		BoxUUID:     "some-hash",
	}

	response := New(mockRepository).BindBoxWithAccount(b)

	assert.Equal(t, expectedErrorStatus, response.GetStatus())
	assert.False(t, response.IsServerError())
	assert.True(t, response.IsClientError())
	assert.True(t, response.HasData())
	assert.False(t, mockRepository.Has(b))
	assert.Equal(t, error_codes.ValidationErrorCode, response.GetData().(errors.ServiceError).Code)
}

func TestService_BindBoxWithAccountUnknownError(t *testing.T) {
	defer mockRepository.Reset()
	b := models.BindBoxWithAccount{
		AccountHash: services.BadHash,
		BoxUUID:     uuid.NewString(),
		BoxAlias:    "some-alias",
	}

	response := New(mockRepository).BindBoxWithAccount(b)

	assert.Equal(t, expectedErrorStatus, response.GetStatus())
	assert.True(t, response.IsServerError())
	assert.False(t, response.IsClientError())
	assert.True(t, response.HasData())
	assert.False(t, mockRepository.Has(b))
	assert.Equal(t, error_codes.UnknownRepositoryErrorCode, response.GetData().(errors.ServiceError).Code)
	assert.Equal(t, error_codes.UnknownRepositoryErrorDescription, response.GetData().(errors.ServiceError).Description)
}

func TestService_UpdateBoxSuccess(t *testing.T) {
	defer mockRepository.Reset()
	b := models.BoxUpdate{
		UUID:  services.ExistsUUID,
		Alias: "some-alias",
	}

	response := New(mockRepository).UpdateBox(b)

	assert.Equal(t, expectedOkStatus, response.GetStatus())
	assert.False(t, response.IsServerError())
	assert.False(t, response.IsClientError())
	assert.False(t, response.HasData())
	assert.Equal(t, b.Alias, mockRepository.GetAlias(b.UUID))
}

func TestService_UpdateBoxInvalidData(t *testing.T) {
	defer mockRepository.Reset()
	b := models.BoxUpdate{}

	response := New(mockRepository).UpdateBox(b)

	assert.Equal(t, expectedErrorStatus, response.GetStatus())
	assert.False(t, response.IsServerError())
	assert.True(t, response.IsClientError())
	assert.True(t, response.HasData())
	assert.Equal(t, error_codes.ValidationErrorCode, response.GetData().(errors.ServiceError).Code)
}

func TestService_UpdateBoxUnknownError(t *testing.T) {
	defer mockRepository.Reset()
	b := models.BoxUpdate{
		UUID:  services.BadUUID,
		Alias: "some-alias",
	}

	response := New(mockRepository).UpdateBox(b)

	assert.Equal(t, expectedErrorStatus, response.GetStatus())
	assert.True(t, response.IsServerError())
	assert.False(t, response.IsClientError())
	assert.True(t, response.HasData())
	assert.Equal(t, error_codes.UnknownRepositoryErrorCode, response.GetData().(errors.ServiceError).Code)
	assert.Equal(t, error_codes.UnknownRepositoryErrorDescription, response.GetData().(errors.ServiceError).Description)
}
