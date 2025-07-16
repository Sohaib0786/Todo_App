import 'bootstrap-icons/font/bootstrap-icons.css';
import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  updateDoc,
  doc,
  query,
  where
} from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const TodoApp = () => {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const user = auth.currentUser;
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'tasks'), where('uid', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(items);
    });

    return () => unsubscribe();
  }, [user]);

  const handleAdd = async () => {
    if (task.trim() === '') return;

    await addDoc(collection(db, 'tasks'), {
      text: task,
      completed: false,
      uid: user.uid,
    });

    setTask('');
  };

  const toggleComplete = async (id, current) => {
    await updateDoc(doc(db, 'tasks', id), {
      completed: !current,
    });
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'tasks', id));
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-dark">
      <div className="bg-white rounded shadow d-flex flex-column justify-content-between"
        style={{ width: '100%', maxWidth: '400px', height: '90vh' }}
      >
        {/* Top Section */}
        <div className="p-4 border-bottom">
          <h4 className="fw-bold mb-4">My Tasks</h4>
         
          {/* Task Input */}
          <div className="input-group mb-4">
            <input
              type="text"
              className="form-control"
              placeholder="Add a new task..."
              value={task}
              onChange={(e) => setTask(e.target.value)}
            />
            <button type="button" className="btn btn-dark" onClick={handleAdd}>
              <i className="bi bi-plus-lg"></i>
            </button>
          </div>

          {/* Task List */}
          <div className="task-list">
            {tasks.map((t) => (
              <div
                key={t.id}
                className="d-flex justify-content-between align-items-center p-2 mb-2 border rounded bg-light shadow-sm"
              >
                <div className="d-flex align-items-center">
                  <input
                    className="form-check-input me-2"
                    type="checkbox"
                    checked={t.completed}
                    onChange={() => toggleComplete(t.id, t.completed)}
                    id={`task-${t.id}`}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`task-${t.id}`}
                    style={{
                      textDecoration: t.completed ? 'line-through' : 'none',
                      color: t.completed ? 'gray' : 'black',
                      fontWeight: '500',
                    }}
                  >
                    {t.text}
                  </label>
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => handleDelete(t.id)}
                  title="Delete"
                >
                  <i className="bi bi-trash3-fill"></i>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="border-top d-flex justify-content-around py-2 bg-light">
          <div className="text-center" onClick={() => navigate('/todo')} style={{ cursor: 'pointer' }}>
            <i className="bi bi-list-task fs-5"></i><br />
            <span className="small">To-Do</span>
          </div>
          <div className="text-center" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
            <i className="bi bi-person fs-5"></i><br />
            <span className="small">Profile</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoApp;
