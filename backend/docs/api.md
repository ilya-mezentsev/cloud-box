## Cloud backend API overview

### Errors
Each API response can contains error in format:
```json5
{
  "status": "error",
  "data": {
    "code": "some-error-code",
    "description": "Description for this error"
  }
}
```

### POST /registration/user - perform user registration
#### Body:
```json5
{
  "mail": "user@mail.ru",
  "password": "user-password"
}
```
#### Ok response:
```json5
{
  "status": "ok"
}
```
#### Error codes
* validation-error - at least one provided field value is invalid
* mail-already-exists - provided mail is already registered in service
* repository-error - DB error (should not happen)


### GET /session - get session from cookie
#### Ok response:
```json5
{
  "status": "ok",
  "data": {
    "hash": "52704c0857d96f3368c3aa775741a403" // account hash
  }
}
```
#### Error codes:
* no-token-in-cookie - request has not required cookie
* hash-does-not-exist - hash in a cookie does not exist in DB
* repository-error - DB error (should not happen)

### POST /session - create a session (sign in)
#### Body:
```json5
{
  "mail": "user@mail.ru",
  "password": "user-password"
}
```
#### Ok response:
```json5
{
  "status": "ok",
  "data": {
    "hash": "52704c0857d96f3368c3aa775741a403" // account hash
  }
}
```
#### Error codes:
* validation-error - at least one provided field value is invalid
* credentials-not-found - unable to find account by provided credentials
* repository-error - DB error (should not happen)

### DELETE /session - delete a session (sign out)
#### Ok response:
```json5
{
  "status": "ok"
}
```

### GET /boxes/:account_hash - get boxes owned to account
#### Auth - cookie
#### Request parameters:
* \:account_hash - hash of account
#### Ok response:
```json5
{
  "status": "ok",
  "data": [
    {"tunnel_domain": "www.google.com", "uuid":  "1b86c2d7-a7a0-4b42-85fe-421ada083758"},
    {"tunnel_domain": "some.tunnel.domain.com ", "uuid":  "c4f81f0d-60e0-44d0-976c-bac385fe6ae9"}
  ]
}
```
#### Error codes:
* repository-error - DB error (should not happen)

### POST /box - bind box with account
#### Auth - cookie
#### Body:
```json5
{
  "account_hash": "52704c0857d96f3368c3aa775741a403",
  "box_uuid": "c4f81f0d-60e0-44d0-976c-bac385fe6ae9",
}
```
#### Ok response:
```json5
{
  "status": "ok"
}
```
#### Error codes:
* validation-error - at least one provided field value is invalid
* repository-error - DB error (should not happen)


### POST /registration/box - register box data (only for target device)
#### Auth - basic
#### Body:
```json5
{
  "tunnel_domain": "www.domain.com",
  "uuid": "c4f81f0d-60e0-44d0-976c-bac385fe6ae9"
}
```
#### Ok response:
```json5
{
  "status": "ok"
}
```
#### Error codes:
* validation-error - at least one provided field value is invalid
* repository-error - DB error (should not happen)
