import React, { useState } from 'react';
import { fetchQuizQuestions } from './API';
//components
import QuestionCard from './components/QuestionCard';
//type
import { QuestionState, Difficulty } from './API';
//styles
import { GlobalStyle, Wrapper } from './App.styles';




const TOTAL_QUESTION: number = 10;

export interface AnswerObject {
  question: string,
  answer: string,
  correct: boolean,
  correctAnswer: string
}


const App = () => {
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);



  const startTrivial = async () => {
    setLoading(true)
    setGameOver(false)
    const newQuestions = await fetchQuizQuestions(TOTAL_QUESTION, Difficulty.EASY)

    setQuestion(newQuestions);
    setScore(0);
    setNumber(0);
    setUserAnswers([]);
    setLoading(false)

  }
  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver) {
      // user choose an answer
      const answer = e.currentTarget.value;
      // system check correctly of answer
      const correct = question[number].correct_answer === answer;
      // set score
      if (correct) {
        setScore(pre => pre + 1)
      }
      //save user answer 
      const answerObject = {
        question: question[number].question,
        answer,
        correct,
        correctAnswer: question[number].correct_answer
      }
      setUserAnswers((pre) => [...pre, answerObject])
    }
  }

  const nextQuestion = () => {
    //move on to the next question if not the last question
    const nextQuestion = number + 1;

    if (nextQuestion === TOTAL_QUESTION) {
      setGameOver(true)
    } else {
      setNumber(nextQuestion);
    }

  }
  console.log(userAnswers)
  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <div className="App">
          <h1>REACT QUIZ</h1>
          {gameOver || userAnswers.length === TOTAL_QUESTION ?
            <button className="start" onClick={startTrivial}>Start</button> : null
          }
          {!gameOver && <p className="score">Score: {score}</p>}
          {loading && <p>Loading question...</p>}
          {!loading && !gameOver &&
            < QuestionCard
              questionNr={number + 1}
              totalQuestions={TOTAL_QUESTION}
              question={question[number].question}
              answers={question[number].answers}
              userAnswer={userAnswers ? userAnswers[number] : undefined}
              callback={checkAnswer}
            />}
          {!gameOver && !loading && userAnswers.length === number + 1 && number !== TOTAL_QUESTION - 1 ?
            <button className="next" onClick={nextQuestion}>
              Next question
            </button> : null}

        </div >
      </Wrapper>
    </>
  );
}

export default App;
