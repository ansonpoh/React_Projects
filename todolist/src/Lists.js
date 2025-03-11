import { Card, Stack, Button} from "react-bootstrap"
import { useLists } from "./Context"

export default function Lists( {name, id, onAddTaskClick, onViewTasksClick} ) {

  const {getTasks} = useLists()
  const tasks = getTasks(id)

  return (
    <>
      <Card>
        <Card.Body>
          <Card.Title className="d-flex justify-content-between align-baseline fw-normal mb-3">
            <div className="me-2">{name}</div>
          </Card.Title>

          <div>{tasks.length} Tasks Remaining</div>

          <Stack direction="horizontal" gap={2} className="mt-4">
            <Button variant="outline-primary" className="ms-auto" onClick={onAddTaskClick}>Add Task</Button>
            <Button variant="outline-secondary" onClick={onViewTasksClick}>View Tasks</Button>
          </Stack>

        </Card.Body>
      </Card>
    </>
  )
}
