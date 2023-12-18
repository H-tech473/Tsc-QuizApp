import React, { useState } from 'react';
import { fetchQuizQuestions } from './API';
// Components
import QuestionCard from './components/QuestionCard';
// types
import { QuestionState, difficulty } from './API';
// Styles
import { GlobalStyle, Wrapper } from './App.styles';


export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
}

const TOTAL_QUESTIONS = 10;


function App() {
  const [loading, setloading] = useState(false);
  const [questions, setquestions] = useState<QuestionState[]>([]);
  const [number, setnumber] = useState(0);
  const [userAnswers, setuserAnswers] = useState<AnswerObject[]>([]);
  const [score, setscore] = useState(0);
  const [gameOver, setgameOver] = useState(true);

  const startTrivia = async () => {
    setloading(true);
    setgameOver(false);

    const newQuestions = await fetchQuizQuestions(
      TOTAL_QUESTIONS,
      difficulty.EASY
    );

    setquestions(newQuestions);
    setscore(0);
    setuserAnswers([]);
    setnumber(0);
    setloading(false);

  }

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if(!gameOver){
      // user answer
      const answer = e.currentTarget.value;
      // check correct value
      const correct = questions[number].correct_answer === answer;
      // add score if answer is correct
      if (correct) setscore(prev => prev + 1);
      // save answer in the array for user answers
      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer,
      };
      setuserAnswers(prev => [...prev, answerObject]);
    }
  }

  const nextQuestion = () => {
    // move on to next question if not the last question
    const nextQuestion = number + 1;
    if(nextQuestion === TOTAL_QUESTIONS) {
      setgameOver(true);
    }else{
      setnumber(nextQuestion);
    }
  }

  return (
    <>
    <GlobalStyle />
    <Wrapper>
      <h1>REACT QUIZ</h1>
      {gameOver || userAnswers.length === TOTAL_QUESTIONS? (
      <button className='start' onClick={startTrivia}>
        Start
      </button>
      ): null}
      {!gameOver && <p className='score'>Score: {score}</p>}
      {loading && <p className='load' style={{color: '#fff'}}>Loading Questions...</p>}
      {!loading && !gameOver &&
      <QuestionCard 
        questionNr={number + 1}
        totalQuestions={TOTAL_QUESTIONS}
        question={questions[number].question}
        answers={questions[number].answers}
        userAnswer={userAnswers ? userAnswers[number]: undefined}
        callback={checkAnswer}
      />
    }

      {!gameOver && !loading && userAnswers.length === number + 1 && number !== TOTAL_QUESTIONS - 1 && 
        <button className="next" onClick={nextQuestion}>
          Next Question
        </button>
      }
    </Wrapper>
    </>
  );
}

export default App;
