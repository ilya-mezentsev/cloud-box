package session

const (
	cookieTokenKey    = "Cloud-Box-Token"
	cookiePath        = "/"
	cookieMaxAge      = 86400 // 1 day
	cookieHttpOnly    = true
	cookieUnsetValue  = ""
	cookieUnsetMaxAge = 0
)

const (
	noCookieErrorCode        = "no-token-in-cookie"
	noCookieErrorDescription = "Auth token not found in cookies"

	hashDoesNotExistErrorCode        = "hash-does-not-exist"
	hashDoesNotExistErrorDescription = "Hash in cookies does not exists in DB"

	credentialsNotFoundErrorCode        = "credentials-not-found"
	credentialsNotFoundErrorDescription = "Unable to find account by provided credentials"
)
