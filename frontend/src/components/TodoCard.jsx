import React, { useState } from 'react';
import CheckButton from '../components/CheckButton';
import AlertDialogSlide from '../components/AlertDialogSlide';
import TooltipHistory from '../components/TooltipHistory';

export default function TodoCard({
  children, className,
  todo, handleDeleteTodo, 
  handleEditTodoInit, toggleTaskCompletion,
  highlightedRedTodo, highlightedBlueTodo,
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleOpenDeleteDialog = () => {
    setIsDialogOpen(true)
  }

  const handleCloseDeleteDialog = (confirmed) => {
    setIsDialogOpen(false)
    if (confirmed) handleDeleteTodo(todo.todo_id)
  }

  const tooltipId = `history_tooltip_${todo.todo_id}`

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
        ${todo.todo_id === highlightedBlueTodo ? 'highlight_blue' : ''} 
        ${className}`}
    >
      <CheckButton checked={todo.completed} onToggle={() => toggleTaskCompletion(todo.todo_id)} />
      {children}
      <div className='actionsContainer'>
        <button
          data-tooltip-id={tooltipId}
        >
          <i className="fa-solid fa-info"></i>
        </button>
        
       <TooltipHistory groupedHistory={groupedHistory} tooltipId={tooltipId} />

        <button onClick={() => handleEditTodoInit(todo.todo_id)}>
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
