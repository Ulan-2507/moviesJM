const useRatedLocalStorage = () => {
  const _ratedMovies = "ratedMovies";

  let ratedMovies = JSON.parse(localStorage.getItem(_ratedMovies)) || {};

  const setRatedMovies = (id, value) => {
    localStorage.setItem(
      _ratedMovies,
      JSON.stringify({
        ...JSON.parse(localStorage.getItem(_ratedMovies)),
        [id]: value,
      })
    );
  };

  const deleteRatedMovies = (id) => {
    const data = { ...JSON.parse(localStorage.getItem(_ratedMovies)) };
    delete data[id];
    localStorage.setItem(_ratedMovies, JSON.stringify(data));
  };

  return [ratedMovies, setRatedMovies, deleteRatedMovies];
};

export default useRatedLocalStorage;
