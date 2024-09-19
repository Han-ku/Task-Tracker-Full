import React from 'react';
import TodoCard from '../components/TodoCard';

export default function TodoList(props) {
  const { todos, highlightedRedTodo, highlightedBlueTodo } = props;

  console.log('Rendering todos:', todos); // Отладочный вывод для проверки задач

  return (
    <div className='main'>
      <ul className='main'>
        {todos && Array.isArray(todos) && todos.length > 0 ? (
          todos.map((todo, index) => (
            todo && todo.description_todo && (  // Добавлена проверка на существование todo и description_todo
              <TodoCard
                {...props}
                key={todo.todo_id || index}  // Используем index как fallback, если нет todo_id
                className={todo.description_todo === highlightedRedTodo ? 'highlight_red' : ''}
                todo={todo}
                index={index}  // Используем index вместо поиска индекса
                highlightedRedTodo={highlightedRedTodo}
                highlightedBlueTodo={highlightedBlueTodo}
              >
                <p>{todo.description_todo}</p>
              </TodoCard>
            )
          ))
        ) : (
          <li id='no-task'>No tasks available</li>
        )}
      </ul>
    </div>
  );
}