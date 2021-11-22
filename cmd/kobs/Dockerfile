FROM --platform=linux/amd64 node:14 as app
WORKDIR /kobs
COPY app /kobs/app
#RUN cd app && yarn install --frozen-lockfile --network-timeout 3600000
RUN cd app && yarn install --network-timeout 3600000
RUN cd app && yarn build

FROM golang:1.17.0-alpine3.14 as api
ARG TARGETPLATFORM
ARG BUILDPLATFORM
RUN echo 'https://repository.walmart.com/content/repositories/alpine-v39/main' > /etc/apk/repositories
RUN echo 'https://repository.walmart.com/content/repositories/alpine-v39/community' >> /etc/apk/repositories
RUN echo "Building on $BUILDPLATFORM, for $TARGETPLATFORM" > /log
RUN apk update && apk add git make
WORKDIR /kobs
ENV http_proxy=http://sysproxy.wal-mart.com:8080\
    https_proxy=http://sysproxy.wal-mart.com:8080\
    no_proxy=localhost,127.0.0.1,.walmart.com,*.walmart.com,*.wal-mart.com,.wal-mart.com,*.walmart.net,.walmart.net
COPY go.mod go.sum ./
RUN go mod tidy
RUN go mod download
COPY . .
RUN go mod tidy
RUN make build

FROM alpine:3.14
RUN echo 'https://repository.walmart.com/content/repositories/alpine-v39/main' > /etc/apk/repositories
RUN echo 'https://repository.walmart.com/content/repositories/alpine-v39/community' >> /etc/apk/repositories
ENV http_proxy=http://sysproxy.wal-mart.com:8080\
    https_proxy=http://sysproxy.wal-mart.com:8080\
    no_proxy=localhost,127.0.0.1,.walmart.com,*.walmart.com,*.wal-mart.com,.wal-mart.com,*.walmart.net,.walmart.net
RUN apk update && apk add --no-cache ca-certificates
RUN mkdir /kobs
COPY --from=app /kobs/app/build /kobs/app/build
COPY --from=api /kobs/bin/kobs /kobs
WORKDIR /kobs
USER nobody
ENTRYPOINT  [ "/kobs/kobs" ]
