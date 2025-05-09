import { Typography, Row, Col, Button } from "antd"
import { HeartOutlined } from "@ant-design/icons"
import { useAppSelector, useAppDispatch } from "../app/hooks"
import { removeFavorite, selectFavorites } from "../features/movies/movieSlice"
import MovieCard from "../components/MovieCard/MovieCard"
import { useNavigate } from "react-router-dom"
import "./Favorites.css"

const { Title, Paragraph } = Typography

const Favorites = () => {
  const dispatch = useAppDispatch()
  const userId = useAppSelector(state => state.auth.userId)
  const favorites = useAppSelector(selectFavorites)
  const navigate = useNavigate()

  const handleRemove = (id: string) => {
    if (!userId) return
    dispatch(removeFavorite({ userId, movieId: id }))
  }

  const handleCardClick = (id: string) => {
    navigate(`/movies/${id}`)
  }

  if (favorites.length === 0) {
    return (
      <div className="favorites-container">
        <div className="favorites-content">
          <div className="favorites-empty">
            <HeartOutlined className="favorites-empty-icon" />
            <Title level={3} className="favorites-empty-title">
              No Favorites Yet
            </Title>
            <Paragraph className="favorites-empty-text">
              Start exploring movies and add them to your favorites collection.
            </Paragraph>
            <Button
              type="primary"
              size="large"
              onClick={() => navigate("/movies")}
            >
              Explore Movies
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="favorites-container">
      <div className="favorites-content">
        <div className="favorites-header">
          <Title level={2} className="favorites-title">
            Your Favorites Collection
          </Title>
          <Paragraph className="favorites-subtitle">
            Here are the movies you've saved. Click on any movie to view more
            details.
          </Paragraph>
        </div>

        <Row gutter={[24, 24]} className="favorites-grid">
          {favorites.map(movie => (
            <Col xs={24} sm={12} md={8} lg={6} xl={6} key={movie.imdbID}>
              <div className="movie-card-wrapper">
                <MovieCard
                  movie={movie}
                  onClick={() => handleCardClick(movie.imdbID)}
                  onRemove={() => handleRemove(movie.imdbID)}
                  isFavorite={true}
                  showRemoveOnly={true}
                />
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  )
}

export default Favorites
