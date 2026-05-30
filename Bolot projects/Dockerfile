FROM golang:1.26.2-alpine
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o main ./cmd/main.go


FROM alpine:latest
COPY --from=0 /app/main .
CMD ["./main"]