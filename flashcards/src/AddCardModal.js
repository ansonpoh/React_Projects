import React, { useRef, }from 'react'
import { Modal, Button, Form} from "react-bootstrap"
import { useFlashCards } from './Context'

export default function AddCardModal({show, handleClose, defaultDeckId}) {

    const questionRef = useRef()
    const answerRef = useRef()
    const deckIdRef = useRef()
    const {addCards, decks} = useFlashCards()

    function handleSubmit(e) {
        e.preventDefault()
        addCards({
            question: questionRef.current.value,
            answer: answerRef.current.value,
            deckId: deckIdRef.current.value,
        })
        handleClose()
    }
    
  return (
    <>
    <Modal show={show} onHide={handleClose}>
        <Form onSubmit={handleSubmit}>
            <Modal.Header closeButton>
                <Modal.Title>New Cards</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form.Group controlId='question' className='mb-3'>
                    <Form.Label>Question</Form.Label>
                    <Form.Control ref={questionRef} type="text" autoComplete="off" required />
                </Form.Group>

                <Form.Group controlId='answer' className='mb-3'>
                    <Form.Label>Answer</Form.Label>
                    <Form.Control ref={answerRef} type="text" autoComplete="off" required />
                </Form.Group>

                <Form.Group controlId="deckId" className='mb-3'> 
                    <Form.Label>Deck</Form.Label>
                    <Form.Select defaultDeckId={defaultDeckId} ref={deckIdRef}>
                        {decks.map(deck => (
                            <option key={deck.id} value={deck.id}>{deck.name}</option>
                        ))}

                    </Form.Select>
                </Form.Group>

                <div className="d-flex justify-content-end">
                    <Button variant="primary" type="submit">Add</Button>
                </div>
            </Modal.Body>
        </Form>
    </Modal>
    </>
  )
}
