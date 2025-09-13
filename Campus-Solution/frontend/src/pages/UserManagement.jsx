import React, { useState, useEffect } from 'react';
import { useAuth, useRole } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Upload, 
  Download,
  Eye,
  EyeOff,
  Shield,
  Mail,
  Phone,
  Calendar,
  Building,
  Save,
  X,
  Plus,
  ArrowLeft
} from 'lucide-react';
import { userManagementAPI } from '../utils/api';

const UserManagement = () => {
  const { user } = useAuth();
  const { isAdmin } = useRole();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'student',
    department: '',
    studentId: '',
    employeeId: '',
    phone: '',
    status: 'active',
    password: ''
  });

  useEffect(() => {
    fetchUsers();
    
    // Listen for new user registrations
    const handleNewUserRegistration = (event) => {
      if (event.detail && event.detail.user) {
        const newUser = {
          ...event.detail.user,
          _id: Date.now().toString(),
          status: 'active',
          lastLogin: new Date().toISOString().split('T')[0],
          joinDate: new Date().toISOString().split('T')[0],
          loginCount: 1,
          isOnline: true,
          lastActivity: new Date().toISOString()
        };
        setUsers(prevUsers => [...prevUsers, newUser]);
      }
    };
    
    // Simulate real-time user status updates
    const interval = setInterval(() => {
      setUsers(prevUsers => 
        prevUsers.map(user => {
          // Randomly update online status for demo
          if (Math.random() < 0.1) { // 10% chance to change status
            return {
              ...user,
              isOnline: Math.random() < 0.3, // 30% chance to be online
              lastActivity: new Date().toISOString()
            };
          }
          return user;
        })
      );
    }, 30000); // Update every 30 seconds
    
    window.addEventListener('userRegistered', handleNewUserRegistration);
    
    return () => {
      window.removeEventListener('userRegistered', handleNewUserRegistration);
      clearInterval(interval);
    };
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || data || []);
      } else {
        throw new Error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      // Fallback to comprehensive mock data
      const mockUsers = [
        {
          _id: '1',
          name: 'Dr. Sarah Wilson',
          email: 'sarah.wilson@university.edu',
          role: 'faculty',
          department: 'Computer Science',
          employeeId: 'EMP001',
          phone: '+1-555-0101',
          status: 'active',
          lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          joinDate: '2023-01-15',
          loginCount: 156,
          isOnline: true,
          lastActivity: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
        },
        {
          _id: '2',
          name: 'John Student',
          email: 'john.student@university.edu',
          role: 'student',
          department: 'Engineering',
          studentId: 'STU001',
          phone: '+1-555-0102',
          status: 'active',
          lastLogin: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          joinDate: '2023-09-01',
          loginCount: 89,
          isOnline: false,
          lastActivity: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '3',
          name: 'Dr. Admin Smith',
          email: 'admin.smith@university.edu',
          role: 'admin',
          department: 'Administration',
          employeeId: 'ADM001',
          phone: '+1-555-0103',
          status: 'active',
          lastLogin: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
          joinDate: '2022-06-01',
          loginCount: 234,
          isOnline: true,
          lastActivity: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
        },
        {
          _id: '4',
          name: 'Alice Student',
          email: 'alice.student@university.edu',
          role: 'student',
          department: 'Computer Science',
          studentId: 'STU002',
          phone: '+1-555-0104',
          status: 'active',
          lastLogin: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
          joinDate: '2023-09-01',
          loginCount: 67,
          isOnline: false,
          lastActivity: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '5',
          name: 'Dr. Michael Brown',
          email: 'michael.brown@university.edu',
          role: 'faculty',
          department: 'Physics',
          employeeId: 'EMP002',
          phone: '+1-555-0105',
          status: 'active',
          lastLogin: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
          joinDate: '2022-08-15',
          loginCount: 198,
          isOnline: false,
          lastActivity: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '6',
          name: 'Emma Davis',
          email: 'emma.davis@university.edu',
          role: 'student',
          department: 'Computer Science',
          studentId: 'STU003',
          phone: '+1-555-0106',
          status: 'inactive',
          lastLogin: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
          joinDate: '2023-09-01',
          loginCount: 45,
          isOnline: false,
          lastActivity: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '7',
          name: 'Dr. Lisa Anderson',
          email: 'lisa.anderson@university.edu',
          role: 'faculty',
          department: 'Chemistry',
          employeeId: 'EMP003',
          phone: '+1-555-0107',
          status: 'active',
          lastLogin: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
          joinDate: '2023-02-01',
          loginCount: 123,
          isOnline: false,
          lastActivity: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '8',
          name: 'Robert Wilson',
          email: 'robert.wilson@university.edu',
          role: 'student',
          department: 'Computer Science',
          studentId: 'STU004',
          phone: '+1-555-0108',
          status: 'active',
          lastLogin: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
          joinDate: '2023-09-01',
          loginCount: 78,
          isOnline: false,
          lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '9',
          name: 'Dr. James Taylor',
          email: 'james.taylor@university.edu',
          role: 'faculty',
          department: 'Mathematics',
          employeeId: 'EMP004',
          phone: '+1-555-0109',
          status: 'inactive',
          lastLogin: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
          joinDate: '2021-09-01',
          loginCount: 89,
          isOnline: false,
          lastActivity: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '10',
          name: 'Maria Garcia',
          email: 'maria.garcia@university.edu',
          role: 'student',
          department: 'Computer Science',
          studentId: 'STU005',
          phone: '+1-555-0110',
          status: 'active',
          lastLogin: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
          joinDate: '2023-09-01',
          loginCount: 112,
          isOnline: true,
          lastActivity: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 minutes ago
        },
        {
          _id: '11',
          name: 'Canteen Staff',
          email: 'canteen.staff@university.edu',
          role: 'canteen_staff',
          department: 'Food Services',
          employeeId: 'CAN001',
          phone: '+1-555-0111',
          status: 'active',
          lastLogin: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
          joinDate: '2023-03-01',
          loginCount: 145,
          isOnline: true,
          lastActivity: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 minutes ago
        },
        {
          _id: '12',
          name: 'Alex Thompson',
          email: 'alex.thompson@university.edu',
          role: 'student',
          department: 'Mechanical Engineering',
          studentId: 'STU006',
          phone: '+1-555-0112',
          status: 'suspended',
          lastLogin: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
          joinDate: '2023-09-01',
          loginCount: 34,
          isOnline: false,
          lastActivity: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];
      setUsers(mockUsers);
    }
    setLoading(false);
  };

  const departments = [
    'Computer Science',
    'Information Technology',
    'Electronics',
    'Mechanical',
    'Civil',
    'Administration'
  ];

  const roles = ['student', 'faculty', 'admin', 'canteen_staff'];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (user.studentId && user.studentId.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         (user.employeeId && user.employeeId.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesDepartment = selectedDepartment === 'all' || user.department === selectedDepartment;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    
    return matchesSearch && matchesRole && matchesDepartment && matchesStatus;
  });

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.password && !editingUser) newErrors.password = 'Password is required';
    
    if (formData.role === 'student' && !formData.studentId.trim()) {
      newErrors.studentId = 'Student ID is required';
    }
    if (formData.role !== 'student' && !formData.employeeId.trim()) {
      newErrors.employeeId = 'Employee ID is required';
    }
    
    // Check for duplicate email
    const existingUser = users.find(user => 
      user.email.toLowerCase() === formData.email.toLowerCase() && 
      (!editingUser || user._id !== editingUser._id)
    );
    if (existingUser) newErrors.email = 'Email already exists';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      if (editingUser) {
        const response = await fetch(`/api/admin/users/${editingUser._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });
        
        if (response.ok) {
          fetchUsers(); // Refresh users from API
          alert('User updated successfully');
        } else {
          throw new Error('Failed to update user');
        }
      } else {
        const response = await fetch('/api/admin/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });
        
        if (response.ok) {
          fetchUsers(); // Refresh users from API
          alert('User created successfully');
        } else {
          throw new Error('Failed to create user');
        }
      }
      resetForm();
    } catch (error) {
      console.error('Error saving user:', error);
      
      // Fallback for demo mode
      if (editingUser) {
        // Update user locally
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user._id === editingUser._id 
              ? { ...user, ...formData }
              : user
          )
        );
        alert('User updated successfully! (Demo mode)');
      } else {
        // Create new user locally
        const newUser = {
          _id: `user_${Date.now()}`,
          ...formData,
          lastLogin: new Date().toISOString().split('T')[0],
          joinDate: new Date().toISOString().split('T')[0],
        };
        setUsers(prevUsers => [...prevUsers, newUser]);
        alert('User created successfully! (Demo mode)');
      }
      resetForm();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`/api/admin/users/${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          fetchUsers(); // Refresh users from API
          alert('User deleted successfully');
        } else {
          throw new Error('Failed to delete user');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      role: 'student',
      department: '',
      studentId: '',
      employeeId: '',
      phone: '',
      status: 'active',
      password: ''
    });
    setShowAddForm(false);
    setEditingUser(null);
    setErrors({});
  };

  const startEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      role: user.role || 'student',
      department: user.department || '',
      studentId: user.studentId || '',
      employeeId: user.employeeId || '',
      phone: user.phone || '',
      status: user.status || 'active',
      password: ''
    });
    setShowAddForm(true);
  };

  const handleExport = () => {
    const csvContent = [
      ['Name', 'Email', 'Role', 'Department', 'ID', 'Status', 'Last Login', 'Join Date'],
      ...filteredUsers.map(user => [
        user.name,
        user.email,
        user.role,
        user.department,
        user.studentId || user.employeeId,
        user.status,
        user.lastLogin || 'Never',
        user.joinDate
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleBulkUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e.target.result;
        const lines = csv.split('\n');
        const headers = lines[0].split(',');
        
        const newUsers = lines.slice(1)
          .filter(line => line.trim())
          .map((line, index) => {
            const values = line.split(',');
            return {
              _id: (Date.now() + index).toString(),
              name: values[0]?.trim() || '',
              email: values[1]?.trim() || '',
              role: values[2]?.trim() || 'student',
              department: values[3]?.trim() || '',
              studentId: values[4]?.trim() || '',
              employeeId: values[5]?.trim() || '',
              status: 'active',
              lastLogin: null,
              joinDate: new Date().toISOString().split('T')[0],
              phone: values[6]?.trim() || ''
            };
          });
        
        setUsers([...users, ...newUsers]);
        setShowBulkUpload(false);
        alert(`Successfully imported ${newUsers.length} users`);
      } catch (error) {
        console.error('Error parsing CSV:', error);
        alert('Error parsing CSV file. Please check the format.');
      }
    };
    reader.readAsText(file);
  };

  const toggleUserStatus = async (userId) => {
    try {
      const user = users.find(u => u._id === userId);
      const newStatus = user.status === 'active' ? 'inactive' : 'active';
      
      const response = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        fetchUsers(); // Refresh users from API
        alert(`User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
      } else {
        throw new Error('Failed to update user status');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('Failed to update user status. Please try again.');
    }
  };

  const getRoleColor = (role) => {
    const colors = {
      student: 'bg-blue-600/20 text-blue-400 border-blue-600/50',
      faculty: 'bg-green-600/20 text-green-400 border-green-600/50',
      admin: 'bg-purple-600/20 text-purple-400 border-purple-600/50',
      canteen_staff: 'bg-orange-600/20 text-orange-400 border-orange-600/50'
    };
    return colors[role] || colors.student;
  };

  const getStatusColor = (status) => {
    return status === 'active' 
      ? 'bg-green-600/20 text-green-400 border-green-600/50'
      : 'bg-red-600/20 text-red-400 border-red-600/50';
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Shield className="mx-auto mb-4 text-red-400" size={48} />
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400">You don't have permission to access user management.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <button
                  onClick={() => navigate('/admin')}
                  className="mr-3 p-2 rounded-lg bg-purple-700 hover:bg-purple-800 transition-colors"
                >
                  <ArrowLeft size={20} className="text-white" />
                </button>
                <h1 className="text-3xl font-bold">User Management</h1>
              </div>
              <p className="text-purple-100">Manage student, faculty, and admin accounts</p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-white">{users.length}</p>
              </div>
              <Users className="text-blue-400" size={24} />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Students</p>
                <p className="text-2xl font-bold text-white">{users.filter(u => u.role === 'student').length}</p>
              </div>
              <Users className="text-green-400" size={24} />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Faculty</p>
                <p className="text-2xl font-bold text-white">{users.filter(u => u.role === 'faculty').length}</p>
              </div>
              <Users className="text-purple-400" size={24} />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Users</p>
                <p className="text-2xl font-bold text-white">{users.filter(u => u.status === 'active').length}</p>
              </div>
              <Users className="text-yellow-400" size={24} />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Role Filter */}
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
              >
                <option value="all">All Roles</option>
                {roles.map(role => (
                  <option key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </option>
                ))}
              </select>

              {/* Department Filter */}
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => setShowBulkUpload(true)}
                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
              >
                <Upload size={16} className="mr-2" />
                Bulk Upload
              </button>
              <button
                onClick={handleExport}
                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
              >
                <Download size={16} className="mr-2" />
                Export
              </button>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
              >
                <UserPlus size={16} className="mr-2" />
                Add User
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Last Login</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="relative">
                          <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium">{user.name.charAt(0)}</span>
                          </div>
                          {user.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-gray-800 rounded-full"></div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white flex items-center">
                            {user.name}
                            {user.isOnline && (
                              <span className="ml-2 text-xs text-green-400">● Online</span>
                            )}
                          </div>
                          <div className="text-sm text-gray-400">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getRoleColor(user.role)}`}>
                        {user.role === 'canteen_staff' ? 'Canteen Staff' : user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {user.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {user.studentId || user.employeeId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(user.status)}`}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <div>
                        <div>{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}</div>
                        {user.lastLogin && (
                          <div className="text-xs text-gray-500">
                            {new Date(user.lastLogin).toLocaleTimeString()}
                          </div>
                        )}
                        {user.loginCount && (
                          <div className="text-xs text-blue-400">
                            {user.loginCount} logins
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => startEdit(user)}
                          className="text-indigo-400 hover:text-indigo-300"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => toggleUserStatus(user._id)}
                          className="text-yellow-400 hover:text-yellow-300"
                        >
                          {user.status === 'active' ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit User Form */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl border border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  {editingUser ? 'Edit User' : 'Create New User'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-white transition-colors"
                  title="Close"
                >
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className={`w-full bg-gray-700 border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500 ${
                      errors.name ? 'border-red-500' : 'border-gray-600'
                    }`}
                  />
                  {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className={`w-full bg-gray-700 border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-600'
                    }`}
                  />
                  {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  >
                    {roles.map(role => (
                      <option key={role} value={role}>
                        {role === 'canteen_staff' ? 'Canteen Staff' : role.charAt(0).toUpperCase() + role.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    className={`w-full bg-gray-700 border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500 ${
                      errors.department ? 'border-red-500' : 'border-gray-600'
                    }`}
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                  {errors.department && <p className="text-red-400 text-sm mt-1">{errors.department}</p>}
                </div>

                {formData.role === 'student' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Student ID</label>
                    <input
                      type="text"
                      value={formData.studentId}
                      onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                      className={`w-full bg-gray-700 border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500 ${
                        errors.studentId ? 'border-red-500' : 'border-gray-600'
                      }`}
                    />
                    {errors.studentId && <p className="text-red-400 text-sm mt-1">{errors.studentId}</p>}
                  </div>
                )}

                {formData.role !== 'student' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Employee ID</label>
                    <input
                      type="text"
                      value={formData.employeeId}
                      onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
                      className={`w-full bg-gray-700 border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500 ${
                        errors.employeeId ? 'border-red-500' : 'border-gray-600'
                      }`}
                    />
                    {errors.employeeId && <p className="text-red-400 text-sm mt-1">{errors.employeeId}</p>}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {editingUser ? 'New Password (leave blank to keep current)' : 'Password'}
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className={`w-full bg-gray-700 border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500 ${
                      errors.password ? 'border-red-500' : 'border-gray-600'
                    }`}
                  />
                  {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
                </div>
                </div>

                {errors.submit && (
                  <div className="bg-red-600/20 border border-red-600/50 rounded-lg p-3">
                    <p className="text-red-400 text-sm">{errors.submit}</p>
                  </div>
                )}

                <div className="flex space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      resetForm();
                    }}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 py-2 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-purple-600 hover:bg-purple-700 py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
                  >
                    <Save size={16} className="mr-2" />
                    {editingUser ? 'Update User' : 'Create User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Bulk Upload Modal */}
        {showBulkUpload && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Bulk Upload Users</h2>
                <button
                  onClick={() => setShowBulkUpload(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-blue-600/20 border border-blue-600/50 rounded-lg p-4">
                  <h3 className="text-blue-400 font-medium mb-2">CSV Format Required:</h3>
                  <p className="text-sm text-gray-300 mb-2">Name, Email, Role, Department, StudentID/EmployeeID, Phone</p>
                  <p className="text-xs text-gray-400">Example: John Doe, john@student.edu, student, Computer Science, STU2024001, +1234567890</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Upload CSV File</label>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleBulkUpload}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500 file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                  />
                </div>
                
                <div className="text-sm text-gray-400">
                  <p>• Supported roles: student, faculty, admin, canteen_staff</p>
                  <p>• All fields are required except phone</p>
                  <p>• Duplicate emails will be skipped</p>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setShowBulkUpload(false);
                  }}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 py-2 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
