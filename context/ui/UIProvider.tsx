import { FC, useReducer } from 'react'
import { UIContext, UIReducer } from './'

export interface UIState {
    sidemenuOpen: boolean
    isAddingEntry: boolean
    isDragging: boolean
}

interface Props {
    children: JSX.Element | JSX.Element[]
}

const UI_INITIAL_STATE: UIState = {
    sidemenuOpen: false,
    isAddingEntry: false,
    isDragging: false
}

export const UIProvider: FC<Props> = ({ children }) => {

    const [state, dispatch] = useReducer(UIReducer, UI_INITIAL_STATE)

    const openSideMenu = () => dispatch({ type: 'UI - Open Sidebar' })
    const closeSideMenu = () => dispatch({ type: 'UI - Close Sidebar' })

    const setIsAddingEntry = (isAdding: boolean) => dispatch({ type: 'UI - Set isAddingEntry', payload: isAdding })

    const startDragging = () => dispatch({ type: 'UI - Start Dragging' })
    const endDragging = () => dispatch({ type: 'UI - End Dragging' })

    return (
        <UIContext.Provider value={{
            ...state,

            //Methods
            openSideMenu,
            closeSideMenu,
            setIsAddingEntry,

            startDragging,
            endDragging,
        }}>

            {children}
        </UIContext.Provider>
    )
}
