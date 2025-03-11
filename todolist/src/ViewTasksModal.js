import { Modal, Button, Stack} from "react-bootstrap" 
import { useLists } from "./Context"

export default function ViewTasksModal( {listId, handleClose} ) {
    
    const {getTasks, lists, deleteList, deleteTask, } = useLists()
    const list = lists.find(list=> list.id === listId)
    const tasks = getTasks(listId)
  
    return (
    <>
        <Modal show={listId != null} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>
                    <Stack direction="horizontal" gap={2}>
                        <div>{list?.name}</div>
                        {listId !== null && (
                            <Button variant="outline-danger" onClick={() => {deleteList(list); handleClose()}}>Delete</Button>
                        )}
                    </Stack>
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Stack direction="vertical" gap={3}>
                    {tasks.map(task => (
                        <Stack direction="horizontal" gap={2} key={task.id}>
                            <div className="me-auto fs-4">{task.description}</div>
                            {task.date !== "" && (
                                <div>Due: {task.date}</div>
                            )}
                            <Button size="sm" variant="outline-danger" onClick={() =>deleteTask(task)}>&times;</Button>
                        </Stack>
                    ))}
                </Stack>
            </Modal.Body>

        </Modal>
    </>
    )
}
