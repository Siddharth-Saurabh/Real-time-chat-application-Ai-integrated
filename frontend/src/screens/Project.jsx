import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from '../config/axios';

const Project = () => {
  const location = useLocation();

  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  // Fetch users
  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('/users/all', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        setUsers(response.data.users); // FIXED
        console.log(response.data);
      })
      .catch(error => {
        console.error('Failed to fetch users:', error);
      });
  }, []);

  // Handle sending message
  const handleSend = () => {
    if (!message.trim()) return;
    const newMsg = {
      email: 'you@example.com',
      text: message,
      sender: 'self'
    };
    setMessages(prev => [...prev, newMsg]);
    setMessage('');
  };

  // Handle user select in modal
  const handleUserSelect = (id) => {
    setSelectedUserId(id);
  };

  return (
    <main className='h-screen w-screen flex'>
      <section className='left h-full flex flex-col min-w-76 bg-gray-100 relative'>
        {/* Header */}
        <header className='flex justify-between items-center p-2 w-full bg-slate-200'>
          <button
            className='flex gap-2'
            onClick={() => setIsModalOpen(true)}
          >
            <i className='ri-add-fill mr-1'></i>
            <p>Add collaborator</p>
          </button>
          <button
            onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
            className='w-10 h-10 flex items-center justify-center rounded-full bg-white text-black hover:bg-slate-300 transition-colors duration-300'
          >
            <i className='ri-group-fill text-lg'></i>
          </button>
        </header>

        {/* Messages Area */}
        <div className='conversation-area flex-grow flex flex-col'>
          <div className='message-box flex-grow overflow-y-auto p-4 flex-col'>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`max-w-56 flex flex-col p-2 bg-white w-fit rounded-md gap-1 mb-1 ${msg.sender === 'self' ? 'ml-auto' : ''} select-none`}
              >
                <small className='opacity-65 text-xs'>{msg.email}</small>
                <p className='text-sm'>{msg.text}</p>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className='input-field flex w-full bg-white p-2'>
            <input
              type="text"
              placeholder='Type a message...'
              className='w-full p-2 px-4 border-none outline-none rounded-lg'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={handleSend} className='px-3'>
              <i className='ri-send-plane-2-fill'></i>
            </button>
          </div>
        </div>

        {/* Side Panel */}
        <div className={`side-panel absolute top-0 left-0 flex flex-col gap-2 w-64 h-full bg-gray-100 transition-transform duration-300 ${isSidePanelOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <header className='flex justify-end p-2 w-full bg-slate-200'>
            <button
              onClick={() => setIsSidePanelOpen(false)}
              className='w-10 h-10 flex items-center justify-center rounded-full bg-white text-black hover:bg-slate-300 transition-colors duration-300'
            >
              <i className='ri-close-fill text-lg'></i>
            </button>
          </header>
          <div className='users overflow-y-auto p-2'>
            {users.map(user => (
              <div
                key={user._id}
                className='user cursor-pointer w-full hover:bg-slate-200 p-2 flex gap-2 items-center'
              >
                <div className='w-10 h-10 flex items-center justify-center rounded-full text-white bg-slate-600'>
                  <i className='ri-user-fill text-lg'></i>
                </div>
                <h1 className='font-semibold text-sm truncate max-w-[150px]'>{user.email}</h1>
              </div>
            ))}
          </div>
        </div>

        {/* Modal for Add Collaborator */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-2 p-6 relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={() => setIsModalOpen(false)}
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
              <h2 className="text-xl font-semibold mb-4">Select a User</h2>
              <ul className="divide-y divide-gray-200 max-h-60 overflow-y-auto">
                {users.map(user => (
                  <li
                    key={user._id}
                    className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-slate-100 rounded transition ${
                      selectedUserId === user._id ? 'bg-slate-200' : ''
                    }`}
                    onClick={() => handleUserSelect(user._id)}
                  >
                    <div className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-600 text-white">
                      <i className="ri-user-fill"></i>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">{user.email}</span>
                      <span className="text-xs text-gray-500">{user.email}</span>
                    </div>
                    {selectedUserId === user._id && (
                      <i className="ri-check-line text-green-600 ml-auto"></i>
                    )}
                  </li>
                ))}
              </ul>
              <button
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                onClick={() => setIsModalOpen(false)}
                disabled={selectedUserId === null}
              >
                Add Collaborator
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

export default Project;
