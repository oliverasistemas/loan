FROM golang:latest

WORKDIR /app
COPY . .

RUN go install ./cmd/loand

RUN bash ./init.sh

EXPOSE 8080
CMD ["loand", "start"]