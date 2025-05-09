import { createAppSlice } from "../../app/createAppSlice"
import { createSelector } from "@reduxjs/toolkit"
import type { RootState } from "../../app/store"

interface Movie {
  imdbID: string
  Title: string
  Year: string
  Poster: string
  Genre?: string
  Plot?: string
  Runtime?: string
  imdbRating?: string
  title?: string
  releaseDate?: string
}

interface MovieState {
  favoritesByUser: {
    [userId: string]: Movie[]
  }
}

const initialState: MovieState = {
  favoritesByUser: JSON.parse(localStorage.getItem("favoritesByUser") || "{}"),
}

const movieSlice = createAppSlice({
  name: "movies",
  initialState,
  reducers: {
    addFavorite: (state, action) => {
      const { userId, movie } = action.payload
      if (!state.favoritesByUser[userId]) {
        state.favoritesByUser[userId] = []
      }
      if (!state.favoritesByUser[userId].some(m => m.imdbID === movie.imdbID)) {
        state.favoritesByUser[userId].push({
          imdbID: movie.imdbID,
          Title: movie.Title,
          Poster: movie.Poster,
          Year: movie.Year,
          Genre: movie.Genre || "",
          Plot: movie.Plot || "",
          Runtime: movie.Runtime || "",
          imdbRating: movie.imdbRating || "",
        })
        localStorage.setItem(
          "favoritesByUser",
          JSON.stringify(state.favoritesByUser),
        )
      }
    },
    removeFavorite: (state, action) => {
      const { userId, movieId } = action.payload
      if (state.favoritesByUser[userId]) {
        state.favoritesByUser[userId] = state.favoritesByUser[userId].filter(
          movie => movie.imdbID !== movieId,
        )
        localStorage.setItem(
          "favoritesByUser",
          JSON.stringify(state.favoritesByUser),
        )
      }
    },
  },
})

export const selectFavorites = createSelector(
  [
    (state: RootState) => state.auth.userId,
    (state: RootState) => state.movies.favoritesByUser,
  ],
  (userId, favoritesByUser) => {
    return userId ? favoritesByUser[userId] || [] : []
  },
)

export const { addFavorite, removeFavorite } = movieSlice.actions
export default movieSlice
