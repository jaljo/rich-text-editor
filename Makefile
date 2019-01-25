.PHONY: dev
dev: build local-deploy install-deps

.PHONY: kill
kill:
	docker stack rm knp_rte

.PHONY: install-deps
install-deps:
	docker-compose -f .docker/app.yml run --rm app yarn install

.PHONY: local-deploy
local-deploy:
	docker stack deploy -c .docker/app.yml --resolve-image=never --prune knp_rte

.PHONY: test
test:
	docker-compose -f .docker/app.yml run --rm test

.PHONY: build
build:
	docker-compose -f .docker/app.yml build

.PHONY: lint-yaml
lint-yaml: .ensure-stage-exists
	docker-compose -f .docker/app.yml config > /dev/null

.PHONY: lint-dockerfiles
lint-dockerfiles:
	@bin/lint-dockerfiles
