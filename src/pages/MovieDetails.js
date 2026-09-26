import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const API_KEY = process.env.REACT_APP_OMDB_API_KEY;
const API_URL = "https://www.omdbapi.com/";

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function getMovie() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `${API_URL}?apikey=${API_KEY}&i=${encodeURIComponent(id)}&plot=full`,
          {
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error("Movie request failed.");
        }

        const data = await response.json();

        if (data.Response === "False") {
          setError(data.Error || "Movie not found.");
          return;
        }

        setMovie(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError("Could not load this movie.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    getMovie();

    return () => controller.abort();
  }, [id]);

  if (loading) {
    return <div className="status details-status">Loading movie...</div>;
  }

  if (error) {
    return (
      <section className="details-message">
        <p>{error}</p>
        <Link to="/" className="back-button">
          Back to movies
        </Link>
      </section>
    );
  }

  if (!movie) {
    return null;
  }

  const poster =
    movie.Poster && movie.Poster !== "N/A"
      ? movie.Poster
      : "https://placehold.co/400x600?text=No+Poster";

  return (
    <section className="movie-details">
      <Link to="/" className="back-link">
        ← Back to search
      </Link>

      <div className="details-layout">
        <div className="details-poster">
          <img src={poster} alt={`${movie.Title} poster`} />
        </div>

        <div className="details-copy">
          <div className="details-heading">
            <p className="eyebrow">
              {movie.Type} · {movie.Year}
            </p>
            <h1>{movie.Title}</h1>
            <p className="details-subtitle">
              {movie.Rated} · {movie.Runtime} · {movie.Genre}
            </p>
          </div>

          <p className="plot">{movie.Plot}</p>

          <div className="detail-list">
            <div>
              <span>Director</span>
              <p>{movie.Director}</p>
            </div>

            <div>
              <span>Cast</span>
              <p>{movie.Actors}</p>
            </div>

            <div>
              <span>Writer</span>
              <p>{movie.Writer}</p>
            </div>

            <div>
              <span>Released</span>
              <p>{movie.Released}</p>
            </div>
          </div>

          <div className="ratings">
            {movie.imdbRating !== "N/A" && (
              <div className="rating-box">
                <span>IMDb</span>
                <strong>{movie.imdbRating}/10</strong>
              </div>
            )}

            {movie.Metascore !== "N/A" && (
              <div className="rating-box">
                <span>Metascore</span>
                <strong>{movie.Metascore}</strong>
              </div>
            )}

            {movie.BoxOffice && movie.BoxOffice !== "N/A" && (
              <div className="rating-box">
                <span>Box Office</span>
                <strong>{movie.BoxOffice}</strong>
              </div>
            )}
          </div>

          {movie.Ratings?.length > 0 && (
            <div className="rating-sources">
              {movie.Ratings.map((rating) => (
                <div key={rating.Source}>
                  <span>{rating.Source}</span>
                  <strong>{rating.Value}</strong>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default MovieDetails;


