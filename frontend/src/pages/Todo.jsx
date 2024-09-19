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
    if (!token) return;

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

  // Добавление новой задачи
  const handleAddTodos = async (newTodo) => {
    if (!newTodo) return setError('Please enter a task');
    const token = localStorage.getItem('token');
    const formattedDate = (selectedDate || new Date()).toISOString().slice(0, 19).replace('T', ' ');

    try {
      const response = await axios.post('http://localhost:8081/home', {
        description_todo: newTodo,
        created_at: formattedDate,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { todo_id } = response.data;

      const createdTodo = {
        todo_id,
        description_todo: newTodo,
        created_at: formattedDate,
        completed: false,
        history: [{ action: 'Created', date: formattedDate }],
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

  const handleEditTodoInit = (index) => {
    setEditIndex(index); 
    setTodoValue(todos[index].description_todo); 
  };

  const handleEditTodoSave = async () => {
    if (editIndex === null) return;

    const newTodos = [...todos];
    const previousText = newTodos[editIndex].description_todo;

    if (todoValue === previousText) return;

    const updatedTodo = {
      ...newTodos[editIndex],
      description_todo: todoValue,
      history: [
        ...newTodos[editIndex].history,
        { action: `Edited from "${previousText}" to "${todoValue}"`, date: new Date().toISOString() },
      ],
    };

    try {
      const updatedTaskFromServer = await updateTodoOnServer(updatedTodo);
  
      setTodos((prevTodos) =>
        prevTodos.map((todo, index) =>
          index === editIndex ? updatedTaskFromServer : todo
        )
      );
    } catch (error) {
      console.error('Error saving the updated task:', error);
    } finally {
      setEditIndex(null);
      setTodoValue('');
      setHighlightedBlueTodo(null);
    }
  };

  
  const toggleTaskCompletion = async (index) => {
    const newTodos = [...todos];
    const todoId = newTodos[index]?.todo_id;
  
    if (!todoId) return console.error('Error: Missing todo_id for the task');
  
    newTodos[index].completed = !newTodos[index].completed;
    newTodos[index].history.push({
      action: newTodos[index].completed ? 'Marked as completed' : 'Marked as not completed',
      date: new Date().toISOString(),
    });
  
    setTodos(newTodos);
    await updateTodoOnServer(newTodos[index]);
  };
  

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
