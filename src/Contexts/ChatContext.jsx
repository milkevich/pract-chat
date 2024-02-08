import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useUserContext } from './UserContext';

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
    const { user } = useUserContext();

    const initialState = {
        chatId: null,
        otherUser: {}
    };

    const chatReducer = (state, action) => {
        switch (action.type) {
            case 'CHANGE_USER':
                return {
                    otherUser: action.payload,
                    chatId: user.uid > action.payload.uid
                        ? user.uid + action.payload.uid
                        : action.payload.uid + user.uid
                };
            default:
                return state;
        }
    };

    const [state, dispatch] = useReducer(chatReducer, initialState);

    useEffect(() => {
        if (user) {
            dispatch({ type: 'CHANGE_USER', payload: state.otherUser });
        }
    }, [user]);

    return (
        <ChatContext.Provider value={{ data: state, dispatch }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChatContext = () => useContext(ChatContext);
