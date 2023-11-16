import React,{useState, createContext} from "react";

export const CaseContext = createContext();

export const CaseProvider = (props) =>{
    const [document, setDocument] = useState(null);
    return (
      <CaseContext.Provider value={[document, setDocument]}>
        {props.children}
      </CaseContext.Provider>
    );
}