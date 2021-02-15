package config

type (
	server struct {
		Port         int    `json:"port"`
		Domain       string `json:"domain"`
		SecureCookie bool   `json:"secure_cookie"`
	}

	db struct {
		Host     string `json:"host"`
		Port     int    `json:"port"`
		User     string `json:"user"`
		Password string `json:"password"`
		DBName   string `json:"db_name"`
	}

	settings struct {
		Server server `json:"server"`
		DB     db     `json:"db"`
		Auth   auth   `json:"auth"`
	}
)

type (
	auth struct {
		Basic basic `json:"basic"`
	}

	basic struct {
		Box box `json:"box"`
	}

	box struct {
		User     string `json:"user"`
		Password string `json:"password"`
	}
)
