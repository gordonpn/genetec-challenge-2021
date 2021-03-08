.PHONY: start

start:
	docker build -t genetec-challenge-2021 . && docker run -d --init --rm genetec-challenge-2021
