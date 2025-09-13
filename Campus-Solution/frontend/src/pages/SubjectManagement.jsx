import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import { subjectsAPI } from '../utils/api';
import { 
  Plus, 
  Edit, 
  Trash2, 
  BookOpen, 
  Users, 
  Clock, 
  Award, 
  Search,
  Filter,
  Save,
  X,
  User,
  Calendar,
  Target,
  CheckCircle
} from 'lucide-react';

const SubjectManagement = () => {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [availableFaculty, setAvailableFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterSemester, setFilterSemester] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    department: '',
    semester: 1,
    credits: 3,
    weeklyHours: 4,
    lectureHours: 3,
    labHours: 1,
    tutorialHours: 0,
    type: 'core',
    category: 'theory',
    prerequisites: [],
    maxStudents: 60,
    minStudents: 5,
    assignedFaculty: [],
    syllabus: '',
    objectives: [''],
    outcomes: [''],
    assessmentPattern: {
      internal: 40,
      external: 60,
      practical: 0
    },
    academicYear: '2024-25'
  });

  const departments = [
    'Computer Science', 'Information Technology', 'Electronics', 'Mechanical',
    'Civil', 'Electrical', 'Mathematics', 'Physics', 'Chemistry', 'Management'
  ];

  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

  useEffect(() => {
    fetchSubjects();
    if (user?.role === 'admin') {
      fetchAvailableFaculty();
    }
  }, []);

  const fetchSubjects = async () => {
    try {
      const data = await subjectsAPI.getAll();
      setSubjects(data || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      // Mock data for demo
      setSubjects([
        {
          _id: '1',
          name: 'Data Structures and Algorithms',
          code: 'CS301',
          department: 'Computer Science',
          semester: 3,
          credits: 4,
          weeklyHours: 5,
          lectureHours: 3,
          labHours: 2,
          type: 'core',
          category: 'mixed',
          maxStudents: 60,
          assignedFaculty: [{ name: 'Dr. Smith', _id: 'f1' }],
          academicYear: '2024-25',
          isActive: true
        },
        {
          _id: '2',
          name: 'Database Management Systems',
          code: 'CS401',
          department: 'Computer Science',
          semester: 4,
          credits: 3,
          weeklyHours: 4,
          lectureHours: 3,
          labHours: 1,
          type: 'core',
          category: 'mixed',
          maxStudents: 50,
          assignedFaculty: [{ name: 'Prof. Johnson', _id: 'f2' }],
          academicYear: '2024-25',
          isActive: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableFaculty = async () => {
    try {
      const data = await subjectsAPI.getAvailableFaculty();
      setAvailableFaculty(data || []);
    } catch (error) {
      console.error('Error fetching faculty:', error);
      // Mock faculty data
      setAvailableFaculty([
        { _id: 'f1', name: 'Dr. Smith', email: 'smith@university.edu' },
        { _id: 'f2', name: 'Prof. Johnson', email: 'johnson@university.edu' },
        { _id: 'f3', name: 'Dr. Wilson', email: 'wilson@university.edu' }
      ]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSubject) {
        await subjectsAPI.update(editingSubject._id, formData);
        // For demo mode, update local state
        setSubjects(subjects.map(subject => 
          subject._id === editingSubject._id ? { ...subject, ...formData } : subject
        ));
        alert('Subject updated successfully (demo mode)');
      } else {
        await subjectsAPI.create(formData);
        // For demo mode, add to local state
        const newSubject = {
          _id: Date.now().toString(),
          ...formData,
          academicYear: '2024-25',
          isActive: true
        };
        setSubjects([...subjects, newSubject]);
        alert('Subject created successfully (demo mode)');
      }
      fetchSubjects();
      resetForm();
    } catch (error) {
      console.error('Error saving subject:', error);
      // Handle demo mode fallback above
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      try {
        await subjectsAPI.delete(id);
        fetchSubjects();
      } catch (error) {
        console.error('Error deleting subject:', error);
        // For demo mode, remove from local state
        setSubjects(subjects.filter(subject => subject._id !== id));
        alert('Subject deleted successfully (demo mode)');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      description: '',
      department: '',
      semester: 1,
      credits: 3,
      weeklyHours: 4,
      lectureHours: 3,
      labHours: 1,
      tutorialHours: 0,
      type: 'core',
      category: 'theory',
      prerequisites: [],
      maxStudents: 60,
      minStudents: 5,
      assignedFaculty: [],
      syllabus: '',
      objectives: [''],
      outcomes: [''],
      assessmentPattern: {
        internal: 40,
        external: 60,
        practical: 0
      },
      academicYear: '2024-25'
    });
    setShowAddForm(false);
    setEditingSubject(null);
  };

  const startEdit = (subject) => {
    setEditingSubject(subject);
    setFormData({
      name: subject.name || '',
      code: subject.code || '',
      description: subject.description || '',
      department: subject.department || '',
      semester: subject.semester || 1,
      credits: subject.credits || 3,
      weeklyHours: subject.weeklyHours || 4,
      lectureHours: subject.lectureHours || 3,
      labHours: subject.labHours || 1,
      tutorialHours: subject.tutorialHours || 0,
      type: subject.type || 'core',
      category: subject.category || 'theory',
      prerequisites: subject.prerequisites || [],
      maxStudents: subject.maxStudents || 60,
      minStudents: subject.minStudents || 5,
      assignedFaculty: subject.assignedFaculty?.map(f => f._id) || [],
      syllabus: subject.syllabus || '',
      objectives: subject.objectives?.length ? subject.objectives : [''],
      outcomes: subject.outcomes?.length ? subject.outcomes : [''],
      assessmentPattern: subject.assessmentPattern || {
        internal: 40,
        external: 60,
        practical: 0
      },
      academicYear: subject.academicYear || '2024-25'
    });
    setShowAddForm(true);
  };

  const addObjective = () => {
    setFormData({
      ...formData,
      objectives: [...formData.objectives, '']
    });
  };

  const updateObjective = (index, value) => {
    const newObjectives = [...formData.objectives];
    newObjectives[index] = value;
    setFormData({ ...formData, objectives: newObjectives });
  };

  const removeObjective = (index) => {
    const newObjectives = formData.objectives.filter((_, i) => i !== index);
    setFormData({ ...formData, objectives: newObjectives });
  };

  const addOutcome = () => {
    setFormData({
      ...formData,
      outcomes: [...formData.outcomes, '']
    });
  };

  const updateOutcome = (index, value) => {
    const newOutcomes = [...formData.outcomes];
    newOutcomes[index] = value;
    setFormData({ ...formData, outcomes: newOutcomes });
  };

  const removeOutcome = (index) => {
    const newOutcomes = formData.outcomes.filter((_, i) => i !== index);
    setFormData({ ...formData, outcomes: newOutcomes });
  };

  const filteredSubjects = subjects.filter(subject => {
    const matchesSearch = subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subject.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !filterDepartment || subject.department === filterDepartment;
    const matchesSemester = !filterSemester || subject.semester === parseInt(filterSemester);
    
    return matchesSearch && matchesDepartment && matchesSemester;
  });

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Subject Management</h1>
            <p className="text-gray-400">Manage academic subjects and course details</p>
          </div>
          {user?.role === 'admin' && (
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus size={20} />
              <span>Add Subject</span>
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search subjects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            
            <select
              value={filterSemester}
              onChange={(e) => setFilterSemester(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Semesters</option>
              {semesters.map(sem => (
                <option key={sem} value={sem}>Semester {sem}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">
                {editingSubject ? 'Edit Subject' : 'Add New Subject'}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Subject Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Subject Code</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., CS301"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Semester</label>
                  <select
                    value={formData.semester}
                    onChange={(e) => setFormData({...formData, semester: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {semesters.map(sem => (
                      <option key={sem} value={sem}>Semester {sem}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Course Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Credits</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.credits}
                    onChange={(e) => setFormData({...formData, credits: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Weekly Hours</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.weeklyHours}
                    onChange={(e) => setFormData({...formData, weeklyHours: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Hours Breakdown */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Hours Breakdown</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Lecture Hours</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.lectureHours}
                      onChange={(e) => setFormData({...formData, lectureHours: parseInt(e.target.value)})}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Lab Hours</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.labHours}
                      onChange={(e) => setFormData({...formData, labHours: parseInt(e.target.value)})}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Tutorial Hours</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.tutorialHours}
                      onChange={(e) => setFormData({...formData, tutorialHours: parseInt(e.target.value)})}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Type and Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="core">Core</option>
                    <option value="elective">Elective</option>
                    <option value="mandatory">Mandatory</option>
                    <option value="optional">Optional</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="theory">Theory</option>
                    <option value="practical">Practical</option>
                    <option value="mixed">Mixed</option>
                  </select>
                </div>
              </div>

              {/* Faculty Assignment */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Assigned Faculty</label>
                <select
                  multiple
                  value={formData.assignedFaculty}
                  onChange={(e) => setFormData({
                    ...formData, 
                    assignedFaculty: Array.from(e.target.selectedOptions, option => option.value)
                  })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                >
                  {availableFaculty.map(faculty => (
                    <option key={faculty._id} value={faculty._id}>
                      {faculty.name} ({faculty.email})
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-400 mt-1">Hold Ctrl/Cmd to select multiple faculty</p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
              </div>

              {/* Learning Objectives */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Learning Objectives</label>
                {formData.objectives.map((objective, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={objective}
                      onChange={(e) => updateObjective(index, e.target.value)}
                      className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={`Objective ${index + 1}`}
                    />
                    {formData.objectives.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeObjective(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addObjective}
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  + Add Objective
                </button>
              </div>

              {/* Assessment Pattern */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Assessment Pattern</label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Internal (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.assessmentPattern.internal}
                      onChange={(e) => setFormData({
                        ...formData,
                        assessmentPattern: {
                          ...formData.assessmentPattern,
                          internal: parseInt(e.target.value)
                        }
                      })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">External (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.assessmentPattern.external}
                      onChange={(e) => setFormData({
                        ...formData,
                        assessmentPattern: {
                          ...formData.assessmentPattern,
                          external: parseInt(e.target.value)
                        }
                      })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Practical (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.assessmentPattern.practical}
                      onChange={(e) => setFormData({
                        ...formData,
                        assessmentPattern: {
                          ...formData.assessmentPattern,
                          practical: parseInt(e.target.value)
                        }
                      })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <Save size={16} />
                  <span>{editingSubject ? 'Update Subject' : 'Create Subject'}</span>
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubjects.map(subject => (
            <div key={subject._id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">{subject.name}</h3>
                  <p className="text-blue-400 font-mono text-sm">{subject.code}</p>
                </div>
                {user?.role === 'admin' && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => startEdit(subject)}
                      className="text-blue-400 hover:text-blue-300 p-1"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(subject._id)}
                      className="text-red-400 hover:text-red-300 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Department:</span>
                  <span className="text-white">{subject.department}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Semester:</span>
                  <span className="text-white">{subject.semester}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400 flex items-center">
                    <Award className="mr-1" size={14} />
                    Credits:
                  </span>
                  <span className="text-white">{subject.credits}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400 flex items-center">
                    <Clock className="mr-1" size={14} />
                    Weekly Hours:
                  </span>
                  <span className="text-white">{subject.weeklyHours}</span>
                </div>
                
                <div className="text-sm">
                  <span className="text-gray-400">Hours Breakdown:</span>
                  <div className="text-white text-xs mt-1">
                    Lecture: {subject.lectureHours}h | Lab: {subject.labHours}h | Tutorial: {subject.tutorialHours || 0}h
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Type:</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    subject.type === 'core' ? 'bg-blue-600' :
                    subject.type === 'elective' ? 'bg-green-600' : 'bg-purple-600'
                  }`}>
                    {subject.type}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Max Students:</span>
                  <span className="text-white">{subject.maxStudents}</span>
                </div>
                
                {subject.assignedFaculty && subject.assignedFaculty.length > 0 && (
                  <div className="text-sm">
                    <span className="text-gray-400 flex items-center mb-1">
                      <Users className="mr-1" size={14} />
                      Faculty:
                    </span>
                    <div className="text-white text-xs">
                      {subject.assignedFaculty.map(faculty => faculty.name).join(', ')}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredSubjects.length === 0 && (
          <div className="text-center py-12">
            <BookOpen size={48} className="mx-auto text-gray-500 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Subjects Found</h3>
            <p className="text-gray-400">
              {user?.role === 'admin' 
                ? 'Create your first subject to get started.' 
                : 'No subjects match your current filters.'
              }
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SubjectManagement;
