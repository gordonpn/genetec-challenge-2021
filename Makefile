.DEFAULT: start
.PHONY: start
DIR := ${CURDIR}

start:
	docker build -t genetec-challenge-2021 . \
	&& docker run \
	-d \
	--restart always \
	--init \
	-v $(DIR)/wantedPlates.json:/app/wantedPlates.json \
	genetec-challenge-2021
