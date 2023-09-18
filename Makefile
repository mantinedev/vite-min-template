include .env.local

.PHONY: help

help: ## Show current help message
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' ./Makefile | sort | \
	awk 'BEGIN {FS = ":.*?## "}; {printf "make \033[32m%-30s\033[0m %s\n", $$1, $$2}'
	@echo ""

install: ## Install via YARN
	yarn install --frozen-lockfile || yarn install

lint: ## Check & fix code style js
	@echo "🔎 [ESLint] Checking code style..."
	@npx eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0
	@echo "✅  [ESLint] Code style check passed"

build: lint ## Build for PROD project
	@echo "\n🚀 [Build Production] Running ..."
	@npx tsc && vite build
	@echo "🎉 [Build Production] Done!"

preview: ## Run preview project
	@npx vite preview

start: ## Start the server with an optional port (e.g., make serve PORT=4040)
	@echo "\n🚀 Starting server..."
ifeq ($(PORT),)
	npx vite --host ${DEFAULT_HOST} --port $(DEFAULT_PORT)
else
	npx vite --host ${DEFAULT_HOST} --port $(PORT)
endif
