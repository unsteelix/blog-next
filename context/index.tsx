import { createContext, useState } from 'react'

export const AppContext = createContext({})

export const AppProvider = ({ children }: { children: any }) => {

    const initialState = {
        wasFirstInteraction: false,
    }

    const [state, setState] = useState(initialState);

    return (
        <AppContext.Provider value={{ state, setState }}>
            {children}
        </AppContext.Provider>
    );
};