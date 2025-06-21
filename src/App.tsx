import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { UsersPage } from './pages/UsersPage';
import { TasksPage } from './pages/TasksPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex items-center h-16">
              <div className="flex space-x-8">
                <Link
                  to="/users"
                  className="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Users
                </Link>
                <Link
                  to="/tasks"
                  className="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Tasks
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main>
          <Routes>
            <Route path="/users" element={<UsersPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/" element={<UsersPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;