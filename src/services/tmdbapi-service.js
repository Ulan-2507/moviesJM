class TmdbService {
  _apiBase = "https://api.themoviedb.org/3";
  _imgApiBase = "https://image.tmdb.org/t/p/w";

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
      `/search/movie?api_key=${process.env.REACT_APP_TMDB_KEY}&query=${searchTerm}&page=${page}&include_adult=false`
    );
  };
  getSessionID = async () => {
    return await this.getResource(
      `/authentication/guest_session/new?api_key=${process.env.REACT_APP_TMDB_KEY}`
    );
  };
  getRetedMovies = async (sessionID) => {
    return await this.getResource(
      `/guest_session/${sessionID}/rated/movies?api_key=${process.env.REACT_APP_TMDB_KEY}&language=en-US&sort_by=created_at.asc`
    );
  };
  setMovieRating = async (movieId, rating, sessionID) => {
    const response = await fetch(
      `${this._apiBase}/movie/${movieId}/rating?api_key=${process.env.REACT_APP_TMDB_KEY}&guest_session_id=${sessionID}`,
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
  deleteRatedMovie = async (movieId, sessionID) => {
    return await fetch(
      `${this._apiBase}/movie/${movieId}/rating?api_key=${process.env.REACT_APP_TMDB_KEY}&guest_session_id=${sessionID}`,
      { method: "DELETE" }
    );
  };
  getPosterImage = (posterPath, size) => {
    return `${this._imgApiBase}${size}${posterPath}`;
  };
  getGenres = async () => {
    return this.getResource(
      `/genre/movie/list?api_key=${process.env.REACT_APP_TMDB_KEY}`
    );
  };
  getMoviesByGenre = async (genreID, page) => {
    return await this.getResource(
      `/discover/movie?api_key=${process.env.REACT_APP_TMDB_KEY}&language=en-US&with_genres=${genreID}&page=${page}`
    );
  };
}

const TMDBService = new TmdbService();

export default TMDBService;
