import React from 'react'
import {Container, Modal, Stack, Button} from "react-bootstrap"
import { useFlashCards } from './Context'
import EditDeckCard from './EditDeckCard'

export default function EditDeckModal({deckId, handleClose}) {

  const {decks, getCards, deleteDeck} = useFlashCards()
  const deck = decks.find(deck => deck.id === deckId)
  const cards = getCards(deckId)

  return (
    <Container>
      <Modal show={deckId != null} onHide={handleClose} className=''>
        <Modal.Header closeButton>
          <Modal.Title>{deck?.name}</Modal.Title>
          <Button variant='outline-danger' className='m-2' onClick={() => {deleteDeck(deck); handleClose()}}>Delete</Button>
        </Modal.Header>

        <Modal.Body>
          <Stack direction='vertical' gap={3}>
            {cards.map(card => {
              return <EditDeckCard card={card} key={card.id}/>
            })}
          </Stack>  
        </Modal.Body>
      </Modal>
    </Container>
  )
}
