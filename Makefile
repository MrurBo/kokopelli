# Makefile for Jekyll
# Usage examples:
#   make serve          # serve locally with live-reload
#   make serve-drafts   # serve incl. drafts & future posts
#   make build          # build once (development)
#   make build-prod     # build for production (JEKYLL_ENV=production)
#   make clean          # remove _site and cache
#   make install        # bundle install (vendor/bundle)
#   make check          # jekyll doctor
#   make update         # bundle update
#   make help           # list targets

# ---------- Config ----------
SITE_DIR       := _site
HOST           := 0.0.0.0
PORT           := 4000
LR_PORT        := 35729
CONFIG         := _config.yml

BUNDLE         := bundle
JEKYLL         := $(BUNDLE) exec jekyll

# Install gems to vendor/bundle so the repo stays clean
BUNDLE_FLAGS   := config set path 'vendor/bundle'
SERVE_FLAGS    := --host $(HOST) --port $(PORT) --config $(CONFIG)
BUILD_FLAGS    := --config $(CONFIG)

# Default target: run the live server
.DEFAULT_GOAL := serve

.PHONY: help install serve serve-drafts build build-prod clean check update

help:
	@awk 'BEGIN{FS=":.*##"; printf "Available targets:\n"} /^[a-zA-Z0-9_-]+:.*##/{printf "  \033[36m%-14s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install Ruby gems into vendor/bundle
	@$(BUNDLE) $(BUNDLE_FLAGS)
	@$(BUNDLE) install

serve: install ## Serve locally with live-reload
	@$(JEKYLL) serve $(SERVE_FLAGS)

serve-drafts: install ## Serve incl. drafts and future posts (live-reload)
	@$(JEKYLL) serve $(SERVE_FLAGS) --drafts --future

build: install ## Build the site (development)
	@$(JEKYLL) build $(BUILD_FLAGS) --incremental

build-prod: install ## Build the site for production (minifiers/plugins respect JEKYLL_ENV)
	@JEKYLL_ENV=production $(JEKYLL) build $(BUILD_FLAGS)

clean: ## Clean generated site and cache
	@rm -rf $(SITE_DIR) .jekyll-cache .sass-cache

check: install ## Run basic health checks
	@$(JEKYLL) doctor

update: ## Update all gems (use with care)
	@$(BUNDLE) update
