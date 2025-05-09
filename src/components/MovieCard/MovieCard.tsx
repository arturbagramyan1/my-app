import { Card, Button, Typography } from "antd"
import { HeartOutlined, HeartFilled } from "@ant-design/icons"
import "./MovieCard.css"

const { Meta } = Card
const { Text } = Typography

export type Movie = {
  imdbID: string
  Poster: string
  Title: string
  Year?: string
  releaseDate?: string
  Genre?: string
  Plot?: string
  Runtime?: string
  imdbRating?: string
}

interface MovieCardProps {
  movie: Movie
  onClick: () => void
  onFavoriteToggle?: () => void
  isFavorite?: boolean
  onRemove?: () => void
  showRemoveOnly?: boolean
}

const MovieCard = ({
  movie,
  onClick,
  onFavoriteToggle,
  isFavorite,
  onRemove,
  showRemoveOnly,
}: MovieCardProps) => {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (showRemoveOnly && onRemove) {
      onRemove()
    } else if (onFavoriteToggle) {
      onFavoriteToggle()
    }
  }

  return (
    <Card
      className="movie-card"
      hoverable
      cover={
        <div>
          <img
            alt={movie.Title}
            src={
              movie.Poster && movie.Poster !== "N/A"
                ? movie.Poster
                : "https://via.placeholder.com/300x450?text=No+Image"
            }
          />
          {movie.imdbRating && (
            <div className="movie-rating">
              ⭐ {movie.imdbRating}
            </div>
          )}
        </div>
      }
      onClick={onClick}
      actions={[
        <Button
          key="favorite"
          type="text"
          icon={
            showRemoveOnly ? (
              <HeartFilled style={{ color: "#ff4d4f" }} />
            ) : isFavorite ? (
              <HeartFilled style={{ color: "#ff4d4f" }} />
            ) : (
              <HeartOutlined />
            )
          }
          onClick={handleFavoriteClick}
        >
          {showRemoveOnly
            ? "Remove"
            : isFavorite
              ? "Remove"
              : "Add to Favorites"}
        </Button>,
      ]}
    >
      <Meta
        title={movie.Title}
        description={
          <>
            <Text>{movie.Year}</Text>
            {movie.Genre && (
              <Text type="secondary"> • {movie.Genre.split(",")[0]}</Text>
            )}
          </>
        }
      />
    </Card>
  )
}

export default MovieCard
