import { rest } from "msw";
import { url } from "../../src/config";
import { buildStubMovie, buildStubShow } from "../api";

export const handlers = [
  rest.get(`${url.TMDB_URL}/movie/:id`, (req, res, ctx) => {
    const movie = buildStubMovie();

    return res(ctx.status(200), ctx.json(movie));
  }),

  rest.get(`${url.TMDB_URL}/search/movie`, (req, res, ctx) => {
    const movie = buildStubMovie();

    return res(
      ctx.status(200),
      ctx.json({
        page: 1,
        total_pages: 1,
        total_results: 1,
        results: [movie],
      })
    );
  }),

  rest.get(`${url.TMDB_URL}/tv/:id`, (req, res, ctx) => {
    const show = buildStubShow();

    return res(ctx.status(200), ctx.json(show));
  }),

  rest.get(`${url.TMDB_URL}/search/tv`, (req, res, ctx) => {
    const show = buildStubShow();

    return res(
      ctx.status(200),
      ctx.json({
        page: 1,
        total_pages: 1,
        total_results: 1,
        results: [show],
      })
    );
  }),

    rest.get(`${url.TMDB_URL}/configuration`, (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json({
                "configuration": {
                    "images": {
                        "base_url": "http://image.tmdb.org/t/p/",
                        "secure_base_url": "https://image.tmdb.org/t/p/",
                        "backdrop_sizes": [
                            "w300",
                            "w780",
                            "w1280",
                            "original"
                        ],
                        "logo_sizes": [
                            "w45",
                            "w92",
                            "w154",
                            "w185",
                            "w300",
                            "w500",
                            "original"
                        ],
                        "poster_sizes": [
                            "w92",
                            "w154",
                            "w185",
                            "w342",
                            "w500",
                            "w780",
                            "original"
                        ],
                        "profile_sizes": [
                            "w45",
                            "w185",
                            "h632",
                            "original"
                        ],
                        "still_sizes": [
                            "w92",
                            "w185",
                            "w300",
                            "original"
                        ]
                    },
                    "change_keys": [
                        "adult",
                        "air_date",
                        "also_known_as",
                        "alternative_titles",
                        "biography",
                        "birthday",
                        "budget",
                        "cast",
                        "certifications",
                        "character_names",
                        "created_by",
                        "crew",
                        "deathday",
                        "episode",
                        "episode_number",
                        "episode_run_time",
                        "freebase_id",
                        "freebase_mid",
                        "general",
                        "genres",
                        "guest_stars",
                        "homepage",
                        "images",
                        "imdb_id",
                        "languages",
                        "name",
                        "network",
                        "origin_country",
                        "original_name",
                        "original_title",
                        "overview",
                        "parts",
                        "place_of_birth",
                        "plot_keywords",
                        "production_code",
                        "production_companies",
                        "production_countries",
                        "releases",
                        "revenue",
                        "runtime",
                        "season",
                        "season_number",
                        "season_regular",
                        "spoken_languages",
                        "status",
                        "tagline",
                        "title",
                        "translations",
                        "tvdb_id",
                        "tvrage_id",
                        "type",
                        "video",
                        "videos"
                    ]
                }
            })
        );
    }),
];
