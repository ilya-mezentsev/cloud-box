package services

import (
	"cloud-box-backend/source/meta/models"
	"errors"
	"github.com/google/uuid"
)

type BoxRegistrationRepositoryMock struct {
	boxes map[string]models.BoxRegistration
}

func (m *BoxRegistrationRepositoryMock) Reset() {
	s := uuid.NewString()

	m.boxes = map[string]models.BoxRegistration{
		s: {
			UUID:         s,
			TunnelDomain: "www.tunnel.com",
		},
	}
}

func (m *BoxRegistrationRepositoryMock) Has(box models.BoxRegistration) bool {
	for _, b := range m.boxes {
		if b == box {
			return true
		}
	}

	return false
}

func (m *BoxRegistrationRepositoryMock) Register(box models.BoxRegistration) error {
	if box.UUID == BadUUID {
		return errors.New("some-error")
	}

	m.boxes[box.UUID] = box

	return nil
}
