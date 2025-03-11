import React from 'react'
import {Card, Stack, Button} from "react-bootstrap"
import { useFlashCards } from './Context'
import {Link} from "react-router-dom"

export default function Deck({id, name, onEditDeckClick}) {

  const {getCards} = useFlashCards()
  const cards = getCards(id)

  return (
    <>
    <Card>
      <Card.Body>
        <Card.Title className="d-flex justify-content-between align-baseline fw-normal mb-3">
          <div className="me-2" >{name}</div>
          <div className="d-flex align-items-baseline">
            {cards.length} cards in deck
          </div>
        </Card.Title>

        <Stack direction='horizontal' gap={2} className='mt-4'>
          <Link to={`/study/${id}`} className='ms-auto'>
            <Button variant='outline-primary'>Study</Button>
          </Link>
          <Button variant='outline-secondary' onClick={onEditDeckClick}>Edit Deck</Button>
        </Stack>

      </Card.Body>
    </Card>

    </>
  )
}
