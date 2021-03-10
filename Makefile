.DEFAULT: start
.PHONY: start fresh
DIR := ${CURDIR}

start:
	docker build -t genetec-challenge-2021 . \
	&& docker run \
	-d \
	--restart always \
	--init \
	-v $(DIR)/wantedPlates.json:/app/wantedPlates.json \
	-v $(DIR)/seenPlates.csv:/app/seenPlates.csv \
	-e IN_DOCKER='true' \
	genetec-challenge-2021

fresh:
	docker build -t genetec-challenge-2021 . \
	&& docker run \
	-d \
	--restart always \
	--init \
	-v $(DIR)/wantedPlates.json:/app/wantedPlates.json \
	-v $(DIR)/seenPlates.csv:/app/seenPlates.csv \
	-e IN_DOCKER='true' \
	-e START_FRESH='true' \
	genetec-challenge-2021
