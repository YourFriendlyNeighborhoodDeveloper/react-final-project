import { Link } from "react-router-dom";

function MovieCard({ movie }) {
  const poster =
    movie.Poster && movie.Poster !== "N/A"
      ? movie.Poster
      : "https://placehold.co/300x450?text=No+Poster";

  return (
    <Link to={`/movie/${movie.imdbID}`} className="movie-card">
      <img src={poster} alt={`${movie.Title} poster`} />

      <div className="movie-card-info">
        <h2>{movie.Title}</h2>

        <div className="movie-meta">
          <span>{movie.Year}</span>
          <span>{movie.Type}</span>
        </div>
      </div>
    </Link>
  );
}

export default MovieCard;