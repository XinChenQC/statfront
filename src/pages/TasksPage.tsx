import { useState } from 'react';
import { taskService } from '../api/services';
import type { Task } from '../types';
import { PasswordModal } from '../components/PasswordModal';

export const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'view' | 'download'>('view');

  const handleViewTasks = async (password: string) => {
    try {
      setIsLoading(true);
      const response = await taskService.getTasks(password);
      if (response.status === 'success') {
        setTasks(response.data);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
    }
  };

  const handleDownload = async (password: string) => {
    try {
      setIsLoading(true);
      const blob = await taskService.downloadTasks(password);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'tasks.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading tasks:', error);
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <div className="space-x-4">
          <button
            onClick={() => {
              setModalType('view');
              setIsModalOpen(true);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            View Tasks
          </button>
          <button
            onClick={() => {
              setModalType('download');
              setIsModalOpen(true);
            }}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Download Excel
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 border-b text-left">ID</th>
                <th className="px-6 py-3 border-b text-left">Title</th>
                <th className="px-6 py-3 border-b text-left">Description</th>
                <th className="px-6 py-3 border-b text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 border-b">{task.id}</td>
                  <td className="px-6 py-4 border-b">{task.title}</td>
                  <td className="px-6 py-4 border-b">{task.description}</td>
                  <td className="px-6 py-4 border-b">{task.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <PasswordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={modalType === 'view' ? handleViewTasks : handleDownload}
        title={modalType === 'view' ? 'View Tasks' : 'Download Tasks'}
      />
    </div>
  );
}; 