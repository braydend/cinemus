package api

import (
	"encoding/json"
	"fmt"
	"github.com/braydend/movie-list/server/utils"
	"io/ioutil"
	"log"
	"net/http"
)

// Handlers for communicating with The Movie DB

var tmdbBaseUrl = "https://api.themoviedb.org/3/"

type ShowSearchResult struct {
	Page         int    `json:"page"`
	Results      []Show `json:"results"`
	TotalPages   int    `json:"total_pages"`
	TotalResults int    `json:"total_results"`
}

type Show struct {
	Adult            bool     `json:"adult"`
	BackdropPath     string   `json:"backdrop_path"`
	GenreIds         []int    `json:"genre_ids"`
	ID               int      `json:"id"`
	OriginCountry    []string `json:"origin_country"`
	OriginalLanguage string   `json:"original_language"`
	OriginalName     string   `json:"original_name"`
	Overview         string   `json:"overview"`
	Popularity       float64  `json:"popularity"`
	PosterPath       string   `json:"poster_path"`
	FirstAirDate     string   `json:"first_air_date"`
	Name             string   `json:"name"`
	VoteAverage      float64  `json:"vote_average"`
	VoteCount        int      `json:"vote_count"`
}

type Movie struct {
	Adult            bool    `json:"adult"`
	BackdropPath     string  `json:"backdrop_path"`
	GenreIds         []int   `json:"genre_ids"`
	ID               int     `json:"id"`
	OriginalLanguage string  `json:"original_language"`
	OriginalTitle    string  `json:"original_title"`
	Overview         string  `json:"overview"`
	Popularity       float64 `json:"popularity"`
	PosterPath       string  `json:"poster_path"`
	ReleaseDate      string  `json:"release_date"`
	Title            string  `json:"title"`
	Video            bool    `json:"video"`
	VoteAverage      float64 `json:"vote_average"`
	VoteCount        int     `json:"vote_count"`
}

type MovieSearchResult struct {
	Page         int     `json:"page"`
	Results      []Movie `json:"results"`
	TotalPages   int     `json:"total_pages"`
	TotalResults int     `json:"total_results"`
}

func FindMovie(query string) (movies []Movie) {
	var queryResults MovieSearchResult
	results := find("movie", query)
	err := json.Unmarshal(results, &queryResults)

	if err != nil {
		log.Fatalf("Failed to form query for %s to a Movie struct. %v", query, err)
	}

	movies = queryResults.Results

	return
}

func FindShow(query string) (shows []Show) {
	var queryResults ShowSearchResult
	results := find("tv", query)
	err := json.Unmarshal(results, &queryResults)

	if err != nil {
		log.Fatalf("Failed to form query for %s to a Show struct. %v", query, err)
	}

	shows = queryResults.Results

	return
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
