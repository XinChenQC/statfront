import { useState } from 'react';
import { userService } from '../api/services';
import type { User } from '../types';
import { PasswordModal } from '../components/PasswordModal';
import { UserStatistics } from '../components/UserStatistics';

interface TruncatedTextProps {
  text: string;
  maxLength?: number;
  className?: string;
}

const TruncatedText = ({ text, maxLength = 20, className = '' }: TruncatedTextProps) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  if (!text) return <span className={className}>-</span>;
  
  const shouldTruncate = text.length > maxLength;
  const displayText = shouldTruncate ? `${text.slice(0, maxLength)}...` : text;
  
  if (!shouldTruncate) {
    return <span className={className}>{text}</span>;
  }
  
  return (
    <div className="relative inline-block">
      <span
        className={`cursor-help ${className}`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {displayText}
      </span>
      
      {showTooltip && (
        <div className="absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg bottom-full left-1/2 transform -translate-x-1/2 mb-2 max-w-sm break-words whitespace-normal">
          {text}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
};

type SortField = 'created_at' | 'last_signin';
type SortDirection = 'asc' | 'desc';

export const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'view' | 'download'>('view');
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleViewUsers = async (password: string) => {
    try {
      setLoading(true);
      const response = await userService.getUsers(password);
      if (response.status === 'success') {
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  const handleDownload = async (password: string) => {
    try {
      setLoading(true);
      const blob = await userService.downloadUsers(password);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'users.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading users:', error);
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  const formatId = (id: string) => {
    return id.length > 10 ? `${id.slice(0, 6)}...${id.slice(-4)}` : id;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

/* Sort functionality */
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field with ascending direction
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortedUsers = () => {
    if (!sortField) return users;

    return [...users].sort((a, b) => {
      let aValue: string | Date;
      let bValue: string | Date;

      if (sortField === 'created_at') {
        aValue = new Date(a.created_at);
        bValue = new Date(b.created_at);
      } else {
        // last_signin
        aValue = a.last_signin ? new Date(a.last_signin) : new Date(0);
        bValue = b.last_signin ? new Date(b.last_signin) : new Date(0);
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return (
        <svg className="w-4 h-4 ml-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }

    if (sortDirection === 'asc') {
      return (
        <svg className="w-4 h-4 ml-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      );
    } else {
      return (
        <svg className="w-4 h-4 ml-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Users</h1>
        <div className="space-x-4">
          <button
            onClick={() => {
              setModalType('view');
              setShowModal(true);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            View Users
          </button>
          <button
            onClick={() => {
              setModalType('download');
              setShowModal(true);
            }}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Download Data
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}

      {users.length > 0 && (
        <>
          <UserStatistics users={users} />
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                    onClick={() => handleSort('created_at')}
                  >
                    <div className="flex items-center">
                      Created At
                      {getSortIcon('created_at')}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Industry</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organization</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">VIP</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expertise</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tokens Planned</th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                    onClick={() => handleSort('last_signin')}
                  >
                    <div className="flex items-center">
                      LastSignIn
                      {getSortIcon('last_signin')}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getSortedUsers().map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td 
                      className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 cursor-pointer"
                      onClick={() => copyToClipboard(user.id)}
                      title="Click to copy full ID"
                    >
                      {formatId(user.id)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <TruncatedText text={user.username} maxLength={15} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 cursor-pointer"
                        onClick={() => copyToClipboard(user.email)}
                        title="Click to copy full Email"
                    >
                      <TruncatedText text={user.email} maxLength={25} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <TruncatedText text={user.country} maxLength={12} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <TruncatedText text={user.industry} maxLength={15} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <TruncatedText text={user.organization} maxLength={15} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.vip ? 'Yes' : 'No'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <TruncatedText text={user.expertise} maxLength={20} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <TruncatedText text={user.frequency} maxLength={15} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.tokens_planned?.toString() || '0'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.last_signin?.split('T')[0]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <PasswordModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={modalType === 'view' ? handleViewUsers : handleDownload}
        title={modalType === 'view' ? 'Enter Password to View Users' : 'Enter Password to Download Users'}
      />
    </div>
  );
}; 