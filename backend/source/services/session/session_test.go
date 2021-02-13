package session

import (
	"cloud-box-backend/source/config"
	"cloud-box-backend/source/meta/mock/controllers"
	"cloud-box-backend/source/meta/mock/services"
	"cloud-box-backend/source/meta/models"
	"cloud-box-backend/source/services/shared/error_codes"
	"cloud-box-backend/source/services/shared/errors"
	"cloud-box-backend/source/services/shared/password"
	"cloud-box-backend/source/services/shared/response_factory"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"io/ioutil"
	"log"
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"testing"
)

var (
	mockRepository      = &services.UserCredentialsRepositoryMock{}
	defaultConfigs      = config.Default()
	service             = New(defaultConfigs, mockRepository)
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

func TestService_GetSessionSuccess(t *testing.T) {
	defer mockRepository.Reset()

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Request = controllers.CreateRequestWithCookie(cookieTokenKey, services.ExistsHash)

	response := service.GetSession(c)

	cookie, err := c.Cookie(cookieTokenKey)

	assert.Nil(t, err)
	assert.Equal(t, services.ExistsHash, cookie)
	assert.Equal(t, expectedOkStatus, response.GetStatus())
	assert.True(t, response.HasData())
	assert.False(t, response.IsClientError())
	assert.False(t, response.IsServerError())
	assert.Equal(t, cookie, response.GetData().(models.SessionResponse).Hash)
}

func TestService_GetSessionHashDoesNotExists(t *testing.T) {
	defer mockRepository.Reset()

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Request = controllers.CreateRequestWithCookie(cookieTokenKey, "not-exists-hash")

	response := service.GetSession(c)

	assert.Equal(t, expectedErrorStatus, response.GetStatus())
	assert.True(t, response.HasData())
	assert.True(t, response.IsClientError())
	assert.False(t, response.IsServerError())
	assert.Equal(t, hashDoesNotExistErrorCode, response.GetData().(errors.ServiceError).Code)
	assert.Equal(t, hashDoesNotExistErrorDescription, response.GetData().(errors.ServiceError).Description)
}

func TestService_GetSessionWithoutCookie(t *testing.T) {
	defer mockRepository.Reset()

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Request = controllers.CreateSimpleRequest()

	response := service.GetSession(c)

	assert.Equal(t, expectedErrorStatus, response.GetStatus())
	assert.True(t, response.HasData())
	assert.True(t, response.IsClientError())
	assert.False(t, response.IsServerError())
	assert.Equal(t, noCookieErrorCode, response.GetData().(errors.ServiceError).Code)
	assert.Equal(t, noCookieErrorDescription, response.GetData().(errors.ServiceError).Description)
}

func TestService_GetSessionUnknownError(t *testing.T) {
	defer mockRepository.Reset()

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Request = controllers.CreateRequestWithCookie(cookieTokenKey, services.BadHash)

	response := service.GetSession(c)

	assert.Equal(t, expectedErrorStatus, response.GetStatus())
	assert.True(t, response.HasData())
	assert.False(t, response.IsClientError())
	assert.True(t, response.IsServerError())
	assert.Equal(t, error_codes.UnknownRepositoryErrorCode, response.GetData().(errors.ServiceError).Code)
	assert.Equal(t, error_codes.UnknownRepositoryErrorDescription, response.GetData().(errors.ServiceError).Description)
}

func TestService_CreateSessionSuccess(t *testing.T) {
	defer mockRepository.Reset()
	u := models.UserCredentials{
		Mail:     services.ExistsUserMail,
		Password: services.DecodedExistsPassword,
	}

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Request = controllers.MustCreateRequestWithBody(u)

	response := service.CreateSession(c, u)
	u.Password = password.Generate(u)

	assert.True(t, strings.Contains(
		w.Header().Get("Set-Cookie"),
		fmt.Sprintf("%s=%s", cookieTokenKey, services.ExistsHash),
	))
	assert.Equal(t, expectedOkStatus, response.GetStatus())
	assert.True(t, response.HasData())
	assert.False(t, response.IsClientError())
	assert.False(t, response.IsServerError())
	assert.Equal(t, services.ExistsHash, response.GetData().(models.SessionResponse).Hash)
}

func TestService_CreateSessionInvalidCredentials(t *testing.T) {
	defer mockRepository.Reset()
	u := models.UserCredentials{
		Mail:     "bad",
		Password: "bad",
	}

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Request = controllers.MustCreateRequestWithBody(u)

	response := service.CreateSession(c, u)

	assert.Equal(t, "", w.Header().Get("Set-Cookie"))
	assert.Equal(t, expectedErrorStatus, response.GetStatus())
	assert.True(t, response.HasData())
	assert.True(t, response.IsClientError())
	assert.False(t, response.IsServerError())
	assert.Equal(t, error_codes.ValidationErrorCode, response.GetData().(errors.ServiceError).Code)
}

func TestService_CreateSessionCredentialsNotFound(t *testing.T) {
	defer mockRepository.Reset()
	u := models.UserCredentials{
		Mail:     "foo-bar@mail.ru",
		Password: "some-password",
	}

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Request = controllers.MustCreateRequestWithBody(u)

	response := service.CreateSession(c, u)

	assert.Equal(t, "", w.Header().Get("Set-Cookie"))
	assert.Equal(t, expectedErrorStatus, response.GetStatus())
	assert.True(t, response.HasData())
	assert.True(t, response.IsClientError())
	assert.False(t, response.IsServerError())
	assert.Equal(t, credentialsNotFoundErrorCode, response.GetData().(errors.ServiceError).Code)
	assert.Equal(t, credentialsNotFoundErrorDescription, response.GetData().(errors.ServiceError).Description)
}

func TestService_CreateSessionUnknownError(t *testing.T) {
	defer mockRepository.Reset()
	u := models.UserCredentials{
		Mail:     services.BadUserMail,
		Password: "some-password",
	}

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Request = controllers.MustCreateRequestWithBody(u)

	response := service.CreateSession(c, u)

	assert.Equal(t, "", w.Header().Get("Set-Cookie"))
	assert.Equal(t, expectedErrorStatus, response.GetStatus())
	assert.True(t, response.HasData())
	assert.False(t, response.IsClientError())
	assert.True(t, response.IsServerError())
	assert.Equal(t, error_codes.UnknownRepositoryErrorCode, response.GetData().(errors.ServiceError).Code)
	assert.Equal(t, error_codes.UnknownRepositoryErrorDescription, response.GetData().(errors.ServiceError).Description)
}

func TestService_DeleteSessionSuccess(t *testing.T) {
	defer mockRepository.Reset()

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Request = controllers.CreateRequestWithCookie(cookieTokenKey, services.ExistsHash)

	response := service.DeleteSession(c)

	assert.True(t, strings.Contains(
		w.Header().Get("Set-Cookie"),
		fmt.Sprintf("%s=%s", cookieTokenKey, ""),
	))
	assert.Equal(t, expectedOkStatus, response.GetStatus())
	assert.Nil(t, response.GetData())
	assert.False(t, response.HasData())
	assert.False(t, response.IsClientError())
	assert.False(t, response.IsServerError())
}

func TestService_HasSessionTrue(t *testing.T) {
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Request = controllers.CreateRequestWithCookie(cookieTokenKey, services.ExistsHash)

	h := service.HasSession()

	h(c)

	assert.Equal(t, http.StatusOK, w.Code)
}

func TestService_HasSessionFalse(t *testing.T) {
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Request = controllers.CreateSimpleRequest()

	h := service.HasSession()

	h(c)

	assert.Equal(t, http.StatusForbidden, w.Code)
	assert.Equal(t, forbiddenMessage, w.Body.String())
}
