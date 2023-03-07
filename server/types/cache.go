package types

type SearchResults struct {
	Query     string `bson:"query"`
	Results   []Media
	MediaType string `bson:"mediaType"`
}

type CachedSearchResult struct {
	SearchResults `bson:"searchResults"`
	Expiry        int64  `bson:"expiry"`
	ID            string `bson:"_id"`
}
