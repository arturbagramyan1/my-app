import { createAppSlice } from "../../app/createAppSlice"

interface Movie {
  id: number
  title: string
  description: string
  releaseDate: string
}

interface MovieState {
  favorites: Movie[]
}

const initialState: MovieState = {
  favorites: JSON.parse(localStorage.getItem("favorites") || "[]"),
}

const movieSlice = createAppSlice({
  name: "movies",
  initialState,
  reducers: {
    addFavorite: (state, action) => {
      state.favorites.push(action.payload)
      localStorage.setItem("favorites", JSON.stringify(state.favorites))
    },
    removeFavorite: (state, action) => {
      state.favorites = state.favorites.filter(
        movie => movie.id !== action.payload,
        localStorage.setItem("favorites", JSON.stringify(state.favorites)),
      )
    },
  },
})

export const { addFavorite, removeFavorite } = movieSlice.actions
export default movieSlice
