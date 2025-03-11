import { Modal, Form, Button, } from "react-bootstrap"
import { useRef, } from "react"
import { useLists } from "./Context"


export default function AddListModal( {show, handleClose} ) {

  const nameRef = useRef()
  const {addList} = useLists()

  function handleSubmit(e) {
    e.preventDefault()
    addList({
      name: nameRef.current.value
    })
    handleClose()
  }

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>New List</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form.Group controlId="name" className="mb-3">
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
