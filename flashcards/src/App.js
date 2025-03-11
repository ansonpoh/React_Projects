import './App.css';
import { Container, Stack, Button} from "react-bootstrap"
import { useFlashCards } from './Context';
import { useState } from 'react';
import {Routes, Route, Link} from "react-router-dom"
import Deck from './Deck';
import AddDeckModal from './AddDeckModal';
import AddCardModal from './AddCardModal';
import EditDeckModal from './EditDeckModal';
import StudyList from './StudyList';

function App() {

  const [showAddDeckModal, setShowAddDeckModal] = useState(false)
  const [showAddCardModal, setShowAddCardModal] = useState(false)
  const [editDeckModalId, setEditDeckModalId] = useState()
  const [addCardModalDeckID, setAddCardModalDeckId] = useState()
  const {decks} = useFlashCards()

  function openShowAddCardModal(deckId) {
    setShowAddCardModal(true)
    setAddCardModalDeckId(deckId)
  }

  return (
    <>
    <Container  className="my-5">
      <Stack direction="horizontal" gap={2} className="mb-4">
        <Link to="/">
          <h1 className="me-auto title">FlashCards</h1>
        </Link>
        <Button variant="primary" onClick={() => setShowAddDeckModal(true)} className='ms-auto'>Add Deck</Button>
        <Button variant="outline-primary" onClick={openShowAddCardModal}>Add Cards</Button>
      </Stack>

      <div style={{
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr)", 
          gap: "1rem", 
          alignItems: "flex-start"
          }}>

          {decks.map(deck => (
            <Deck 
            key={deck.id} 
            id={deck.id} 
            name={deck.name} 
            onEditDeckClick={() => {setEditDeckModalId(deck.id)}}
            onAddCardClick={() => {setAddCardModalDeckId(deck.id)}}
            />
          ))}

      </div>
    </Container>


    <AddDeckModal show={showAddDeckModal} handleClose={() => setShowAddDeckModal(false)}/>
    <AddCardModal show={showAddCardModal} handleClose={() => setShowAddCardModal(false)} defaultDeckId={addCardModalDeckID}/>
    <EditDeckModal deckId={editDeckModalId} handleClose={() => setEditDeckModalId()}/>

    <Routes>
      <Route path='/' element={""}></Route>
      <Route path='/study/:deckId' element={<StudyList />}></Route>
    </Routes>
    </>
  );
}

export default App;
