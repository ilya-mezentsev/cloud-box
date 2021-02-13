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
	repository interfaces.BoxRepository
}

func New(repository interfaces.BoxRepository) Service {
	return Service{repository}
}

func (s Service) Boxes(accountHash string) interfaces.Response {
	boxes, err := s.repository.GetBoxes(accountHash)
	if err != nil {
		logger.WithFields(logger.Fields{
			MessageTemplate: "Unable to fetch account boxes: %v",
			Args: []interface{}{
				err,
			},
			Optional: map[string]interface{}{
				"account_hash": accountHash,
			},
		}, logger.Error)

		return response_factory.ServerError(se.ServiceError{
			Code:        error_codes.UnknownRepositoryErrorCode,
			Description: error_codes.UnknownRepositoryErrorDescription,
		})
	}

	return response_factory.SuccessResponse(boxes)
}

func (s Service) BindBoxWithAccount(model models.BindBoxWithAccount) interfaces.Response {
	err := validator.New().Struct(model)
	if err != nil {
		return response_factory.ClientError(se.ServiceError{
			Code:        error_codes.ValidationErrorCode,
			Description: err.Error(),
		})
	}

	err = s.repository.BindBoxWithAccount(model.AccountHash, model.BoxUUID)
	if err != nil {
		logger.WithFields(logger.Fields{
			MessageTemplate: "Unable to bind box with account: %v",
			Args: []interface{}{
				err,
			},
			Optional: map[string]interface{}{
				"model": model,
			},
		}, logger.Error)

		return response_factory.ServerError(se.ServiceError{
			Code:        error_codes.UnknownRepositoryErrorCode,
			Description: error_codes.UnknownRepositoryErrorDescription,
		})
	}

	return response_factory.DefaultResponse()
}
