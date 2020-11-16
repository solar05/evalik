build:
	docker build -t evalik .
run:
	docker run -it --rm evalik
test:
	node ./__tests__/run.js
