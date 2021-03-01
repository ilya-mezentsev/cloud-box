package session

import (
	"cloud-box-backend/source/config"
	"cloud-box-backend/source/meta/interfaces"
	"cloud-box-backend/source/meta/models"
	"cloud-box-backend/source/meta/types"
	"cloud-box-backend/source/services/shared/error_codes"
	se "cloud-box-backend/source/services/shared/errors"
	"cloud-box-backend/source/services/shared/password"
	"cloud-box-backend/source/services/shared/response_factory"
	"cloud-box-backend/source/shared/logger"
	"errors"
	"github.com/gin-gonic/gin"
	"gopkg.in/go-playground/validator.v9"
	"net/http"
)

type Service struct {
	configs    config.ServerConfigsRepository
	repository interfaces.UserCredentialsRepository
}

func New(
	configs config.ServerConfigsRepository,
	repository interfaces.UserCredentialsRepository,
) Service {
	return Service{
		configs:    configs,
		repository: repository,
	}
}

func (s Service) HasSession() gin.HandlerFunc {
	return func(c *gin.Context) {
		cookie, err := c.Cookie(cookieTokenKey)
		if err != nil {
			c.AbortWithStatus(http.StatusForbidden)
			return
		}

		hashExists, err := s.repository.HashExists(cookie)
		if err != nil {
			logger.WithFields(logger.Fields{
				MessageTemplate: "Unable to check token existence: %v",
				Args: []interface{}{
					err,
				},
			}, logger.Error)

			c.AbortWithStatus(http.StatusInternalServerError)
		} else if !hashExists {
			c.AbortWithStatus(http.StatusForbidden)
		} else {
			c.Next()
		}
	}
}

func (s Service) GetSession(c *gin.Context) interfaces.Response {
	cookie, err := c.Cookie(cookieTokenKey)
	if err != nil {
		return response_factory.ClientError(se.ServiceError{
			Code:        noCookieErrorCode,
			Description: noCookieErrorDescription,
		})
	}

	hashExists, err := s.repository.HashExists(cookie)
	if err != nil {
		logger.WithFields(logger.Fields{
			MessageTemplate: "Unable to check token existence: %v",
			Args: []interface{}{
				err,
			},
		}, logger.Error)

		return response_factory.ServerError(se.ServiceError{
			Code:        error_codes.UnknownRepositoryErrorCode,
			Description: error_codes.UnknownRepositoryErrorDescription,
		})
	}

	if hashExists {
		s.setCookie(c, cookie)
		return response_factory.SuccessResponse(models.SessionResponse{
			Hash: cookie,
		})
	} else {
		return response_factory.ClientError(se.ServiceError{
			Code:        hashDoesNotExistErrorCode,
			Description: hashDoesNotExistErrorDescription,
		})
	}
}

func (s Service) setCookie(c *gin.Context, value string) {
	c.SetCookie(
		cookieTokenKey,
		value,
		cookieMaxAge,
		cookiePath,
		s.configs.ServerDomain(),
		s.configs.ServerSecureCookie(),
		cookieHttpOnly,
	)
}

func (s Service) CreateSession(c *gin.Context, model models.UserCredentials) interfaces.Response {
	err := validator.New().Struct(model)
	if err != nil {
		return response_factory.ClientError(se.ServiceError{
			Code:        error_codes.ValidationErrorCode,
			Description: err.Error(),
		})
	}

	model.Password = password.Generate(model)
	token, err := s.repository.GetHash(model)
	if err != nil {
		if errors.As(err, &types.CredentialsNotFound{}) {
			return response_factory.ClientError(se.ServiceError{
				Code:        credentialsNotFoundErrorCode,
				Description: credentialsNotFoundErrorDescription,
			})
		} else {
			logger.WithFields(logger.Fields{
				MessageTemplate: "Unable to get token by credentials: %v",
				Args: []interface{}{
					err,
				},
			}, logger.Error)

			return response_factory.ServerError(se.ServiceError{
				Code:        error_codes.UnknownRepositoryErrorCode,
				Description: error_codes.UnknownRepositoryErrorDescription,
			})
		}
	}

	s.setCookie(c, token)

	return response_factory.SuccessResponse(models.SessionResponse{
		Hash: token,
	})
}

func (s Service) DeleteSession(c *gin.Context) interfaces.Response {
	s.unsetCookie(c)

	return response_factory.DefaultResponse()
}

func (s Service) unsetCookie(c *gin.Context) {
	c.SetCookie(
		cookieTokenKey,
		cookieUnsetValue,
		cookieUnsetMaxAge,
		cookiePath,
		s.configs.ServerDomain(),
		s.configs.ServerSecureCookie(),
		cookieHttpOnly,
	)
}
