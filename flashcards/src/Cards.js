import React, { useState, useEffect, useRef } from 'react'
import {Container, } from "react-bootstrap"
import "./App.css"

export default function Study({card}) {

    const frontEl = useRef()
    const backEl = useRef()
    const [flip, setFlip] = useState(false)
    const [height, setHeight] = useState('initial')

    function setMaxHeight() {
        const frontHeight = frontEl.current.getBoundingClientRect().height
        const backHeight = backEl.current.getBoundingClientRect().height
        setHeight(Math.max(frontHeight, backHeight, 100))
    }

    useEffect(setMaxHeight, [card.question, card.answer])
    useEffect(() => {
        window.addEventListener('resize', setMaxHeight)
        return() => window.removeEventListener('resize', setMaxHeight)
    },[])
   
  return (
    <>
    <Container key={card.id}>
        <div onClick={()=>setFlip(!flip)} className={`cards mx-4 ${flip ? 'flip' : ''}`} style={{height: height}}>
            <div className='front' ref={frontEl}>{card.question}</div>
            <div className='back' ref={backEl}>{card.answer}</div>
        </div>
    </Container>
    </>
  )
}
