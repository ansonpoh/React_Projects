import React, { useContext } from 'react'
import useLocalStorage from './useLocalStorage'
import {v4 as uuidV4} from "uuid"

const FlashCardContext = React.createContext()

export function useFlashCards() {
    return useContext(FlashCardContext)
}

export default function ContextProvider({children}) {

    const [decks, setDecks] = useLocalStorage("decks", [])
    const [cards, setCards] = useLocalStorage("cards", [])

    function addDecks({name}) {
        setDecks(prevDecks => {
            if(prevDecks.find(deck => deck.name === name)) {
                return prevDecks
            }
            return [...prevDecks, {id: uuidV4(), name}]
        })
    }
    
    function addCards({question, answer, deckId,}) {
        setCards(prevCards => {
            return [...prevCards, {id: uuidV4(), question, answer, deckId}]
        })
    }

    function getCards(deckId) {
        return cards.filter(cards => cards.deckId === deckId)
    }

    function deleteDeck({id}) {
        setDecks(prevDecks => {
            return prevDecks.filter(deck => deck.id !== id)
        })
    }

    function deleteCard({id}) {
        setCards(prevCards => {
            return prevCards.filter(card => card.id !== id)
        })
    }

    function editCard({id, question, answer, deckId}) {
        setCards(prevCards => {
            return prevCards.filter(card => card.id !== id)
        })

        setCards(prevCards => {
            return [...prevCards, {id: uuidV4(), question, answer ,deckId}]
        })
    }

  return (
    <FlashCardContext.Provider value={{decks, cards, addDecks, addCards, getCards, deleteDeck, deleteCard, editCard}}>
        {children}
    </FlashCardContext.Provider>
  )
}
