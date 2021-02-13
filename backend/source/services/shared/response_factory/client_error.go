package response_factory

type clientErrorResponse struct {
	defaultResponse
}

func (r clientErrorResponse) GetStatus() string {
	return statusError
}

func (r clientErrorResponse) IsClientError() bool {
	return true
}
