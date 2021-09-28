.PHONY cp-env:
cp-env:
	cp ./front/.env.dist ./front/.env
	cp ./server/.env.dist ./server/.env

.PHONY: build
build:
	docker-compose -f .docker/docker-compose.yml build

.PHONY: install-deps
install-deps:
	docker-compose -f .docker/docker-compose.yml run --rm app yarn install
	docker-compose -f .docker/docker-compose.yml run --rm server yarn install

.PHONY: start
start:
	docker-compose -f .docker/docker-compose.yml up

.PHONY: test
test:
	docker-compose -f .docker/docker-compose.yml run --rm app yarn test

.PHONY: dev
dev: cp-env build install-deps start
