package domain

import (
	"github.com/braydend/movie-list/server/types"
)

func ParseMediaFromMovie(movie types.Movie) types.Media {
	return types.Media{Id: movie.ID, Name: movie.Title}
}

func ParseMediaFromShow(show types.Show) types.Media {
	return types.Media{Id: show.ID, Name: show.Name}
}
