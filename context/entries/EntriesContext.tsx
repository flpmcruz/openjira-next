import { createContext } from "react";
import { Entry } from "@/interfaces";

export interface ContextProps {
  entries: Entry[];

  //Methods
  addNewEntry: (description: string) => void
  updateEntry: (entry: Entry) => void
  deleteEntry: (id: string) => void
}

export const EntriesContext = createContext({} as ContextProps);
