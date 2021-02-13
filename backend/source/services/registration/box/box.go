package box

import (
	"cloud-box-backend/source/meta/interfaces"
	"cloud-box-backend/source/meta/models"
	"cloud-box-backend/source/services/shared/error_codes"
	se "cloud-box-backend/source/services/shared/errors"
	"cloud-box-backend/source/services/shared/response_factory"
	"cloud-box-backend/source/shared/logger"
	"gopkg.in/go-playground/validator.v9"
)

type Service struct {
	repository interfaces.BoxRegistrationRepository
}

func New(repository interfaces.BoxRegistrationRepository) Service {
	return Service{repository}
}

func (s Service) Register(model models.BoxRegistration) interfaces.Response {
	err := validator.New().Struct(model)
	if err != nil {
		return response_factory.ClientError(se.ServiceError{
			Code:        error_codes.ValidationErrorCode,
			Description: err.Error(),
		})
	}

	err = s.repository.Register(model)
	if err != nil {
		logger.WithFields(logger.Fields{
			MessageTemplate: "Unable to register box: %v",
			Args: []interface{}{
				err,
			},
			Optional: map[string]interface{}{
				"box_model": model,
			},
		}, logger.Warning)

		return response_factory.ServerError(se.ServiceError{
			Code:        error_codes.UnknownRepositoryErrorCode,
			Description: error_codes.UnknownRepositoryErrorDescription,
		})
	}

	return response_factory.DefaultResponse()
}
