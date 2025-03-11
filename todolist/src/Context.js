import React, { useContext, } from 'react'
import useLocalStorage from './useLocalStorage'
import {v4 as uuidV4} from "uuid"

const ListsContext = React.createContext()

export function useLists() {
    return useContext(ListsContext)
}

export const Context = ( {children} ) => {

    const [lists, setLists] = useLocalStorage("LISTS", [])
    const [tasks, setTasks] = useLocalStorage("TASKS", [])

    function getTasks(listId) {
        return tasks.filter(tasks => tasks.listId === listId)
    }

    function addList({name}) {
        setLists(prevLists => {
            if(prevLists.find(list => list.name === name)) {
                return prevLists
            }
            return [...prevLists, { id: uuidV4(), name}]
        })
    }

    function addTask({description, date, listId}) {
        setTasks(prevTasks => {
            return [...prevTasks, {id: uuidV4(), description, date, listId}]
        })
    }

    function deleteList({id}) {
        setTasks(prevTasks => {
            return prevTasks.filter(task => task.listId !== id)
        })

        setLists(prevLists => {
            return prevLists.filter(list => list.id !== id)
        })
    }

    function deleteTask({id}){
        setTasks(prevTasks => {
            return prevTasks.filter(task => task.id !== id)
        })
    }


  return (
    <ListsContext.Provider value={{lists, tasks, addList, addTask, getTasks, deleteList, deleteTask}}>
        {children}
    </ListsContext.Provider>
  )
}
