import Head from "next/head";
import Image from "next/image";
import { useState } from "react";

interface Movie {
  Title: string;
  imdbID: string;
  Poster: string;
  Type: string;
  Year: string;
}

interface MovieDetails extends Movie {
  Plot: string;
}

// TODO
// utiliser des state pour controler la recherhcer

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [search, setSearch] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<MovieDetails | null>(null);
  const [total, setTotal] = useState(0);
  const [called, setCalled] = useState(false);

  const fetchMovies = async () => {
    setLoading(true);

    const resMovies = await fetch(
      `https://www.omdbapi.com/?apikey=${process.env.NEXT_PUBLIC_FILM_KEY}&s=${search}`
    ).then((res) => res.json());

    console.log("resMovies", resMovies);

    setSearch("");
    setMovies(resMovies.Search || []);
    setTotal(Number(resMovies.totalResults || 0));
    setLoading(false);
    setCalled(true);
  };

  const closeMoreInfoDiv = () => setSelectedMovie(null);

  const getMoreInfo = async (movie: Movie) => {
    const resMoviePlot: MovieDetails = await fetch(
      `https://www.omdbapi.com/?apikey=${process.env.NEXT_PUBLIC_FILM_KEY}&i=${movie.imdbID}&plot=full`
    ).then((res) => res.json());
    console.log(resMoviePlot);

    setSelectedMovie(resMoviePlot);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="text-orange-400 w-full text-left px-12 py-4 text-3xl font-black animate-pulse">
        MyFilmSearch
      </h1>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <div className="w-full">
          <input
            className="border border-slate-300 p-4 rounded-lg my-8 mr-8"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Votre recherche"
          />
          <button
            onClick={fetchMovies}
            disabled={loading}
            className="p-4 rounded-lg bg-orange-400 text-white hover:animate-pulse"
          >
            Rechercher
          </button>
        </div>
        {loading && <div>Chargement en cours... 🔥 </div>}
        {called && <div>Nombre de résultats: {total}</div>}
        {selectedMovie && (
          <div
            id={selectedMovie.imdbID}
            className="fixed bg-white w-[80vw] border border-slate-100 rounded-lg flex z-50 left-[9.5%] top-[25%] p-4"
          >
            <div className="w-[200px] h-[300px] relative p-4">
              <Image
                src={selectedMovie.Poster}
                alt={`Affiche ${selectedMovie.Title}`}
                layout="fill"
              />
            </div>

            <div className="text-left px-12 py-4 w-full">
              <div className="w-full flex justify-end">
                <button
                  className="p-2 rounded-lg bg-orange-300 hover:bg-orange-400 text-white px-4 "
                  onClick={closeMoreInfoDiv}
                >
                  X
                </button>
              </div>

              <h2 className="uppercase font-bold text-orange-400 my-2">
                {selectedMovie.Title}
              </h2>
              <p>
                Type de média : {selectedMovie.Type}
                <br />
                Année de sortie : {selectedMovie.Year}
                <br />
                Synopsis : {selectedMovie.Plot}
              </p>
            </div>
          </div>
        )}

        {!!movies.length ? (
          <ul className="flex flex-col w-[80vw] my-8">
            {movies.map((movie) => (
              <li
                key={movie.imdbID}
                className="flex my-2 p-4 border border-slate-100 rounded-lg hover:shadow-md hover:bg-white relative"
                data-aos="fade-up"
                data-aos-anchor-placement="top-bottom"
              >
                <div className="w-[100px] h-[150px] relative">
                  <Image
                    src={movie.Poster}
                    alt={`Affiche ${movie.Title}`}
                    layout="fill"
                  />
                </div>

                <div className="flex flex-col justify-between w-full">
                  <div className="mx-4 text-left">
                    <h2 className="uppercase font-bold text-orange-400">
                      {movie.Title}
                    </h2>
                    <p>
                      Année de sortie : {movie.Year}
                      <br />
                      Type de média : {movie.Type}
                    </p>
                  </div>
                  <div className="flex justify-end w-full">
                    <button
                      className="p-2 rounded-lg bg-orange-300 hover:bg-orange-400 text-white"
                      onClick={() => getMoreInfo(movie)}
                    >
                      En savoir plus
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          called && (
            <p className="error-title max-w-[400px]">
              Désolé, nous n'avons malheureusement pas trouvé de résultat à
              votre recherche 🥺
            </p>
          )
        )}
      </main>

      <footer className="flex flex-col items-center justify-center w-full h-24 border-t">
        <p>Retrouvez mon gitHub</p>
        <a href="https://github.com/ophelie-gaudin">ICI ! </a>
      </footer>
    </div>
  );
}
