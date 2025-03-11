import React from 'react'
import { useFlashCards } from './Context'
import  {useParams, } from "react-router-dom"
import Cards from "./Cards"
import {Container} from "react-bootstrap"

export default function StudyList() {

    const {deckId} = useParams()
    const {getCards} = useFlashCards()
    const cards = getCards(deckId)

  return (
    <Container>
      <div style={{
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr)", 
        alignItems: "flex-start"
        }}>
        {cards.map(card => {
              return <>
                <Cards card={card} key={card.id}/>
              </>
          })}
      </div>
    </Container>

  )
}
