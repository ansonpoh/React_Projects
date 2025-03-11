import { Container, Stack, Button} from "react-bootstrap"
import React, { useState, } from 'react';
import { useLists } from "./Context";
import AddListModal from "./AddListModal";
import Lists from "./Lists";
import AddTaskModal from "./AddTaskModal";
import ViewTasksModal from "./ViewTasksModal";


function App() {

  const [addListModal, setAddListModal] = useState(false)
  const [addTaskModal, setAddTaskModal] = useState(false)
  const [viewTasksModalID, setViewTasksModalID] = useState()
  const [addTasksModalID, setAddTasksModalID] = useState()

  const {lists} = useLists()

  function openAddTasksModal(listId) {
    setAddTaskModal(true)
    setAddTasksModalID(listId)
  }


  return (
  <>
    <Container>
      <Stack direction="horizontal" gap={2} className="my-4">
        <h1 className="me-auto">To Do List</h1>
        <Button variant="primary" onClick={() => setAddListModal(true)}>Add List</Button>
      </Stack>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "1rem",
        alignItems: "flex-start"
      }}>
        
      {lists.map(list=>{

        return(
          <Lists 
          key={list.id} 
          id={list.id}
          name={list.name} 
          onAddTaskClick={() => openAddTasksModal(list.id)} 
          onViewTasksClick={() => setViewTasksModalID(list.id)}/>
        )
      })}

      </div>
    </Container>
    
    <AddListModal show={addListModal} handleClose={(() => {setAddListModal(false)})} /> 
    <AddTaskModal show={addTaskModal} handleClose={(() => {setAddTaskModal(false)})} defaultListId={addTasksModalID} />
    <ViewTasksModal listId={viewTasksModalID} handleClose={(() => {setViewTasksModalID()})} />
  </>
  )
}

export default App;
