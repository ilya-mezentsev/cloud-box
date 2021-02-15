package services

import (
	"cloud-box-backend/source/meta/models"
	"errors"
)

type BoxRepositoryMock struct {
	boxes map[string][]models.Box
}

func (m *BoxRepositoryMock) Reset() {
	m.boxes = map[string][]models.Box{
		ExistsHash: {
			{
				TunnelDomain: "www.google.com",
				UUID:         ExistsUUID,
			},
		},
	}
}

func (m BoxRepositoryMock) Has(b models.BindBoxWithAccount) bool {
	for _, box := range m.boxes[b.AccountHash] {
		if box.UUID == b.BoxUUID {
			return true
		}
	}

	return false
}

func (m *BoxRepositoryMock) GetBoxes(accountHash string) ([]models.Box, error) {
	if accountHash == BadHash {
		return nil, errors.New("some-error")
	}

	return m.boxes[accountHash], nil
}

func (m *BoxRepositoryMock) BindBoxWithAccount(accountHash, boxUUID string) error {
	if accountHash == BadHash {
		return errors.New("some-error")
	}

	m.boxes[accountHash] = append(m.boxes[accountHash], models.Box{
		TunnelDomain: "some.domain.com",
		UUID:         boxUUID,
	})

	return nil
}
