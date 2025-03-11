import React, { useRef } from 'react'
import { Button, Stack, Form} from "react-bootstrap"
import { useFlashCards } from './Context'

export default function EditDeckCard({card}) {

    const {editCard, deleteCard} = useFlashCards()

    function handleSubmit(e) {
      e.preventDefault()
      editCard({
        id: card.id,
        question: questionRef.current.value,
        answer: answerRef.current.value,
        deckId: card.deckId
      })
    }

    const questionRef = useRef()
    const answerRef = useRef()

  return (
    <Form onSubmit={handleSubmit}  key={card.id}>
        <Stack direction='horizontal' gap={2}>
            <Form.Group controlId='question'>
                <Form.Label>Quesiton:</Form.Label>
                <Form.Control ref={questionRef} type='text' defaultValue={card.question} autoComplete='off' className='lg'/>
            </Form.Group>

            <Form.Group controlId='answer'>
                <Form.Label>Answer:</Form.Label>
                <Form.Control ref={answerRef} type='text' defaultValue={card.answer} autoComplete='off'/>
            </Form.Group>

            <div className="d-flex justify-content-end mt-4">
                <Button variant="primary" type="submit">Save</Button>
            </div>

            <div className="d-flex justify-content-end mt-4">
                <Button variant="outline-danger" onClick={() => deleteCard(card)}>Delete</Button>
            </div>
        </Stack>
    </Form>
    )
}
