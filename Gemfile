source "https://rubygems.org"

# Usa github-pages para compatibilidad directa con GitHub Pages
gem "github-pages", group: :jekyll_plugins

group :jekyll_plugins do
  gem "jekyll-feed", "~> 0.12"
  gem "jekyll-seo-tag"
end

# Windows/JRuby: timezone data
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

# Watcher en Windows
gem "wdm", "~> 0.1.1", :platforms => [:mingw, :x64_mingw, :mswin]

# Servidor HTTP embebido (Ruby 3+)
gem "webrick", "~> 1.8"
