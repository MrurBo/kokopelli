source "https://rubygems.org"

# Core
gem "jekyll", "~> 4.3.4"

# Jekyll plugins
group :jekyll_plugins do
  gem "jekyll-feed", "~> 0.17"
  gem "jekyll-seo-tag", "~> 2.8"
  gem "jekyll-sitemap", "~> 1.4"
  gem "jekyll-paginate", "~> 1.1"
  gem "jekyll-archives", "~> 2.2"
end

# Ruby 3.4+ stdlib gems (externalized)
gem "csv", "~> 3.3"
gem "logger", "~> 1.6"
gem "base64", "~> 0.2"

# Dev/runtime extras
gem "jekyll-watch", "~> 2.2"
gem "webrick", "~> 1.8"  # needed for `jekyll serve` on Ruby 3+

# Windows-specific
gem "wdm", ">= 0.1.0", platforms: [:mingw, :mswin, :x64_mingw]
gem "tzinfo-data", platforms: [:mingw, :mswin, :x64_mingw, :jruby]
