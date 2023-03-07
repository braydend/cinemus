.PHONY: build clean deploy gomodgen

build: gomodgen
	export GO111MODULE=on
	env GOARCH=amd64 GOOS=linux go build -ldflags="-s -w" -o bin/searchMovies server/handlers/movie/searchMovies/main.go
	env GOARCH=amd64 GOOS=linux go build -ldflags="-s -w" -o bin/searchShows server/handlers/show/searchShows/main.go
	env GOARCH=amd64 GOOS=linux go build -ldflags="-s -w" -o bin/updateList server/handlers/list/updateList/main.go
	env GOARCH=amd64 GOOS=linux go build -ldflags="-s -w" -o bin/getList server/handlers/list/getList/main.go

clean:
	rm -rf ./bin ./vendor go.sum

deploy: clean build
	sls deploy --verbose

gomodgen:
	chmod u+x gomod.sh
	./gomod.sh
