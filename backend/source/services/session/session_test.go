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

func TestService_GetSessionSuccess(t *testing.T) {
	defer mockRepository.Reset()

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Request = controllers.CreateRequestWithCookie(cookieTokenKey, services.ExistsHash)

	response := service.GetSession(c)

	cookie, err := c.Cookie(cookieTokenKey)

	assert.Nil(t, err)
	assert.Equal(t, services.ExistsHash, cookie)
	assert.Equal(t, expectedOkStatus, response.ApplicationStatus())
	assert.True(t, response.HasData())
	assert.Equal(t, http.StatusOK, response.HttpStatus())
	assert.Equal(t, cookie, response.GetData().(models.SessionResponse).Hash)
}

func TestService_GetSessionHashDoesNotExists(t *testing.T) {
	defer mockRepository.Reset()

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Request = controllers.CreateRequestWithCookie(cookieTokenKey, "not-exists-hash")

	response := service.GetSession(c)

	assert.Equal(t, expectedErrorStatus, response.ApplicationStatus())
	assert.True(t, response.HasData())
	assert.Equal(t, http.StatusBadRequest, response.HttpStatus())
	assert.Equal(t, hashDoesNotExistErrorCode, response.GetData().(errors.ServiceError).Code)
	assert.Equal(t, hashDoesNotExistErrorDescription, response.GetData().(errors.ServiceError).Description)
}

func TestService_GetSessionWithoutCookie(t *testing.T) {
	defer mockRepository.Reset()

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Request = controllers.CreateSimpleRequest()

	response := service.GetSession(c)

	assert.Equal(t, expectedOkStatus, response.ApplicationStatus())
	assert.False(t, response.HasData())
	assert.Equal(t, http.StatusNoContent, response.HttpStatus())
}

func TestService_GetSessionUnknownError(t *testing.T) {
	defer mockRepository.Reset()

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Request = controllers.CreateRequestWithCookie(cookieTokenKey, services.BadHash)

	response := service.GetSession(c)

	assert.Equal(t, expectedErrorStatus, response.ApplicationStatus())
	assert.True(t, response.HasData())
	assert.Equal(t, http.StatusInternalServerError, response.HttpStatus())
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
	assert.Equal(t, expectedOkStatus, response.ApplicationStatus())
	assert.True(t, response.HasData())
	assert.Equal(t, http.StatusOK, response.HttpStatus())
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
	assert.Equal(t, expectedErrorStatus, response.ApplicationStatus())
	assert.True(t, response.HasData())
	assert.Equal(t, http.StatusBadRequest, response.HttpStatus())
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
	assert.Equal(t, expectedErrorStatus, response.ApplicationStatus())
	assert.True(t, response.HasData())
	assert.Equal(t, http.StatusBadRequest, response.HttpStatus())
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
	assert.Equal(t, expectedErrorStatus, response.ApplicationStatus())
	assert.True(t, response.HasData())
	assert.Equal(t, http.StatusInternalServerError, response.HttpStatus())
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
	assert.Equal(t, expectedOkStatus, response.ApplicationStatus())
	assert.Nil(t, response.GetData())
	assert.False(t, response.HasData())
	assert.Equal(t, http.StatusNoContent, response.HttpStatus())
}

func TestService_CheckSessionHasExistsToken(t *testing.T) {
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Request = controllers.CreateRequestWithCookie(cookieTokenKey, services.ExistsHash)

	response := service.CheckSession(c)

	assert.Nil(t, response)
}

func TestService_CheckSessionNoToken(t *testing.T) {
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Request = controllers.CreateSimpleRequest()

	response := service.CheckSession(c)

	assert.Equal(t, expectedErrorStatus, response.ApplicationStatus())
	assert.True(t, response.HasData())
	assert.Equal(t, http.StatusUnauthorized, response.HttpStatus())
	assert.Equal(t, noCookieErrorCode, response.GetData().(errors.ServiceError).Code)
	assert.Equal(t, noCookieErrorDescription, response.GetData().(errors.ServiceError).Description)
}

func TestService_CheckSessionNotExists(t *testing.T) {
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Request = controllers.CreateRequestWithCookie(cookieTokenKey, "not-exists")

	response := service.CheckSession(c)

	assert.Equal(t, expectedErrorStatus, response.ApplicationStatus())
	assert.True(t, response.HasData())
	assert.Equal(t, http.StatusForbidden, response.HttpStatus())
	assert.Equal(t, hashDoesNotExistErrorCode, response.GetData().(errors.ServiceError).Code)
	assert.Equal(t, hashDoesNotExistErrorDescription, response.GetData().(errors.ServiceError).Description)
}

func TestService_CheckSessionInternalError(t *testing.T) {
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Request = controllers.CreateRequestWithCookie(cookieTokenKey, services.BadHash)

	response := service.CheckSession(c)

	assert.Equal(t, expectedErrorStatus, response.ApplicationStatus())
	assert.True(t, response.HasData())
	assert.Equal(t, http.StatusInternalServerError, response.HttpStatus())
	assert.Equal(t, error_codes.UnknownRepositoryErrorCode, response.GetData().(errors.ServiceError).Code)
	assert.Equal(t, error_codes.UnknownRepositoryErrorDescription, response.GetData().(errors.ServiceError).Description)
}
