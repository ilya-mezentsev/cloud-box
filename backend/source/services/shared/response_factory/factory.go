package response_factory

import "cloud-box-backend/source/meta/interfaces"

func DefaultResponse() interfaces.Response {
	return defaultResponse{}
}

func SuccessResponse(data interface{}) interfaces.Response {
	return successResponse{defaultResponse{data}}
}

func ServerError(data interface{}) interfaces.Response {
	return serverErrorResponse{defaultResponse{data}}
}

func ClientError(data interface{}) interfaces.Response {
	return clientErrorResponse{defaultResponse{data}}
}
