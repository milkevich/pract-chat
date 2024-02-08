import { createContext, useContext, useState } from 'react'

const ThemeContext = createContext(null)

const ThemeContextProvider = ({children}) => {
    const [theme, setTheme] = useState(false)

    const changeTheme = () => {
        setTheme(!theme)
    }
    return (
        <ThemeContext.Provider value={{theme, changeTheme}}>
            {children}            
        </ThemeContext.Provider>
    )
}

export const useThemeContext = () => useContext(ThemeContext)

export default ThemeContextProvider