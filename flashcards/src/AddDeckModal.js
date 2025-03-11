import React, { useRef,  } from 'react'
import { Modal, Button, Form} from "react-bootstrap"
import { useFlashCards } from './Context'

export default function AddDeckModal({show, handleClose}) {

    const nameRef = useRef()
    const {addDecks} = useFlashCards()

    function handleSubmit(e) {
        e.preventDefault()
        addDecks({
            name: nameRef.current.value
        })
        handleClose()
    }

  return (
    <>
    <Modal show={show} onHide={handleClose}>
        <Form onSubmit={handleSubmit}>
            <Modal.Header closeButton>
                <Modal.Title>New Deck</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form.Group controlId='name' className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control ref={nameRef} type="text" autoComplete="off" required />
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
