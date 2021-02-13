package user

import (
	"cloud-box-backend/source/meta/interfaces"
	"cloud-box-backend/source/meta/models"
	"cloud-box-backend/source/meta/types"
	"cloud-box-backend/source/services/shared/error_codes"
	se "cloud-box-backend/source/services/shared/errors"
	"cloud-box-backend/source/services/shared/hash"
	"cloud-box-backend/source/services/shared/password"
	"cloud-box-backend/source/services/shared/response_factory"
	"cloud-box-backend/source/shared/logger"
	"errors"
	"gopkg.in/go-playground/validator.v9"
)

type Service struct {
	repository interfaces.UserRegistrationRepository
}

func New(repository interfaces.UserRegistrationRepository) Service {
	return Service{repository}
}

func (s Service) Register(model models.UserCredentials) interfaces.Response {
	err := validator.New().Struct(model)
	if err != nil {
		return response_factory.ClientError(se.ServiceError{
			Code:        error_codes.ValidationErrorCode,
			Description: err.Error(),
		})
	}

	pwd := password.Generate(model)
	err = s.repository.Register(models.UserRegistration{
		UserCredentials: models.UserCredentials{
			Mail:     model.Mail,
			Password: pwd,
		},
		Hash: hash.Md5WithTimeAsKey(pwd),
	})
	if errors.As(err, &types.MailAlreadyExists{}) {
		return response_factory.ClientError(se.ServiceError{
			Code:        MailAlreadyExistsErrorCode,
			Description: MailAlreadyExistsErrorDescription,
		})
	} else if err != nil {
		logger.WithFields(logger.Fields{
			MessageTemplate: "Unable to register user: %v",
			Args: []interface{}{
				err,
			},
			Optional: map[string]interface{}{
				"user_model": model,
			},
		}, logger.Error)

		return response_factory.ServerError(se.ServiceError{
			Code:        error_codes.UnknownRepositoryErrorCode,
			Description: error_codes.UnknownRepositoryErrorDescription,
		})
	}

	return response_factory.DefaultResponse()
}
