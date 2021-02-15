package services

import (
	"cloud-box-backend/source/meta/models"
	"cloud-box-backend/source/meta/types"
	"errors"
)

type UserCredentialsRepositoryMock struct {
	users map[string]models.UserRegistration
}

func (m *UserCredentialsRepositoryMock) Reset() {
	m.users = map[string]models.UserRegistration{
		ExistsUserMail: {
			UserCredentials: models.UserCredentials{
				Mail:     ExistsUserMail,
				Password: ExistsPassword,
			},
			Hash: ExistsHash,
		},
	}
}

func (m UserCredentialsRepositoryMock) Has(user models.UserCredentials) bool {
	for _, u := range m.users {
		if u.Mail == user.Mail {
			return true
		}
	}

	return false
}

func (m *UserCredentialsRepositoryMock) Register(user models.UserRegistration) error {
	if user.Mail == BadUserMail {
		return errors.New("unknown-error")
	}

	_, userExists := m.users[user.Mail]
	if userExists {
		return types.MailAlreadyExists{}
	}

	m.users[user.Mail] = user

	return nil
}

func (m *UserCredentialsRepositoryMock) GetHash(user models.UserCredentials) (string, error) {
	if user.Mail == BadUserMail {
		return "", errors.New("some-error")
	}

	for _, u := range m.users {
		if u.UserCredentials == user {
			return u.Hash, nil
		}
	}

	return "", types.CredentialsNotFound{}
}

func (m *UserCredentialsRepositoryMock) HashExists(hash string) (bool, error) {
	if hash == BadHash {
		return false, errors.New("some-error")
	}

	for _, u := range m.users {
		if u.Hash == hash {
			return true, nil
		}
	}

	return false, nil
}
