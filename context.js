import { createContext, useContext } from "react";

export const DBContext = createContext();

export const useDB = () => useContext(DBContext);
