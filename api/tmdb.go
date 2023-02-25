package api

import (
	"fmt"
	"github.com/braydend/movie-list/utils"
	"io/ioutil"
	"log"
	"net/http"
)

// Handlers for communicating with The Movie DB

var tmdbBaseUrl = "https://api.themoviedb.org/3/"

func FindMovie(query string) []byte {
	return find("movie", query)
}

func FindShow(query string) []byte {
	return find("tv", query)
}

func find(mediaType string, query string) []byte {
	key := utils.GetEnvVar("MOVIE_DB_API_KEY")
	endpoint := fmt.Sprintf("%s/search/%s?api_key=%s&query=%s", tmdbBaseUrl, mediaType, key, query)

	queryResult, err := http.Get(endpoint)
	if err != nil {
		log.Fatalln(err)
	}

	body, err := ioutil.ReadAll(queryResult.Body)
	if err != nil {
		log.Fatalln(err)
	}

	return body
}
