export default class TmdbService {
  _apiBase = "https://api.themoviedb.org/3";
  _apiKey = "api_key=8cb439222da4a8901afb40ed93e0947f";
  _imgBase = "https://image.tmdb.org/t/p/w200";
  GENRE_API = `/3/genre/movie/list?${this._apiKey}`;

  getResource = async (url) => {
    const res = await fetch(`${this._apiBase}${url}`);

    if (!res.ok) {
      throw new Error({
        status_message: `Could not fetch ${url}, received ${res.status}`,
      });
    }
    return await res.json();
  };
  searchMovies = async (searchTerm, page) => {
    return await this.getResource(
      `/search/movie?${this._apiKey}&query=${searchTerm}&page=${page}`
    );
  };

  getSessionID = async () => {
    return await this.getResource(
      `/authentication/guest_session/new?${this._apiKey}`
    );
  };

  getRetedMovies = async (sessionID) => {
    return await this.getResource(
      `/guest_session/${sessionID}/rated/movies?${this._apiKey}&language=en-US&sort_by=created_at.asc`
    );
  };

  setMovieRating = async (movieId, rating, sessionID) => {
    localStorage.setItem(
      "ratedMovies",
      JSON.stringify({
        ...JSON.parse(localStorage.getItem("ratedMovies")),
        [movieId]: rating,
      })
    );

    const response = await fetch(
      `${this._apiBase}/movie/${movieId}/rating?${this._apiKey}&guest_session_id=${sessionID}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          value: rating,
        }),
      }
    );
    return response.json();
  };

  getPosterImage = (posterPath) => {
    return `${this._imgBase}${posterPath}`;
  };

  getGenres = async () => {
    return this.getResource(`/genre/movie/list?${this._apiKey}`);
  };

  getMoviesByGenre = async (genreID, page) => {
    return await this.getResource(
      `/discover/movie?${this._apiKey}&language=en-US&with_genres=${genreID}&page=${page}`
    );
  };
}
