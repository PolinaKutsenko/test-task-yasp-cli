install:
	npm ci

makeScreenshot:
	node bin/makeScreenshot.js

lint:
	npx eslint .
