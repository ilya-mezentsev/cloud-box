package services

import (
	"cloud-box-backend/source/meta/models"
	"errors"
)

type BoxRepositoryMock struct {
	boxes map[string][]models.BoxView
}

func (m *BoxRepositoryMock) Reset() {
	m.boxes = map[string][]models.BoxView{
		ExistsHash: {
			{
				TunnelDomain: "www.google.com",
				UUID:         ExistsUUID,
				Alias:        "some-alias",
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

func (m BoxRepositoryMock) GetAlias(boxUUID string) string {
	for _, boxes := range m.boxes {
		for _, b := range boxes {
			if b.UUID == boxUUID {
				return b.Alias
			}
		}
	}

	return ""
}

func (m *BoxRepositoryMock) GetBoxes(accountHash string) ([]models.BoxView, error) {
	if accountHash == BadHash {
		return nil, errors.New("some-error")
	}

	return m.boxes[accountHash], nil
}

func (m *BoxRepositoryMock) BindBoxWithAccount(b models.BindBoxWithAccount) error {
	if b.AccountHash == BadHash {
		return errors.New("some-error")
	}

	m.boxes[b.AccountHash] = append(m.boxes[b.AccountHash], models.BoxView{
		TunnelDomain: "some.domain.com",
		UUID:         b.BoxUUID,
	})

	return nil
}

func (m *BoxRepositoryMock) UpdateBox(box models.BoxUpdate) error {
	if box.UUID == BadUUID {
		return errors.New("some-error")
	}

	for _, boxes := range m.boxes {
		for i, b := range boxes {
			if b.UUID == box.UUID {
				boxes[i].Alias = box.Alias
			}
		}
	}

	return nil
}
