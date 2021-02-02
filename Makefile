ROOT_DIR := $(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))
BOX_DIR := $(ROOT_DIR)/cbox

BOX_MANIFEST_FILE := $(BOX_DIR)/Cargo.toml
DEVICES_MOUNT_ROOT := $(ROOT_DIR)/tmp-data

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
