BRANCH    ?= $(shell git rev-parse --abbrev-ref HEAD)
BUILDTIME ?= $(shell date '+%Y-%m-%d@%H:%M:%S')
BUILDUSER ?= $(shell id -un)
REPO      ?= github.com/kobsio/app
REVISION  ?= $(shell git rev-parse HEAD)
VERSION   ?= $(shell git describe --tags)

.PHONY: build
build:
	@go build -ldflags "-X github.com/kobsio/kobs/pkg/version.Version=${VERSION} \
		-X github.com/kobsio/kobs/pkg/version.Revision=${REVISION} \
		-X github.com/kobsio/kobs/pkg/version.Branch=${BRANCH} \
		-X github.com/kobsio/kobs/pkg/version.BuildUser=${BUILDUSER} \
		-X github.com/kobsio/kobs/pkg/version.BuildDate=${BUILDTIME}" \
		-o ./bin/kobs ./cmd/kobs;

.PHONY: release-major
release-major:
	$(eval MAJORVERSION=$(shell git describe --tags --abbrev=0 | sed s/v// | awk -F. '{print "v"$$1+1".0.0"}'))
	@git checkout main
	@git pull
	@git tag -a $(MAJORVERSION) -m 'Release $(MAJORVERSION)'
	@git push origin --tags

.PHONY: release-minor
release-minor:
	$(eval MINORVERSION=$(shell git describe --tags --abbrev=0 | sed s/v// | awk -F. '{print "v"$$1"."$$2+1".0"}'))
	@git checkout main
	@git pull
	@git tag -a $(MINORVERSION) -m 'Release $(MINORVERSION)'
	@git push origin --tags

.PHONY: release-patch
release-patch:
	$(eval PATCHVERSION=$(shell git describe --tags --abbrev=0 | sed s/v// | awk -F. '{print "v"$$1"."$$2"."$$3+1}'))
	@git checkout main
	@git pull
	@git tag -a $(PATCHVERSION) -m 'Release $(PATCHVERSION)'
	@git push origin --tags
