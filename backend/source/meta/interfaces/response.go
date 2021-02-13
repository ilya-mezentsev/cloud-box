package interfaces

type Response interface {
	GetStatus() string
	HasData() bool
	IsServerError() bool
	IsClientError() bool
	GetData() interface{}
}
