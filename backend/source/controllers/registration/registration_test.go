package registration

import (
	"cloud-box-backend/source/controllers/presenter"
	mockControllers "cloud-box-backend/source/meta/mock/controllers"
	"cloud-box-backend/source/meta/mock/services"
	"cloud-box-backend/source/meta/models"
	"cloud-box-backend/source/services/registration/box"
	"cloud-box-backend/source/services/registration/user"
	"cloud-box-backend/source/services/shared/error_codes"
	"cloud-box-backend/source/services/shared/response_factory"
	"encoding/json"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"io/ioutil"
	"log"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"
)

var (
	userMockRepository = &services.UserCredentialsRepositoryMock{}
	boxMockRepository  = &services.BoxRegistrationRepositoryMock{}

	userRegistrationService = user.New(userMockRepository)
	boxRegistrationService  = box.New(boxMockRepository)

	controller = New(userRegistrationService, boxRegistrationService)

	expectedOkStatus    = response_factory.DefaultResponse().ApplicationStatus()
	expectedErrorStatus = response_factory.ServerError(nil).ApplicationStatus()
)

func init() {
	userMockRepository.Reset()
	boxMockRepository.Reset()
}

func TestMain(m *testing.M) {
	log.SetOutput(ioutil.Discard)
	os.Exit(m.Run())
}

func TestController_RegisterUserSuccess(t *testing.T) {
	u := models.UserCredentials{
		Mail:     "new.user@mail.ru",
		Password: "some-password",
	}
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Request = mockControllers.MustCreateRequestWithBody(u)

	controller.RegisterUser(c)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.True(t, userMockRepository.Has(u))
	assert.Empty(t, w.Body)
}

func TestController_RegisterUserMailExistsError(t *testing.T) {
	u := models.UserCredentials{
		Mail:     services.ExistsUserMail,
		Password: "some-password",
	}
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Request = mockControllers.MustCreateRequestWithBody(u)

	controller.RegisterUser(c)

	var res gin.H
	err := json.Unmarshal(w.Body.Bytes(), &res)
	responseData := res["data"].(map[string]interface{})

	assert.Nil(t, err)
	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.True(t, userMockRepository.Has(u))
	assert.Equal(t, expectedErrorStatus, res["status"])
	assert.Equal(t, user.MailAlreadyExistsErrorCode, responseData["code"])
	assert.Equal(t, user.MailAlreadyExistsErrorDescription, responseData["description"])
}

func TestController_RegisterUserInternalError(t *testing.T) {
	u := models.UserCredentials{
		Mail:     services.BadUserMail,
		Password: "some-password",
	}
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Request = mockControllers.MustCreateRequestWithBody(u)

	controller.RegisterUser(c)

	var res gin.H
	err := json.Unmarshal(w.Body.Bytes(), &res)
	responseData := res["data"].(map[string]interface{})

	assert.Nil(t, err)
	assert.Equal(t, http.StatusInternalServerError, w.Code)
	assert.False(t, userMockRepository.Has(u))
	assert.Equal(t, expectedErrorStatus, res["status"])
	assert.Equal(t, error_codes.UnknownRepositoryErrorCode, responseData["code"])
	assert.Equal(t, error_codes.UnknownRepositoryErrorDescription, responseData["description"])
}

func TestController_RegisterUserBadRequest(t *testing.T) {
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)

	controller.RegisterUser(c)

	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.Equal(t, presenter.InvalidJSONFormatMessage, w.Body.String())
}

func TestController_RegisterBoxSuccess(t *testing.T) {
	b := models.BoxRegistration{
		TunnelDomain: "some.tunnel.ru",
		UUID:         uuid.NewString(),
	}
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Request = mockControllers.MustCreateRequestWithBody(b)

	controller.RegisterBox(c)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.True(t, boxMockRepository.Has(b))
	assert.Empty(t, w.Body)
}

func TestController_RegisterBoxInternalError(t *testing.T) {
	b := models.BoxRegistration{
		TunnelDomain: "some.tunnel.ru",
		UUID:         services.BadUUID,
	}
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Request = mockControllers.MustCreateRequestWithBody(b)

	controller.RegisterBox(c)

	var res gin.H
	err := json.Unmarshal(w.Body.Bytes(), &res)
	responseData := res["data"].(map[string]interface{})

	assert.Nil(t, err)
	assert.Equal(t, http.StatusInternalServerError, w.Code)
	assert.False(t, boxMockRepository.Has(b))
	assert.Equal(t, expectedErrorStatus, res["status"])
	assert.Equal(t, error_codes.UnknownRepositoryErrorCode, responseData["code"])
	assert.Equal(t, error_codes.UnknownRepositoryErrorDescription, responseData["description"])
}

func TestController_RegisterBoxBadRequest(t *testing.T) {
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)

	controller.RegisterBox(c)

	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.Equal(t, presenter.InvalidJSONFormatMessage, w.Body.String())
}
