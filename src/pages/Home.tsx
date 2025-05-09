import { Typography, Button, Row, Col, Carousel, Spin } from "antd"
import { Link, useNavigate } from "react-router-dom"
import {
  SearchOutlined,
  HeartOutlined,
  StarOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons"
import { useState, useEffect } from "react"
import { OMDB_API_KEY } from "../api/constants"
import MovieCard from "../components/MovieCard/MovieCard"
import { useAppSelector, useAppDispatch } from "../app/hooks"
import {
  addFavorite,
  removeFavorite,
  selectFavorites,
} from "../features/movies/movieSlice"
import "./Home.css"

const { Title, Paragraph } = Typography

const features = [
  {
    icon: <SearchOutlined className="feature-icon" />,
    title: "Discover Movies",
    description:
      "Search and explore a vast collection of movies from around the world.",
  },
  {
    icon: <HeartOutlined className="feature-icon" />,
    title: "Save Favorites",
    description:
      "Create your personal collection by saving your favorite movies.",
  },
  {
    icon: <StarOutlined className="feature-icon" />,
    title: "Rate & Review",
    description: "Share your thoughts and see what others think about movies.",
  },
  {
    icon: <ThunderboltOutlined className="feature-icon" />,
    title: "Real-time Updates",
    description:
      "Stay updated with the latest movie releases and trending titles.",
  },
]

const Home = () => {
  const [topMovies, setTopMovies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const userId = useAppSelector(state => state.auth.userId)
  const favorites = useAppSelector(selectFavorites)

  useEffect(() => {
    const fetchTopMovies = async () => {
      setLoading(true)
      try {
        // Fetch movies from multiple pages
        const allMovies = []
        for (let page = 1; page <= 3; page++) {
          // Fetch 3 pages (30 movies total)
          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=movie&type=movie&y=2022&page=${page}`,
          )
          const data = await res.json()

          if (data.Response === "True") {
            allMovies.push(...data.Search)
          }
        }

        // Get detailed info for all movies
        const detailedMovies = await Promise.all(
          allMovies.map(async (movie: any) => {
            const detailRes = await fetch(
              `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${movie.imdbID}`,
            )
            return detailRes.json()
          }),
        )
        setTopMovies(detailedMovies)
      } catch (error) {
        console.error("Error fetching movies:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTopMovies()
  }, [])

  const isFavorite = (id: string) =>
    favorites.some(movie => movie.imdbID === id)

  const handleFavoriteToggle = (movie: any) => {
    if (!userId) return

    if (isFavorite(movie.imdbID)) {
      dispatch(removeFavorite({ userId, movieId: movie.imdbID }))
    } else {
      dispatch(addFavorite({ userId, movie }))
    }
  }

  const handleCardClick = (id: string) => {
    navigate(`/movies/${id}`)
  }

  const renderMovieSlides = () => {
    const slides = []
    for (let i = 0; i < topMovies.length; i += 4) {
      slides.push(
        <div key={i} className="movie-slide">
          <Row gutter={[16, 16]}>
            {topMovies.slice(i, i + 4).map((movie: any) => (
              <Col xs={24} sm={12} md={6} key={movie.imdbID}>
                <MovieCard
                  movie={movie}
                  onClick={() => handleCardClick(movie.imdbID)}
                  onFavoriteToggle={() => handleFavoriteToggle(movie)}
                  isFavorite={isFavorite(movie.imdbID)}
                  showRemoveOnly={false}
                />
              </Col>
            ))}
          </Row>
        </div>,
      )
    }
    return slides
  }

  return (
    <div className="home-container">
      <div className="home-hero">
        <Title className="home-title">🎬 Welcome to MovieApp</Title>
        <Paragraph className="home-subtitle">
          Your personal movie companion. Discover, collect, and explore the
          world of cinema.
        </Paragraph>

        <div className="cta-buttons">
          <Link to="/movies">
            <Button type="primary" size="large">
              Browse Movies
            </Button>
          </Link>
        </div>
      </div>

      <div className="trending-section">
        <Title level={2} className="section-title">
          Trending Movies
        </Title>
        {loading ? (
          <div className="loading-container">
            <Spin size="large" />
          </div>
        ) : (
          <Carousel autoplay className="movie-carousel">
            {renderMovieSlides()}
          </Carousel>
        )}
      </div>

      <Row className="feature-grid">
        {features.map((feature, index) => (
          <Col xs={24} sm={12} xl={6} key={index}>
            <div className="feature-card">
              {feature.icon}
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default Home
