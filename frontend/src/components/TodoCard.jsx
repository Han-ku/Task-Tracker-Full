import React, { useState } from 'react';
import CheckButton from '../components/CheckButton';
import AlertDialogSlide from '../components/AlertDialogSlide';

export default function TodoCard({
  children, className, index,
  todo, handleDeleteTodo, 
  handleEditTodoInit, toggleTaskCompletion,
  highlightedRedTodo, highlightedBlueTodo,
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  const handleOpenDeleteDialog = () => {
    setIsDialogOpen(true)
  }

  const handleCloseDeleteDialog = (confirmed) => {
    setIsDialogOpen(false)
    if (confirmed) handleDeleteTodo(index)
  }

  const toggleTooltip = () => setIsTooltipVisible(!isTooltipVisible);

  const groupHistoryByDate = (history) =>
    history.reduce((acc, entry) => {
      const date = entry.date.split(' ')[0];
      if (!acc[date]) acc[date] = [];
      acc[date].push(entry);
      return acc;
    }, {});

  const groupedHistory = groupHistoryByDate(todo.history);

  return (
    <li
      className={`todoItem 
        ${todo.completed ? 'completed' : ''}  
        ${todo.text === highlightedRedTodo ? 'highlight_red' : ''} 
        ${index === highlightedBlueTodo ? 'highlight_blue' : ''} 
        ${className}`}
    >
      <CheckButton checked={todo.completed} onToggle={() => toggleTaskCompletion(index)} />
      {children}
      <div className='actionsContainer'>
        <button
          style={{ position: 'relative' }}
          onMouseEnter={toggleTooltip}
          onMouseLeave={toggleTooltip}
        >
          <i className="fa-solid fa-info"></i>
        </button>
        {isTooltipVisible && (
          <div className="tooltip tooltip-visible">
            <h2>History</h2>
            <ul>
              {Object.entries(groupedHistory).map(([date, entries]) => (
                <React.Fragment key={date}>
                  <li><strong>{date}</strong></li>
                  {entries.map((entry, i) => (
                    <React.Fragment key={i}>
                      <li>{entry.action} at {entry.date.split(' ')[1]}</li>
                      {i < entries.length - 1 && <hr />}
                    </React.Fragment>
                  ))}
                </React.Fragment>
              ))}
            </ul>
          </div>
        )}
        <button onClick={() => handleEditTodoInit(index)}>
          <i className="fa-solid fa-pen-to-square"></i>
        </button>
        
        <button onClick={handleOpenDeleteDialog}>
          <i className="fa-regular fa-trash-can"></i>
        </button>
      </div>
      <AlertDialogSlide
        open={isDialogOpen}
        onClose={handleCloseDeleteDialog} 
      />
    </li>
  );
}
