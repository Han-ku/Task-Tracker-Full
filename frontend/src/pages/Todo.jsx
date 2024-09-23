import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import TodoInput from '../components/TodoInput';
import TodoList from '../components/TodoList';
import DatePickerComponent from '../components/DatePickerComponent';
import axios from 'axios';

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [todoValue, setTodoValue] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [error, setError] = useState('');
  const highlightedRedTodo = useState(null);
  const [highlightedBlueTodo, setHighlightedBlueTodo] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const datePickerRef = useRef(null);
  const navigate = useNavigate();

  // Получение задач
  const fetchTodos = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found, redirecting to login...');
      navigate('/');
      return;
    }

    try {
      const response = await axios.get('http://localhost:8081/home', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos(response.data.todos || []);
    } catch (error) {
      console.error('Error fetching todos:', error);
      if (error.response && error.response.status === 401) navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleLogout = async() => {
    localStorage.removeItem('token')
    navigate('/')
  }

  const formatDateForMySQL = (date) => {
    if (!date) {
      return null; 
  }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

  // Добавление новой задачи
  const handleAddTodos = async (newTodo) => {
    if (!newTodo) return setError('Please enter a task');
    const token = localStorage.getItem('token');
    const today = new Date()

    if(selectedDate === null) today.setHours(23, 59, 59);

    const formattedDate = selectedDate ? formatDateForMySQL(selectedDate) : formatDateForMySQL(today)
    try {
      const response = await axios.post('http://localhost:8081/home', {
        description_todo: newTodo,
        due_date: formattedDate,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { todo_id } = response.data;

      const createdTodo = {
        todo_id,
        description_todo: newTodo,
        due_date: formattedDate,
        completed: false,
        history: 
          [{action: 'Created', date: formatDateForMySQL(new Date())},
          { action: 'Complete until', date: formattedDate }],
      };
      setTodos((prevTodos) => [...prevTodos, createdTodo]);
      setError('');
    } catch (error) {
      console.error('Error adding todo:', error);
    } finally {
      setSelectedDate(null);
    }
  };

  // Удаление задачи
  const handleDeleteTodo = async (index) => {
    if (editIndex !== null) return setError('Cannot delete while editing');
    const token = localStorage.getItem('token');
    const todoToDelete = todos[index];

    try {
      await axios.delete(`http://localhost:8081/home/${todoToDelete.todo_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos((prevTodos) => prevTodos.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  // Обновление задачи
  const updateTodoOnServer = async (todo) => {
    try {
      const response = await axios.put(`http://localhost:8081/home/${todo.todo_id}`, todo, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      return response.data.updatedTodo; 
    } catch (error) {
      console.error('Error updating todo:', error);
      throw error; 
    }
  };

  const handleEditTodoInit = (todo_id) => {
    const todo = todos.find((todo) => todo.todo_id === todo_id)

    if (!todo) {
      console.error('Invalid todo id:', todo_id)
      return
    }

    setEditIndex(todo_id)
    setTodoValue(todo.description_todo)
  }

  const handleEditTodoSave = async () => {
    if (editIndex === null) return;

    const todoIndex = todos.findIndex((todo) => todo.todo_id === editIndex)
    if (todoIndex === -1) {
      console.error('Todo not found for editing')
      return
    }

    const newTodos = [...todos]
    const previousText = newTodos[todoIndex].description_todo
    const previousDueDate = newTodos[todoIndex].due_date

    const formattedDueDate = selectedDate
      ? formatDateForMySQL(new Date(selectedDate))
      : formatDateForMySQL(new Date(previousDueDate))

    if (todoValue === previousText && !formattedDueDate) return

    const updatedTodo = {
      ...newTodos[todoIndex],
      description_todo: todoValue,
      due_date: formattedDueDate,
      history: [
        ...newTodos[todoIndex].history,
        { action: `Edited from "${previousText}" to "${todoValue}"`, date: formatDateForMySQL(new Date())},
      
      ],
    }

    try {
      const updatedTaskFromServer = await updateTodoOnServer(updatedTodo);
  
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.todo_id === editIndex ? updatedTaskFromServer : todo
        )
      )
    } catch (error) {
      console.error('Error saving the updated task:', error)
    } finally {
      setEditIndex(null)
      setTodoValue('')
      setHighlightedBlueTodo(null)
      setSelectedDate(null)
    }
  }

  
  const toggleTaskCompletion = async (todoId) => {
    if (!todoId) return console.error('Error: Missing todo_id for the task')
  
    const updatedTodos = todos.map((todo) => {
      if (todo.todo_id === todoId) {
        return {
          ...todo,
          completed: !todo.completed,
          history: [
            ...todo.history,
            {
              action: todo.completed ? 'Marked as not completed' : 'Marked as completed',
              date: formatDateForMySQL(new Date()),
            },
          ],
        };
      }
      return todo
    })

    setTodos(updatedTodos)

    const updatedTask = updatedTodos.find((todo) => todo.todo_id === todoId)

    try {
      await updateTodoOnServer(updatedTask)
    } catch (error) {
      console.error('Error updating todo:', error)
    }
  }
  

  // Закрытие DatePicker при клике вне его
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setShowDatePicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <div className='logout'>
        <button onClick={handleLogout}>
          <img src="/logout.png" alt="Logout" />
        </button>
      </div>
      <TodoInput
        handleAddTodos={handleAddTodos}
        todoValue={todoValue}
        setTodoValue={setTodoValue}
        handleEditTodoSave={handleEditTodoSave}
        editIndex={editIndex}
        setShowDatePicker={setShowDatePicker}
        selectedDate={selectedDate}
      />
      <p className={`error ${error ? '' : 'error-hidden'}`}>{error}</p>
      <TodoList
        todos={todos}
        highlightedRedTodo={highlightedRedTodo}
        highlightedBlueTodo={highlightedBlueTodo}
        handleDeleteTodo={handleDeleteTodo}
        handleEditTodoInit={handleEditTodoInit}
        toggleTaskCompletion={toggleTaskCompletion}
        isEditing={editIndex !== null}
      />
      {showDatePicker && (
        <div ref={datePickerRef} className="date-picker-modal">
          <DatePickerComponent selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
        </div>
      )}
    </>
  );
};

export default Todo;
