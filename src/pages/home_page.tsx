import { HiMiniPlusCircle, HiArrowPath, HiCheckCircle } from "react-icons/hi2";
import React, { useState, useRef, useEffect } from "react";
import ConfettiExplosion, { ConfettiProps } from "react-confetti-explosion";

const initialWordList = [
  "maman",
  "la pomme",
  "un",
  "une",
  "sur",
  "et",
  "un épi",
  "la tomate",
  "la lune",
  "un vélo",
  "la tête",
  "le père",
  "le bébé",
  "la souris",
  "la carotte",
  "le radis",
  "le judo",
];

// TODO : onfocus sur letter => focus sur dernier input

const res = {
  NO_RESULT: "",
  WIN: "win",
  LOOSE: "loose",
};

const initialGameState: GameState = {
  ids: [0],
  letters: [],
  inputRefs: [],
  result: res.NO_RESULT,
};

type AppState = {
  wordlist: string[];
  wordToGuess: string;
  gameCount: number;
  score: number;
};

const synth = window.speechSynthesis;
const utterThis = new SpeechSynthesisUtterance();
utterThis.lang = "fr-FR";

export default function HomePage() {
  const [appState, setAppState] = useState<AppState>({
    wordlist: initialWordList,
    wordToGuess:
      initialWordList[Math.floor(Math.random() * initialWordList.length)],
    gameCount: 0,
    score: 0,
  });

  const handleNewGame = () => {
    const newWordToGuess =
      initialWordList[Math.floor(Math.random() * initialWordList.length)];
    setAppState({ ...appState, wordToGuess: newWordToGuess });
  };

  const incScore = (inc: 0 | 1) => {
    setAppState({
      ...appState,
      gameCount: appState.gameCount + 1,
      score: appState.score + inc,
    });
  };

  // useEffect(() => {
  //   handleNewGame()
  // }, []);

  return (
    <Game
      wordToGuess={appState.wordToGuess}
      handleNewGame={handleNewGame}
      gameCount={appState.gameCount}
      score={appState.score}
      incScore={incScore}
    />
  );
}

type GameState = {
  ids: number[];
  letters: string[];
  inputRefs: any[];
  result: string;
};

type GameProps = {
  wordToGuess: string;
  handleNewGame: () => void;
  score: number;
  gameCount: number;
  incScore: (inc: 0 | 1) => void;
};

const explodingProps: ConfettiProps = {
  force: 0.5,
  duration: 3000,
  particleCount: 100,
  width: 1000,
  colors: ["#9A0023", "#FF003C", "#AF739B", "#FAC7F3", "#F7DBF4"],
};

function Game(props: GameProps) {
  const textInputs = useRef<any>(null);
  const repeatBtn = useRef<HTMLButtonElement>(null);
  const [isExploding, setIsExploding] = useState(false);

  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [mustSpeak, setMustSpeak] = useState<boolean>(true);

  const handleInputLetter = (id: number, ref: any, letter: string) => {
    const ids_cp = gameState.ids.slice();
    ids_cp[id + 1] = id + 1;

    const letters_cp = gameState.letters.slice();
    letters_cp[id] = letter;

    const inputRefs_cp = gameState.inputRefs.slice();
    inputRefs_cp[id] = ref;

    setGameState({
      ...gameState,
      ids: ids_cp,
      letters: letters_cp,
      inputRefs: inputRefs_cp,
    });
  };

  const handleDeleteLetter = () => {
    if (gameState.ids.length > 1) {
      const ids_cp = gameState.ids.slice();
      ids_cp.pop();

      const letters_cp = gameState.letters.slice();
      letters_cp.pop();

      const inputRefs_cp = gameState.inputRefs.slice();
      inputRefs_cp.pop();

      setGameState({
        ...gameState,
        ids: ids_cp,
        letters: letters_cp,
        inputRefs: inputRefs_cp,
      });
    }
  };

  const speechHandler = () => {
    let a = "le mot";
    if (
      props.wordToGuess.trim().includes(" ") ||
      props.wordToGuess.includes("'")
    ) {
      a = "les mots";
    }
    speech("écris " + a + " :" + props.wordToGuess);
    focusLastInput();
  };

  const speech = (str: string) => {
    utterThis.text = str;

    synth.speak(utterThis);
  };

  const submitWord = () => {
    if (
      props.wordToGuess.toUpperCase() ===
      gameState.letters.join("").toUpperCase()
    ) {
      setGameState({ ...gameState, result: res.WIN });
      setIsExploding(true);
      props.incScore(1);
      speech("Bien joué!");
    } else {
      setGameState({ ...gameState, result: res.LOOSE });
      props.incScore(0);
      speech("Cela ne s'écrit pas comme ça!");
    }
    focusLastInput();
  };

  const focusLastInput = () => {
    textInputs?.current?.lastChild?.focus();
  };

  const reloadGame = () => {
    setGameState(initialGameState);
    props.handleNewGame();
    setMustSpeak(true);
  };

  useEffect(() => {
    focusLastInput();
    if (textInputs !== null) {
      textInputs.current.lastChild.value = "";
    }
    if (mustSpeak) {
      setTimeout(speechHandler, 300);
      setMustSpeak(false);
    }
  });

  useEffect(() => {
    console.log("first render");
  }, []);

  return (
    <div className="App text-center">
      <h1 className="mb-4 text-5xl font-extrabold text-purple-950 dark:text-white sm:text-6xl md:text-6xl lg:text-7xl">
        J'écris{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r to-purple-950 from-sky-400">
          mes mots !
        </span>
      </h1>
      <hr />
      <br />
      <br />
      <button
        ref={repeatBtn}
        className="inline-flex items-center px-6 py-2.5 bg-slate-400 text-white font-medium text-xl leading-tight uppercase rounded shadow-md hover:bg-slate-400 hover:shadow-lg focus:bg-slate-400 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-slate-400 active:shadow-lg transition duration-150 ease-in-out"
        onClick={() => speechHandler()}
      >
        <HiArrowPath className="mr-2" /> Répète les mots
      </button>
      <br />
      <br />
      <div ref={textInputs}>
        {gameState.ids.map((id: number) => {
          return (
            <LetterInput
              id={id}
              key={id}
              handleInputLetter={handleInputLetter}
              focusLastInput={focusLastInput}
              handleDeleteLetter={handleDeleteLetter}
            />
          );
        })}
      </div>
      {gameState.result === res.LOOSE ? (
        <div>
          <Answer word={props.wordToGuess} />
          <div className="text-3xl font-bold text-pink-800 py-10">
            Non non, ce n'est pas ça 😐
          </div>
        </div>
      ) : (
        ""
      )}
      {gameState.result === res.WIN ? (
        <div className="text-3xl font-bold text-purple py-10 ">
          Bien joué! 😊
          <div className="flex items-center justify-center">
            {isExploding && <ConfettiExplosion {...explodingProps} />}
          </div>
        </div>
      ) : (
        ""
      )}
      {gameState.result !== res.NO_RESULT ? (
        <button
          className="inline-flex items-center px-6 py-2.5 bg-purple-950 text-white font-medium text-xl leading-tight uppercase rounded shadow-md hover:bg-purple-950 hover:shadow-lg focus:bg-purple-950 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-purple-950 active:shadow-lg transition duration-150 ease-in-out"
          onClick={reloadGame}
        >
          <HiMiniPlusCircle className="mr-2" /> Nouveaux mots
        </button>
      ) : (
        ""
      )}
      {gameState.result == res.NO_RESULT ? (
        <div>
          <br />
          <button
            className="inline-flex items-center px-6 py-2.5 bg-purple-950 text-white font-medium text-xl leading-tight uppercase rounded shadow-md hover:bg-purple-950 hover:shadow-lg focus:bg-purple-950 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-purple-950 active:shadow-lg transition duration-150 ease-in-out"
            onClick={() => submitWord()}
          >
            <HiCheckCircle className="mr-2" /> Vérifie les mots
          </button>
        </div>
      ) : (
        ""
      )}
      <br />
      <br />
      <hr />
      <br />
      <div className="mt-4 text-gray-500 dark:text-gray-400">
        Nombre de bonnes réponses : {props.score}{" "}
        {props.gameCount === 0 ? "" : `/ ${props.gameCount}`}
      </div>
    </div>
  );
}

type LetterInputProps = {
  id: number;
  key: number;
  handleInputLetter: (id: number, ref: any, letter: string) => void;
  handleDeleteLetter: () => void;
  focusLastInput: () => void;
};

function LetterInput(props: LetterInputProps) {
  const [letter, setLetter] = useState("");

  const textInput: React.MutableRefObject<null> = useRef(null);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Backspace") {
      console.log("Backspace key pressed");
      props.handleDeleteLetter();
    }
    if (event.key === "Delete") {
      console.log("Delete key pressed");
      props.handleDeleteLetter();
    }
  };

  const regex = new RegExp("[a-zàâçéèêëîïôûùüÿñæœ ']", "i");

  const handleChangeValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    const letter = event.target.value;
    if (regex.test(letter)) {
      setLetter(letter);
      props.handleInputLetter(props.id, textInput, letter);
    }
  };

  return (
    <input
      ref={textInput}
      id={props.id.toString()}
      autoCapitalize="off"
      // className="text-2xl w-4 m-0.5 sm:text-5xl sm:w-10 sm:m-1 font-mono shadow appearance-none border-none rounded text-purple leading-tight focus:outline-none focus:shadow-outline p-0 text-center"
      className="text-[6vw] w-[4.5vw] m-1 font-mono shadow appearance-none border-none rounded text-purple leading-tight focus:outline-none focus:shadow-outline p-0 text-center"
      maxLength={1}
      // pattern='/^[a-zàâçéèêëîïôûùüÿñæœ]$/i' // not working
      type="text"
      value={letter}
      placeholder=""
      // onChange={(e) => setLetter(e.target.value)}
      onKeyDown={handleKeyDown}
      onChange={handleChangeValue}
      onFocus={props.focusLastInput}
    />
  );
}

type AnswerProps = {
  word: string;
};

function Answer(props: AnswerProps) {
  const wordToGuess = props.word;
  return (
    <div className="answer">
      {wordToGuess.split("").map((letter: string, i: number) => {
        return <AnswerInput letter={letter} key={i} />;
      })}
      <AnswerInput letter="" key={1000} />
    </div>
  );
}

type AnswerInputProps = {
  letter: string;
  key: number;
};

function AnswerInput(props: AnswerInputProps) {
  return (
    <input
      autoCapitalize="off"
      className="text-[6vw] w-[4.5vw] m-1 font-mono shadow appearance-none border-none rounded text-pink-800 leading-tight focus:outline-none focus:shadow-outline p-0 text-center"
      maxLength={1}
      type="text"
      value={props.letter}
      placeholder=""
      readOnly={true}
    />
  );
}
