import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import {
  Typography,
  Spin,
  Alert,
  Space,
  Tag,
  Button,
  Descriptions,
  Card,
} from "antd"
import {
  HeartOutlined,
  HeartFilled,
  StarFilled,
  PlayCircleOutlined,
} from "@ant-design/icons"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import {
  addFavorite,
  removeFavorite,
  selectFavorites,
} from "../features/movies/movieSlice"
import "./MovieDetails.css"
import { OMDB_API_KEY } from "../api/constants"
const { Title, Paragraph } = Typography

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>()
  const [movie, setMovie] = useState<any>(null)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  const dispatch = useAppDispatch()
  const userId = useAppSelector(state => state.auth.userId)
  const favorites = useAppSelector(selectFavorites)

  const isFavorite = (id: string) =>
    favorites.some(movie => movie.imdbID === id)

  const handleFavoriteToggle = (movie: any) => {
    if (!userId) return

    const movieData = {
      ...movie,
      Runtime: movie.Runtime || "",
      imdbRating: movie.imdbRating || "",
      Genre: movie.Genre || "",
      Plot: movie.Plot || "",
    }

    if (isFavorite(movie.imdbID)) {
      dispatch(removeFavorite({ userId, movieId: movie.imdbID }))
    } else {
      dispatch(addFavorite({ userId, movie: movieData }))
    }
  }

  useEffect(() => {
    const fetchMovie = async () => {
      setIsLoading(true)
      try {
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${id}&plot=full`,
        )
        const data = await res.json()
        if (data.Response === "True") {
          setMovie(data)
          setError("")
        } else {
          setError(data.Error || "Movie not found.")
        }
      } catch {
        setError("Failed to fetch movie details.")
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchMovie()
    }
  }, [id])

  if (isLoading) {
    return (
      <div className="movie-details-loading">
        <Spin size="large" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert message={error} type="error" className="movie-details-alert" />
    )
  }

  if (!movie) return null

  return (
    <div className="movie-details-container">
      <div className="movie-details-content">
        <div className="movie-details-poster">
          <img
            src={
              movie.Poster !== "N/A"
                ? movie.Poster
                : "https://via.placeholder.com/300x450?text=No+Image"
            }
            alt={movie.Title}
          />
          <Space direction="vertical" style={{ width: "100%" }}>
            <Button
              type={isFavorite(movie.imdbID) ? "primary" : "default"}
              icon={
                isFavorite(movie.imdbID) ? <HeartFilled /> : <HeartOutlined />
              }
              onClick={() => handleFavoriteToggle(movie)}
              size="large"
              className="movie-details-favorite-button"
              block
            >
              {isFavorite(movie.imdbID)
                ? "Remove from Favorites"
                : "Add to Favorites"}
            </Button>

            <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              size="large"
              block
              href={`https://hdrezka.me/search/?do=search&subaction=search&q=${movie.Title}`}
              target="_blank"
              className="movie-details-watch-button"
              style={{ backgroundColor: "#52c41a" }}
            >
              Watch Movie
            </Button>
          </Space>
        </div>

        <div className="movie-details-info">
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <Title level={2} className="movie-details-title">
              {movie.Title} ({movie.Year})
            </Title>

            <Space wrap>
              {movie.Genre?.split(",").map((genre: string) => (
                <Tag key={genre} color="blue">
                  {genre.trim()}
                </Tag>
              ))}
            </Space>

            {movie.imdbRating && (
              <Space>
                <StarFilled style={{ color: "#fadb14" }} />
                <span style={{ fontSize: 16 }}>{movie.imdbRating}/10</span>
              </Space>
            )}

            <Descriptions column={1} bordered>
              {movie.Director && (
                <Descriptions.Item label="Director">
                  {movie.Director}
                </Descriptions.Item>
              )}
              {movie.Runtime && (
                <Descriptions.Item label="Runtime">
                  {movie.Runtime}
                </Descriptions.Item>
              )}
              {movie.Released && (
                <Descriptions.Item label="Released">
                  {movie.Released}
                </Descriptions.Item>
              )}
              {movie.Writer && (
                <Descriptions.Item label="Writer">
                  {movie.Writer}
                </Descriptions.Item>
              )}
              {movie.Actors && (
                <Descriptions.Item label="Actors">
                  {movie.Actors}
                </Descriptions.Item>
              )}
            </Descriptions>

            {movie.Plot && (
              <Card title="Plot" bordered={false}>
                <Paragraph className="movie-details-plot">
                  {movie.Plot}
                </Paragraph>
              </Card>
            )}
          </Space>
        </div>
      </div>
    </div>
  )
}

export default MovieDetails
