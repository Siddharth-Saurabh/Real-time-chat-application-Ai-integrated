import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../context/user.context.jsx';
import axios from '../config/axios.js';
import { useNavigate } from 'react-router-dom';


const Home = () => {
  const { user } = useContext(UserContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projects, setProjects] = useState([]);

  const navigate = useNavigate();
  const fetchProjects = () => {
    if (!user?.token) return;

    axios
      .get('/projects/all', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        console.log("Projects fetched:", res.data);
        setProjects(res.data.projects);
      })
      .catch((err) => {
        console.error("Error fetching projects:", err.response?.data || err.message);
      });
  };

useEffect(() => {
  if (!user?.token) return;

  axios
    .get('/projects/all', {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
    .then((res) => {
      console.log("Projects fetched:", res.data.projects);
      res.data.projects.forEach(p => {
        console.log("Project:", p.name, "Users:", p.users);
      });
      setProjects(res.data.projects);
      setIsModalOpen(false);
    })
    .catch((err) => {
      console.error("Error fetching projects:", err.response?.data || err.message);
    });
}, [user?.token]);


  const createProject = (e) => {
    e.preventDefault();

    if (!user || !user.token) {
      console.log("User not logged in");
      return;
    }

    axios.post(
      '/projects/create',
      { name: projectName },
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    )
      .then((res) => {
        console.log("Project created:", res.data);
        setIsModalOpen(false);
        setProjectName('');
        fetchProjects();
      })
      .catch((err) => {
        console.error("Error creating project:", err.response?.data || err.message);
      });
  };

  return (
    <main className="p-4">
      <div className="projects flex flex-wrap gap-3">
        <button
          onClick={() => setIsModalOpen(true)}
          className="project p-4 border border-slate-300 rounded-md"
        >
          New Project
          <i className="ri-link ml-2"></i>
        </button>

        {projects.map((project) => (
  <div
    key={project._id}
    onClick={() => navigate('/Project', { state: { project } })}
    className="project p-4 border flex flex-col gap-2 cursor-pointer border-slate-300 rounded-md mb-4 min-w-52 hover:shadow-lg transition-shadow duration-200"
  >
    <h3 className="text-lg font-semibold">{project.name}</h3>
    <div className="flex gap-2 text-sm text-gray-600">
      <span>{project.users?.length ?? 0} {project.users?.length === 1 ? 'User' : 'Users'}</span>
      <p>collaborators: <i className="ri-user-line"></i></p>
    </div>
  </div>
))}


      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Create Project</h2>
            <form onSubmit={createProject}>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Project Name
              </label>
              <input
                type="text"
                onChange={(e) => setProjectName(e.target.value)}
                value={projectName}
                className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter project name"
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default Home;
