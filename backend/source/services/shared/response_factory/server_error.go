package response_factory

type serverErrorResponse struct {
	defaultResponse
}

func (r serverErrorResponse) GetStatus() string {
	return statusError
}

func (r serverErrorResponse) IsServerError() bool {
	return true
}
