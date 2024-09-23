import React from 'react';
import TodoCard from '../components/TodoCard';

const formatDateForGrouping = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const groupTodosByDate = (todos) => {
  if (!Array.isArray(todos)) {
    console.error('Expected todos to be an array, but got:', todos)
    return {};
  }

  const groupedTodos = {}
  todos.forEach((todo) => {
    const date = formatDateForGrouping(new Date(todo.due_date))
    if (!groupedTodos[date]) {
      groupedTodos[date] = []
    }
    groupedTodos[date].push(todo)
  })
  return groupedTodos
}

export default function TodoList(props) {
  const { todos = [], highlightedRedTodo, highlightedBlueTodo } = props;

  const groupedTodos = groupTodosByDate(todos)
  const today = formatDateForGrouping(new Date())
  const todayTodos = groupedTodos[today] || []

  return (
    <div className='main'>
      <div className='today_todos_container'>
        <h3 className='date_title'>Today</h3>
        <ul className='main'>
          {todayTodos.length > 0 ? (
            todayTodos.map((todo) => (
                <TodoCard
                  {...props}
                  key={todo.todo_id}  
                  className={todo.description_todo === highlightedRedTodo ? 'highlight_red' : ''}
                  todo={todo}
                  index={todo.todo_id}  
                  highlightedRedTodo={highlightedRedTodo}
                  highlightedBlueTodo={highlightedBlueTodo}
                >
                  <p>{todo.description_todo}</p>
                </TodoCard>
            ))
          ) : (
            <li id='no-task'>No tasks available</li>
          )}
        </ul>
      </div>

    {Object.keys(groupedTodos)
    .filter(date => date !== today)
    .sort((a, b) => new Date(a) - new Date(b))
    .map((date) => (
      <div key={date}  className='date_todos_container'>
        <h3 className='date_title'>{date}</h3>
        <ul className='main'>
          { groupedTodos[date]
            .map((todo) => (
                <TodoCard
                  {...props}
                  key={todo.todo_id}  
                  className={todo.description_todo === highlightedRedTodo ? 'highlight_red' : ''}
                  todo={todo}
                  index={todo.todo_id}  
                  highlightedRedTodo={highlightedRedTodo}
                  highlightedBlueTodo={highlightedBlueTodo}
                >
                  <p>{todo.description_todo}</p>
                </TodoCard>
            ))}
        </ul>
      </div>
    ))}
    </div>
  )
}