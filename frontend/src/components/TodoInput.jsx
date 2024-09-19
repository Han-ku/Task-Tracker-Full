import React, {useState, useRef} from 'react';

export default function TodoInput(props) {
    const { handleAddTodos, todoValue, setTodoValue, handleEditTodoSave, editIndex, setShowDatePicker, selectedDate } = props

    const inputRef = useRef(null)
    const [placeholder, setPlaceholder] = useState("Enter todo..")

    const handleSubmit = () => {
      if (editIndex !== null) {
        handleEditTodoSave()
      } else {
        handleAddTodos(todoValue)
      }
      setTodoValue('')
      if(inputRef.current) {
        inputRef.current.blur()
      }
      
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        handleSubmit()
      }
    }

    const handleFocus = () => {
      setPlaceholder("")
    }

    const handleBlur = () => {
      setPlaceholder("Enter todo..")
    }

    return (
        <header>
          <input 
            value={todoValue} 
            onChange={(e) => setTodoValue(e.target.value)} 
            placeholder={placeholder} 
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />

          <button 
            className='btn_calendar' 
            onClick={() => setShowDatePicker(true)}
          >
            <i className="fa-solid fa-calendar-days"></i>
            {selectedDate && <i className="fa-solid fa-check-circle"></i>}
          </button>

          <button onClick={handleSubmit}>
            {editIndex !== null ? 'Save' : 'Add'}
          </button>
        </header>
    )
}