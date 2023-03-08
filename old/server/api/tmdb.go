package api

import (
	"encoding/json"
	"fmt"
	"github.com/braydend/movie-list/server/types"
	"github.com/braydend/movie-list/server/utils"
	"io/ioutil"
	"log"
	"net/http"
)

// Handlers for communicating with The Movie DB

var tmdbBaseUrl = "https://api.themoviedb.org/3/"

func SearchMovies(query string) (movies []types.Movie) {
	var queryResults types.MovieSearchResult
	results := search("movie", query)
	err := json.Unmarshal(results, &queryResults)

	if err != nil {
		log.Fatalf("Failed to form query for %s to a Movie struct. %v", query, err)
	}

	movies = queryResults.Results

	return
}

func SearchShows(query string) (shows []types.Show) {
	var queryResults types.ShowSearchResult
	results := search("tv", query)
	err := json.Unmarshal(results, &queryResults)

	if err != nil {
		log.Fatalf("Failed to form query for %s to a Show struct. %v", query, err)
	}

	shows = queryResults.Results

	return
}

func search(mediaType string, query string) []byte {
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
