import React, { Component } from "react";
import "antd/dist/antd.css";
import { Spin } from "antd";
import { Alert } from "antd";
import { Pagination } from "antd";
import debounce from "lodash.debounce";
import MoviesList from "../movies-list";
const API_KEY = "8cb439222da4a8901afb40ed93e0947f"
const SEARCH_API =
  `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=`;
const GEUST_SESSION_API = `https://api.themoviedb.org/3/authentication/guest_session/new?api_key=${API_KEY}`;
// const ADD_MOVIE_API = `https://api.themoviedb.org/3/list/${this.state.list_id}/add_item?api_key=${API_KEY}&session_id=${this.state.sessionId}`;

export default class App extends Component {
  state = {
    movies: [],
    totalResults: 0,
    currentPage: 1,
    searchTerm: '',
    sessionId: null,
    listId: null,
    tab: 'Search',
    isLoading: false,
    isError: false,
    error: null,
  }
  
  getGuestSessionID = () => {
    fetch(GEUST_SESSION_API)
      .then(response => response.json())
      .then(data => {
        if (data.status_code) {
          this.setState({sessionId: null});
          this.errorHendler(data)
        } else {
          this.setState({sessionId: data.guest_session_id});
        }   
      })
      .catch(e => this.errorHendler(e))
  }
  getMovies = (API) => {
    fetch(API)
      .then(response => response.json())
      .then(data => {
        if (data.status_code) {
          this.setState({movies:[], totalResults: 0, isLoading: false});
          this.errorHendler(data)
        } else {
          this.setState({movies:data.results, totalResults: data.total_results, isLoading: false});
        }   
      })
      .catch(e => {
        this.errorHendler(e)
      })
  }
  errorHendler = (data) => {
    this.setState({isError: true, error: data})
  }
  onChangePage = (pageNumber) => {
    this.setState({currentPage: pageNumber});
    this.getMovies(SEARCH_API + `${this.state.searchTerm}&page=${pageNumber}`)
  }
  handleOnSearch = debounce((searchWord) => {
    if(searchWord) {
      this.getMovies(SEARCH_API + searchWord + `&page=1`);
      this.setState({currentPage: 1});
    }
  }, 400);
  handleOnChange = (e) => {
    if(e.target.value.length === 0) {
      this.setState({movies: [], totalResults: 0, isLoading: false})
      this.handleOnSearch(e.target.value);
    } else {
      this.handleOnSearch(e.target.value);
      this.setState({searchTerm: e.target.value, isLoading: true})
    }
  }
  tabToggle = (e) => {
    this.setState({tab: e.target.textContent})
    if(e.target.textContent === 'Rate') {
      this.getGuestList()
    }
  }
  componentDidMount() {
    this.getGuestSessionID();
  }
  render() {
    const {movies, totalResults, currentPage, tab, isLoading, isError, error } = this.state;
    const isSearchTab = tab === 'Search';
    const search = (isSearchTab && 
      <input
        className="search"
        type="search"
        placeholder="Type to search..."
        onChange={this.handleOnChange}
      />);
    const spin = (isLoading && 
      <div className="position-center">
        <Spin size="large" />
      </div>
    );
    const pagination = ((!isLoading && movies.length > 0) && 
      <div className="position-center">
        <Pagination
          size="small"
          total={totalResults}
          pageSize={20}
          pageSizeOptions={[20]}
          onChange={this.onChangePage}
          current={currentPage}
        />
      </div>
    );
    const errorMessag = ( isError &&
      <Alert
        message={error.status_message}
        type="error"
      />
    );
    return (
      <>
        <header className="header">
          <div className="toggle" onClick={this.tabToggle}>
            <button className={tab === 'Search' ? "button-active" : ''}>Search</button>
            <button className={tab === 'Rated' ? "button-active" : ''}>Rated</button>
          </div>
        </header>
        {search}
        {errorMessag}
        {spin}
        <MoviesList movies={movies}/>
        {pagination}
      </>
    );
  }
  
}



  