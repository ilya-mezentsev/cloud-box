ROOT_DIR := $(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))
BOX_DIR := $(ROOT_DIR)/cbox
BACKEND_DIR := $(ROOT_DIR)/backend
FRONTEND_DIR := $(ROOT_DIR)/frontend
DOCKER_COMPOSE_FILE := $(ROOT_DIR)/docker-compose.yaml
PROJECT_NAME = "cloud_box"

BOX_MANIFEST_FILE := $(BOX_DIR)/Cargo.toml
DEVICES_MOUNT_ROOT := $(ROOT_DIR)/tmp-data

BACKEND_CONFIG_PATH := $(BACKEND_DIR)/config/main.json
BACKEND_LIBS_PATH := $(BACKEND_DIR)/libs
BACKEND_SOURCE_PATH := $(BACKEND_DIR)/source

build: box-build backend-build frontend-build containers-build

run: containers-run

tests: box-tests backend-tests

box-build:
	cargo build --manifest-path $(BOX_MANIFEST_FILE)

box-run:
	DEVICES_MOUNT_ROOT=$(DEVICES_MOUNT_ROOT) cargo run --manifest-path $(BOX_MANIFEST_FILE)

box-tests:
	cargo test --manifest-path $(BOX_MANIFEST_FILE) -- --nocapture

box-check:
	cargo check --manifest-path $(BOX_MANIFEST_FILE)

box-fmt:
	cargo fmt --manifest-path $(BOX_MANIFEST_FILE)

box-calc-lines:
	( find $(BOX_DIR)/src/ -name '*.rs' -print0 | xargs -0 cat ) | wc -l

backend-build:
	unset GOPATH && cd $(BACKEND_DIR) && go build main.go

backend-run:
	unset GOPATH && cd $(BACKEND_DIR) && go run main.go -config $(BACKEND_CONFIG_PATH)

backend-tests:
	unset GOPATH && cd $(BACKEND_SOURCE_PATH) && go test ./... -cover | { grep -v "no test files"; true; }

backend-check:
	unset GOPATH && cd $(BACKEND_SOURCE_PATH) && go vet ./...

backend-fmt:
	unset GOPATH && cd $(BACKEND_SOURCE_PATH) && go fmt ./...

backend-calc-lines:
	( find $(BACKEND_SOURCE_PATH) -name '*.go' -print0 | xargs -0 cat ) | wc -l

db-run:
	docker-compose -f $(ROOT_DIR)/docker-compose.yaml up db

frontend-build:
	cd $(FRONTEND_DIR) && npm i && npm run build

containers-run:
	docker-compose -f $(DOCKER_COMPOSE_FILE) -p $(PROJECT_NAME) up

containers-stop:
	docker-compose -f $(DOCKER_COMPOSE_FILE) -p $(PROJECT_NAME) down

containers-build:
	docker-compose -f $(DOCKER_COMPOSE_FILE) -p $(PROJECT_NAME) build
