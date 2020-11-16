build:
	docker build -t evalik .
test:
	docker run -it --rm evalik
