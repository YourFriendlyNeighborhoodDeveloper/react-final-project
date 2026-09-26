import { useEffect, useMemo, useState } from "react";
import MovieCard from "../components/MovieCard";

const API_KEY = process.env.REACT_APP_OMDB_API_KEY;
const API_URL = "https://www.omdbapi.com/";

function Home() {
  const [search, setSearch] = useState("");
  const [currentSearch, setCurrentSearch] = useState("Batman");
  const [movies, setMovies] = useState([]);
  const [sort, setSort] = useState("default");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function getMovies() {
      setLoading(true);
      setError("");

      try {
        const url = `${API_URL}?apikey=${API_KEY}&s=${encodeURIComponent(
          currentSearch
        )}`;

        const response = await fetch(url, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("The movie service is unavailable right now.");
        }

        const data = await response.json();

        if (data.Response === "False") {
          setMovies([]);
          setError(data.Error || "No movies found.");
          return;
        }

        setMovies(data.Search || []);
      } catch (err) {
        if (err.name !== "AbortError") {
          setMovies([]);
          setError("Something went wrong while searching for movies.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    getMovies();

    return () => controller.abort();
  }, [currentSearch]);

  const sortedMovies = useMemo(() => {
    if (sort === "default") {
      return movies;
    }

    const copy = [...movies];

    if (sort === "newest") {
      return copy.sort((a, b) => getYear(b.Year) - getYear(a.Year));
    }

    if (sort === "oldest") {
      return copy.sort((a, b) => getYear(a.Year) - getYear(b.Year));
    }

    return copy;
  }, [movies, sort]);

  function getYear(value) {
    const year = parseInt(value, 10);
    return Number.isNaN(year) ? 0 : year;
  }

  function handleSubmit(event) {
    event.preventDefault();

    const term = search.trim();

    if (!term) {
      return;
    }

    setCurrentSearch(term);
  }

  return (
    <section className="home">
      <div className="hero">
        <p className="eyebrow">Find something worth watching</p>
        <h1>Search movies without scrolling through fifty streaming apps.</h1>

        <form className="search-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={search}
            placeholder="Search by movie title"
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Movie title"
          />

          <button type="submit">Search</button>
        </form>
      </div>

      <div className="results-header">
        <div>
          <p className="results-label">Results for</p>
          <h2>{currentSearch}</h2>
        </div>

        <select
          value={sort}
          onChange={(event) => setSort(event.target.value)}
          aria-label="Sort movies"
        >
          <option value="default">Sort movies</option>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </div>

      {loading && <div className="status">Searching movies...</div>}

      {!loading && error && <div className="status error">{error}</div>}

      {!loading && !error && (
        <div className="movie-grid">
          {sortedMovies.map((movie) => (
            <MovieCard key={movie.imdbID} movie={movie} />
          ))}
        </div>
      )}
    </section>
  );
}

export default Home;