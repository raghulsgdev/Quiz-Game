import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'

function Index() {

    const [questionsData, setQuestionsData] = useState([])

    const [intro, setIntro] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setIntro(false);
        }, 1300);
    }, []);

    const handleAPI = async () => {

        try {
            const data = await axios.get('http://127.0.0.1:8000/quiz')
            console.log("Server Response", data.data);
            // console.log("Count", data.data.correctAnswer);

            setQuestionsData(data.data)

        } catch (error) {
            console.log("Server Response Error", error);
        }

    }


    useEffect(() => {
        handleAPI()
    }, [])

    const [answeredCount, setAnsweredCount] = useState(0)
    const [answer, setAnswer] = useState({})
    const [crtCount, setCrtCount] = useState(0)
    const [animate, setAnimate] = useState(false)

    const checkAnswer = async (clickedAns, quesId) => {

        if (answer[quesId] !== undefined) {
            return
        }

        try {
            const data = await axios.post('http://127.0.0.1:8000/check-answer', {
                "selectedOption": clickedAns,
                "questionId": quesId
            })

            const result = data.data.correct
            const score = data.data.score

            const newAnswer = { ...answer }
            newAnswer[quesId] = clickedAns
            setAnswer(newAnswer)

            setAnsweredCount(answeredCount + 1)

            if (result === true) {
                // setCrtCount(crtCount + 1)
                setCrtCount(score)
            }

            if (answeredCount + 1 === questionsData.length) {
                setAnimate(true)
            }

        } catch (error) {
            console.log("Server Response Error", error);
        }

    }


    // function handleAnswers(clickedAns, crtAns, quesId) {

    //     if (answer[quesId] !== undefined) {
    //         return;
    //     }

    //     if (answeredCount + 1 === questionsData.length) {
    //         setAnimate(true)
    //     }

    //     // if (answer[quesId] === undefined) {
    //     //     setAnsweredCount(answeredCount + 1)
    //     // }

    //     const newAnswer = { ...answer }

    //     newAnswer[quesId] = clickedAns

    //     setAnswer(newAnswer);
    //     setAnsweredCount(answeredCount + 1)

    //     if (clickedAns == crtAns) {

    //         setCrtCount(crtCount + 1)
    //         // setOutput("That's Correct! Way To Go")
    //         // setIcon(true)
    //     }

    // }

    function handleBack() {
        setAnimate(false)
        setAnsweredCount(0)
        setCrtCount(0)
        setAnswer({})
        // setOutput({})
    }

    return (

        
        <div className='page'>
            <h1>Helloooo</h1>
            
            {intro && <div className="introAnimation"></div>}

            {
                animate == false && <aside className='scoreBar'>
                    <div>
                        <p>{answeredCount}/{questionsData.length} answered</p>
                    </div>
                    <div className='bottomLine'></div>
                </aside>
            }

            {
                animate == true && <aside className='scoreBarAnimate'>
                    <h2>You Got {crtCount} Out Of 10</h2>
                    <div>
                        <button className='backBtn' onClick={() => handleBack()}><i class="fa-solid fa-backward"></i> Back</button>
                    </div>
                </aside>
            }


            {/* <aside className={animate ? 'scoreBa`rAnimate' : 'scoreBar'}>
                <div>
                    <p>{answeredCount}/{questionsData.length} answered</p>
                </div>
                <div className='bottomLine'></div>
            </aside> */}

            {
                answeredCount < questionsData.length && <main className='mainContent'>

                    <div className='lineSection'>
                        <div className='topLinee'></div>
                        <div className='topLine'></div>
                    </div>

                    <div className='mainHeader'>
                        <h1>Developer Knowledge Quiz</h1>
                        <p>Test Your Programming Skills</p>
                    </div>

                    <div className='questionSection'>
                        {questionsData.map((val, ind) => (
                            <div>
                                <div className='questions'>
                                    <h3>
                                        {ind + 1}.{val.question}
                                    </h3>
                                </div>

                                {
                                    val.options.map((options) => {
                                        return (
                                            <div className='options' onClick={() => checkAnswer(options, val.id)}>
                                                <p>{options}
                                                    {answer[val.id] === options && " ✔"}
                                                </p>
                                            </div>
                                        )
                                    })
                                }

                                {/* {output[val.id] && <p className='output'>{output[val.id]}</p>} */}

                            </div>
                        ))}

                        <div className='resultHead'>
                            <p>Complete all 10 questions to view your results.</p>
                        </div>
                    </div>

                </main>
            }

            {/* {
                answeredCount === questionsData.length && <div className='finalScore'>
                    <p>You Got {crtCount} Out Of 10</p>
                </div>
            } */}
        </div >
    );
}

export default Index;