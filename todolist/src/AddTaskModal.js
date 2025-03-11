import { Modal, Form, Button} from "react-bootstrap"
import { useRef, } from "react"
import { useLists } from "./Context"

export default function AddTaskModal( {show, handleClose, defaultListId} ) {
  
    const descriptionRef = useRef()
    const dateRef = useRef()
    const listIdRef = useRef()

    const {addTask, lists} = useLists()

    function handleSubmit(e) {
        e.preventDefault()
        addTask({
            description: descriptionRef.current.value,
            date: dateRef.current.value,
            listId: listIdRef.current.value
        })
        handleClose()
    }

    return (
    <>
    <Modal show={show} onHide={handleClose}>
        <Form onSubmit={handleSubmit}>
            <Modal.Header closeButton>
                <Modal.Title>New Task</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form.Group controlId="description" className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control ref={descriptionRef} type="text" autoComplete="off" required />
                </Form.Group>

                {/* Optional */}
                <Form.Group controlId="description" className="mb-3">
                    <Form.Label>Due date</Form.Label>
                    <Form.Control ref={dateRef} type="date"  />
                </Form.Group>

                <Form.Group controlId="listId" className="mb-3">
                    <Form.Label>List</Form.Label>
                    <Form.Select defaultValue={defaultListId} ref={listIdRef}>
                        {lists.map(list=>(
                            <option key={list.id} value={list.id}>{list.name}</option>
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
