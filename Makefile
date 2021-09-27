.PHONY: dev
dev: build install-deps start

.PHONY: start
start:
	docker-compose -f .docker/app.yml up

.PHONY: install-deps
install-deps:
	docker-compose -f .docker/app.yml run --rm app yarn install

.PHONY: test
test:
	docker-compose -f .docker/app.yml run --rm app yarn test

.PHONY: build
build:
	docker-compose -f .docker/app.yml build
