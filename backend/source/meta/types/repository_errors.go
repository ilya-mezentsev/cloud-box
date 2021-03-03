package types

type MailAlreadyExists struct {
}

func (m MailAlreadyExists) Error() string {
	return "account hash already exists"
}

type CredentialsNotFound struct {
}

func (c CredentialsNotFound) Error() string {
	return "credentials not found"
}
