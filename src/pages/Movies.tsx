import { useState, useEffect, useCallback } from "react"
import { Typography, Layout, Input, Row, Col, Alert, Spin, Card } from "antd"
import { SearchOutlined } from "@ant-design/icons"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import {
  selectFavorites,
  addFavorite,
  removeFavorite,
} from "../features/movies/movieSlice"
import MovieCard from "../components/MovieCard/MovieCard"
import { useNavigate } from "react-router-dom"
import { OMDB_API_KEY } from "../api/constants"
import "./Movies.css"

const { Title, Paragraph } = Typography
const { Content } = Layout

export interface Movie {
  imdbID: string
  Title: string
  Year: string
  Poster: string
  Genre?: string
  Plot?: string
  Director?: string
  Runtime?: string
  imdbRating?: string
}

const Movies = () => {
  const [search, setSearch] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [movies, setMovies] = useState<Movie[]>([])
  const [error, setError] = useState("")

  const dispatch = useAppDispatch()
  const userId = useAppSelector(state => state.auth.userId)
  const favorites = useAppSelector(selectFavorites)
  const navigate = useNavigate()

  const fetchMovies = async (query: string) => {
    setIsSearching(true)
    setError("")
    try {
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${query}`,
      )
      const data = await res.json()

      if (data.Response === "True") {
        const detailedMovies = await Promise.all(
          data.Search.map(async (movie: any) => {
            const detailRes = await fetch(
              `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${movie.imdbID}&plot=short`,
            )
            return detailRes.json()
          }),
        )
        setMovies(detailedMovies)
      } else {
        setError(data.Error || "No movies found")
        setMovies([])
      }
    } catch (err) {
      setError("Failed to fetch movies")
      setMovies([])
    } finally {
      setIsSearching(false)
    }
  }

  const fetchInitialMovies = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=movie&type=movie&y=2024`,
      )
      const data = await res.json()

      if (data.Response === "True") {
        const detailedMovies = await Promise.all(
          data.Search.map(async (movie: any) => {
            const detailRes = await fetch(
              `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${movie.imdbID}&plot=short`,
            )
            return detailRes.json()
          }),
        )
        setMovies(detailedMovies)
      }
    } catch (err) {
      setError("Failed to fetch movies")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchInitialMovies()
  }, [fetchInitialMovies])

  useEffect(() => {
    if (search.trim().length === 0) {
      fetchInitialMovies()
      return
    }

    const searchTimeout = setTimeout(() => {
      fetchMovies(search)
    }, 700)

    return () => clearTimeout(searchTimeout)
  }, [search, fetchInitialMovies])

  const isFavorite = (id: string) =>
    favorites.some(movie => movie.imdbID === id)

  const handleFavoriteToggle = (movie: Movie) => {
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

  return (
    <Content className="movies-container">
      <Card className="movies-header">
        <Title level={2} className="movies-section-title">
          Discover Movies
        </Title>
        <Paragraph style={{ textAlign: "center", marginBottom: 24 }}>
          Search for your favorite movies or explore our collection
        </Paragraph>
        <Input.Search
          className="movies-search"
          placeholder="Search movies by title..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          size="large"
          prefix={<SearchOutlined />}
          loading={isSearching}
        />
      </Card>

      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          className="movies-alert"
        />
      )}

      {isLoading || isSearching ? (
        <div className="movies-loading">
          <Spin size="large" tip="Loading movies..." />
        </div>
      ) : (
        <div className="movies-grid">
          <Row gutter={[24, 24]}>
            {movies.map(movie => (
              <Col xs={24} sm={12} md={8} lg={6} key={movie.imdbID}>
                <MovieCard
                  movie={movie}
                  onClick={() => handleCardClick(movie.imdbID)}
                  onFavoriteToggle={() => handleFavoriteToggle(movie)}
                  isFavorite={isFavorite(movie.imdbID)}
                />
              </Col>
            ))}
          </Row>
        </div>
      )}
    </Content>
  )
}

export default Movies
