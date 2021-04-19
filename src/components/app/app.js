import React, { Component } from "react";
import debounce from "lodash.debounce";

import Header from "../header";
import MoviesList from "../movies-list";
import SearchBar from "../searchBar";
import Spinner from "../spinner";
import PaginationBar from "../paginationBar";
import ErrorMessage from "../error-message";
import { TmdbapiServiceProvider } from "../tmdbapi-sevice-context";

import TmdbService from "../../services/tmdbapi-service";

export default class App extends Component {
  tmdbService = new TmdbService();

  state = {
    movies: [],
    totalResults: 0,
    currentPage: 1,
    searchTerm: "",
    searchGenreID: null,
    sessionId: null,
    tab: "Search",
    isLoading: false,
    isError: false,
    error: null,
    genresByCodes: new Map(),
  };

  resetData = () => {
    this.setState({
      movies: [],
      totalResults: 0,
      currentPage: 1,
      searchTerm: "",
      searchGenreID: null,
      isLoading: false,
    });
  };

  setData = (data) => {
    if (data.total_results === 0) {
      this.resetData();
      this.errorHendler({
        status_message: `Not found movie`,
      });
    } else if (data.status_code) {
      this.resetData();
      this.errorHendler(data);
    } else {
      this.setState({
        movies: data.results,
        totalResults: data.total_results,
        isLoading: false,
        isError: false,
      });
    }
  };

  search = debounce((searchWord) => {
    if (searchWord) {
      this.tmdbService
        .searchMovies(searchWord, 1)
        .then((data) => {
          this.setData(data);
        })
        .catch((e) => {
          this.errorHendler(e);
        });

      this.setState({ currentPage: 1, searchGenre: null });
    }
  }, 400);

  errorHendler = (data) => {
    this.setState({ isError: true, error: data });
  };

  onChangePage = (pageNumber) => {
    this.setState({ currentPage: pageNumber });
    if (this.state.searchGenre) {
      this.tmdbService
        .getMoviesByGenre(this.state.searchGenreID, pageNumber)
        .then((data) => {
          this.setData(data);
        })
        .catch((e) => {
          this.errorHendler(e);
        });
    } else {
      this.tmdbService
        .searchMovies(this.state.searchTerm, pageNumber)
        .then((data) => {
          this.setData(data);
        })
        .catch((e) => {
          this.errorHendler(e);
        });
    }
  };

  searchHandler = (e) => {
    if (e.target.value.length === 0) {
      this.resetData();
    } else {
      this.search(e.target.value);
      this.setState({ searchTerm: e.target.value, isLoading: true });
    }
  };

  searchByGenre = (genreID) => {
    this.setState({ movies: [], searchGenreID: genreID, isLoading: true });
    this.tmdbService
      .getMoviesByGenre(genreID, 1)
      .then((data) => {
        this.setData(data);
      })
      .catch((e) => {
        this.errorHendler(e);
      });
  };

  tabToggle = (e) => {
    this.setState({ tab: e.target.textContent });
    if (e.target.textContent === "Rated") {
      this.setState({ movies: [], isLoading: true });
      this.tmdbService
        .getRetedMovies(this.state.sessionId)
        .then((data) => {
          this.setData(data);
        })
        .catch((e) => {
          this.errorHendler(e);
        });
    } else if (this.state.searchTerm) {
      this.setState({ movies: [], isLoading: true });
      this.tmdbService
        .searchMovies(this.state.searchTerm, this.state.currentPage)
        .then((data) => {
          this.setData(data);
        })
        .catch((e) => {
          this.errorHendler(e);
        });
    } else {
      this.setState({ movies: [] });
    }
  };

  setGenresByCodes = () => {
    this.tmdbService.getGenres().then((data) => {
      let genresCodes = new Map();
      data.genres.map((g) => genresCodes.set(g.id, g.name));
      this.setState({ genresByCodes: genresCodes });
    });
  };

  componentDidMount() {
    this.setGenresByCodes();

    if (localStorage.getItem("sessionId")) {
      this.setState({
        sessionId: JSON.parse(localStorage.getItem("sessionId")),
      });
    } else {
      this.tmdbService
        .getSessionID()
        .then((data) => {
          if (data.status_code) {
            this.setState({ sessionId: null });
            this.errorHendler(data);
          } else {
            this.setState({ sessionId: data.guest_session_id });
          }
          return data;
        })
        .then((data) =>
          localStorage.setItem(
            "sessionId",
            JSON.stringify(data.guest_session_id)
          )
        )
        .catch((e) => this.errorHendler(e));
    }
  }

  render() {
    const {
      movies,
      totalResults,
      currentPage,
      tab,
      isLoading,
      isError,
      error,
    } = this.state;

    return (
      <TmdbapiServiceProvider
        value={{
          tmdbService: this.tmdbService,
          searchByGenre: this.searchByGenre,
          genresByCodes: this.state.genresByCodes,
          sessionId: this.state.sessionId,
        }}
      >
        <Header tab={tab} tabToggle={this.tabToggle} />
        <SearchBar tab={tab} searchHandler={this.searchHandler} />
        <ErrorMessage errorData={error} isError={isError} />
        <Spinner isLoading={isLoading} />
        <MoviesList movies={movies} />
        <PaginationBar
          isLoading={isLoading}
          movies={movies}
          totalResults={totalResults}
          currentPage={currentPage}
          onChangePage={this.onChangePage}
        />
      </TmdbapiServiceProvider>
    );
  }
}
