BROWSERIFY = node ./node_modules/browserify/bin/cmd.js
MOCHA = ./node_modules/.bin/mocha
UGLIFYJS = ./node_modules/.bin/uglifyjs
BANNER = "/*! lil-uuid - v0.1 - MIT License - https://github.com/lil-js/uuid */"
MOCHA_PHANTOM = ./node_modules/.bin/mocha-phantomjs

define release
	VERSION=`node -pe "require('./package.json').version"` && \
	NEXT_VERSION=`node -pe "require('semver').inc(\"$$VERSION\", '$(1)')"` && \
	node -e "\
		var j = require('./package.json');\
		j.version = \"$$NEXT_VERSION\";\
		var s = JSON.stringify(j, null, 2);\
		require('fs').writeFileSync('./package.json', s);" && \
	node -e "\
		var j = require('./bower.json');\
		j.version = \"$$NEXT_VERSION\";\
		var s = JSON.stringify(j, null, 2);\
		require('fs').writeFileSync('./bower.json', s);" && \
	git commit -am "release $$NEXT_VERSION" && \
	git tag "$$NEXT_VERSION" -m "Version $$NEXT_VERSION"
endef

default: all
all: test
browser: uglify
test: browser mocha

uglify:
	$(UGLIFYJS) uuid.js --mangle --preamble $(BANNER) --source-map uuid.min.js.map > uuid.min.js

mocha:
	$(MOCHA_PHANTOM) --reporter spec --ui bdd test/runner.html
	$(MOCHA) --reporter spec --ui bdd

loc:
	wc -l uuid.js

gzip:
	gzip -c uuid.js | wc -c

release:
	@$(call release, patch)

release-minor:
	@$(call release, minor)

publish: browser release
	git push --tags origin HEAD:master
