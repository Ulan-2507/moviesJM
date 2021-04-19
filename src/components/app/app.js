import React, { Component } from "react";

import Header from "../header";
import MoviesList from "../movies-list";
import SearchBar from "../searchBar";
import Spinner from "../spinner";
import PaginationBar from "../paginationBar";
import ErrorMessage from "../error-message";
import { TmdbapiServiceProvider } from "../tmdbapi-sevice-context";

import TMDBService from "../../services/tmdbapi-service";
const {
  searchMovies,
  getMoviesByGenre,
  getRetedMovies,
  getGenres,
  getSessionID,
} = TMDBService;

export default class App extends Component {
  tabs = {
    Search: "Search",
    Rated: "Rated",
  };

  state = {
    movies: [],
    totalResults: 0,
    currentPage: 1,
    searchTerm: "",
    searchGenreID: null,
    sessionId: null,
    tab: this.tabs.Search,
    isLoading: false,
    error: null,
    genresByCodes: new Map(),
  };

  loading = () => {
    this.setState({
      movies: [],
      isLoading: true,
    });
  };

  errorHendler = (data) => {
    this.setState({ error: data, isLoading: false });
  };
  resetError = () => {
    this.setState({ error: null });
  };

  resetData = () => {
    this.setState({
      movies: [],
      totalResults: 0,
      currentPage: 1,
      searchGenreID: null,
    });
  };
  setData = (data) => {
    if (data.total_results === 0) {
      this.resetData();
      this.errorHendler({
        status_message: `Not found movie`,
      });
      return data;
    }
    if (data.status_code) {
      this.resetData();
      this.errorHendler(data);
      return;
    }
    this.setState({
      movies: data.results,
      totalResults: data.total_results,
      isLoading: false,
    });
  };
  getData = (fn, ...args) => {
    fn(...args)
      .then((data) => {
        this.setData(data);
      })
      .catch((e) => {
        this.errorHendler(e);
      });
  };

  searchHandler = (searchWord) => {
    if (searchWord.length !== 0) {
      this.resetError();
      this.loading();
      this.setState({ searchTerm: searchWord });
      this.getData(searchMovies, searchWord, 1);
      this.setState({ currentPage: 1, searchGenre: null });
      return;
    }
    this.resetError();
    this.resetData();
    this.setState({ searchTerm: searchWord });
  };

  searchByGenre = (genreID) => {
    this.loading();
    this.setState({ searchGenreID: genreID });
    this.getData(getMoviesByGenre, genreID, 1);
  };

  tabToggle = (selectedTab) => {
    this.resetError();
    this.loading();
    this.setState({ tab: selectedTab });
    if (selectedTab === this.tabs.Rated) {
      this.getData(getRetedMovies, this.state.sessionId);
      return;
    }
    if (this.state.searchTerm) {
      this.getData(searchMovies, this.state.searchTerm, this.state.currentPage);
      return;
    }
    this.setState({ movies: [], isLoading: false });
    this.resetError();
  };

  onChangePage = (pageNumber) => {
    this.loading();
    this.setState({ currentPage: pageNumber });
    if (this.state.searchGenreID) {
      this.getData(getMoviesByGenre, this.state.searchGenreID, pageNumber);
      return;
    }
    this.getData(searchMovies, this.state.searchTerm, pageNumber);
  };

  setGenresByCodes = () => {
    getGenres().then((data) => {
      let genresCodes = new Map();
      data.genres.map((g) => genresCodes.set(g.id, g.name));
      this.setState({ genresByCodes: genresCodes });
    });
  };

  setSessionID = () => {
    if (localStorage.getItem("sessionId")) {
      this.setState({
        sessionId: JSON.parse(localStorage.getItem("sessionId")),
      });
      return;
    }
    getSessionID()
      .then((data) => {
        if (data.status_code) {
          this.errorHendler(data);
          return;
        }
        this.setState({ sessionId: data.guest_session_id });
        localStorage.setItem(
          "sessionId",
          JSON.stringify(data.guest_session_id)
        );
      })
      .catch((e) => this.errorHendler(e));
  };

  update = (id) => {
    const movies = this.state.movies.filter((movie) => movie.id !== id);
    this.setState({ movies: movies });
  };

  componentDidMount() {
    this.setGenresByCodes();
    this.setSessionID();
  }

  render() {
    const {
      movies,
      totalResults,
      currentPage,
      tab,
      isLoading,
      error,
    } = this.state;

    return (
      <TmdbapiServiceProvider
        value={{
          searchByGenre: this.searchByGenre,
          genresByCodes: this.state.genresByCodes,
          sessionId: this.state.sessionId,
        }}
      >
        <Header tabToggle={this.tabToggle} />
        <SearchBar
          tab={tab}
          searchHandler={this.searchHandler}
          value={this.state.searchTerm}
        />
        <ErrorMessage error={error} />
        <Spinner isLoading={isLoading} />
        <MoviesList movies={movies} tab={tab} update={this.update} />
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
