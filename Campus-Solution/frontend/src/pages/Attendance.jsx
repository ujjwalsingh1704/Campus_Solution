import React, { useState, useEffect } from 'react';
import { useAuth, useRole } from '../contexts/AuthContext';
import { 
  UserCheck, 
  Users, 
  Calendar, 
  Clock, 
  Search, 
  Filter,
  Download,
  Upload,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { facultyAPI, studentAPI } from '../utils/api';

const Attendance = () => {
  const { user } = useAuth();
  const { isFaculty, isStudent } = useRole();
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [attendanceData, setAttendanceData] = useState([]);
  const [classes, setClasses] = useState([
    { id: 1, name: 'Data Structures', code: 'CS301', students: 45 },
    { id: 2, name: 'Algorithms', code: 'CS302', students: 38 },
    { id: 3, name: 'Database Systems', code: 'CS303', students: 42 }
  ]);

  const [students, setStudents] = useState([
    { id: 1, name: 'John Doe', rollNo: '2023001', present: null },
    { id: 2, name: 'Jane Smith', rollNo: '2023002', present: null },
    { id: 3, name: 'Mike Johnson', rollNo: '2023003', present: null },
    { id: 4, name: 'Sarah Wilson', rollNo: '2023004', present: null },
    { id: 5, name: 'David Brown', rollNo: '2023005', present: null },
    { id: 6, name: 'Lisa Davis', rollNo: '2023006', present: null },
    { id: 7, name: 'Tom Anderson', rollNo: '2023007', present: null },
    { id: 8, name: 'Emma Taylor', rollNo: '2023008', present: null }
  ]);

  const [studentAttendance, setStudentAttendance] = useState({
    totalClasses: 45,
    attended: 38,
    percentage: 84.4,
    recentAttendance: [
      { date: '2024-01-15', subject: 'Data Structures', status: 'present' },
      { date: '2024-01-14', subject: 'Algorithms', status: 'present' },
      { date: '2024-01-13', subject: 'Database Systems', status: 'absent' },
      { date: '2024-01-12', subject: 'Data Structures', status: 'present' },
      { date: '2024-01-11', subject: 'Algorithms', status: 'present' }
    ]
  });

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const markAttendance = (studentId, status) => {
    setStudents(students.map(student =>
      student.id === studentId ? { ...student, present: status } : student
    ));
  };

  const markAllPresent = () => {
    setStudents(students.map(student => ({ ...student, present: true })));
  };

  const markAllAbsent = () => {
    setStudents(students.map(student => ({ ...student, present: false })));
  };

  const submitAttendance = async () => {
    if (!selectedClass) {
      alert('Please select a class');
      return;
    }

    const attendanceRecord = {
      classId: selectedClass,
      date: selectedDate,
      attendance: students.map(student => ({
        studentId: student.id,
        present: student.present
      }))
    };

    try {
      // await facultyAPI.markAttendance(selectedClass, attendanceRecord);
      alert('Attendance submitted successfully!');
    } catch (error) {
      console.error('Failed to submit attendance:', error);
    }
  };

  const getAttendanceStats = () => {
    const totalStudents = students.length;
    const presentCount = students.filter(s => s.present === true).length;
    const absentCount = students.filter(s => s.present === false).length;
    const unmarkedCount = students.filter(s => s.present === null).length;

    return { totalStudents, presentCount, absentCount, unmarkedCount };
  };

  const stats = getAttendanceStats();

  if (isStudent) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6">
            <h1 className="text-3xl font-bold mb-2">My Attendance</h1>
            <p className="text-indigo-100">Track your class attendance and performance</p>
          </div>

          {/* Attendance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Classes</p>
                  <p className="text-2xl font-bold text-white">{studentAttendance.totalClasses}</p>
                </div>
                <Calendar className="text-blue-400" size={24} />
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Classes Attended</p>
                  <p className="text-2xl font-bold text-white">{studentAttendance.attended}</p>
                </div>
                <CheckCircle className="text-green-400" size={24} />
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Attendance Rate</p>
                  <p className="text-2xl font-bold text-white">{studentAttendance.percentage}%</p>
                </div>
                <UserCheck className={`${studentAttendance.percentage >= 75 ? 'text-green-400' : 'text-red-400'}`} size={24} />
              </div>
            </div>
          </div>

          {/* Attendance Progress */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-bold mb-4">Attendance Progress</h2>
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-300">Current Attendance</span>
                <span className="text-white">{studentAttendance.attended}/{studentAttendance.totalClasses} classes</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full ${studentAttendance.percentage >= 75 ? 'bg-green-500' : 'bg-red-500'}`}
                  style={{ width: `${studentAttendance.percentage}%` }}
                ></div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="font-semibold text-white mb-2">Minimum Requirement</h3>
                <p className="text-gray-300 text-sm">75% attendance required for exam eligibility</p>
                <p className={`text-sm font-medium ${studentAttendance.percentage >= 75 ? 'text-green-400' : 'text-red-400'}`}>
                  {studentAttendance.percentage >= 75 ? '✓ Requirement met' : `Need ${Math.ceil(studentAttendance.totalClasses * 0.75) - studentAttendance.attended} more classes`}
                </p>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="font-semibold text-white mb-2">Projection</h3>
                <p className="text-gray-300 text-sm">If you attend all remaining classes</p>
                <p className="text-blue-400 text-sm font-medium">
                  Final attendance: ~{Math.min(100, ((studentAttendance.attended + 10) / (studentAttendance.totalClasses + 10) * 100)).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          {/* Recent Attendance */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-bold mb-4">Recent Attendance</h2>
            <div className="space-y-3">
              {studentAttendance.recentAttendance.map((record, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${record.status === 'present' ? 'bg-green-600' : 'bg-red-600'}`}>
                      {record.status === 'present' ? 
                        <CheckCircle size={20} className="text-white" /> : 
                        <XCircle size={20} className="text-white" />
                      }
                    </div>
                    <div>
                      <p className="text-white font-medium">{record.subject}</p>
                      <p className="text-gray-400 text-sm">{record.date}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    record.status === 'present' ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'
                  }`}>
                    {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6">
          <h1 className="text-3xl font-bold mb-2">Attendance Management</h1>
          <p className="text-indigo-100">Mark and track student attendance for your classes</p>
        </div>

        {/* Class Selection & Controls */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Select Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="">Choose a class...</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name} ({cls.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Search Students</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by name or roll no..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-end space-x-2">
              <button
                onClick={markAllPresent}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Mark All Present
              </button>
              <button
                onClick={markAllAbsent}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Mark All Absent
              </button>
            </div>
          </div>

          {/* Attendance Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-700 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-white">{stats.totalStudents}</p>
              <p className="text-gray-400 text-sm">Total Students</p>
            </div>
            <div className="bg-green-600/20 border border-green-600/50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-green-400">{stats.presentCount}</p>
              <p className="text-green-300 text-sm">Present</p>
            </div>
            <div className="bg-red-600/20 border border-red-600/50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-red-400">{stats.absentCount}</p>
              <p className="text-red-300 text-sm">Absent</p>
            </div>
            <div className="bg-yellow-600/20 border border-yellow-600/50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-yellow-400">{stats.unmarkedCount}</p>
              <p className="text-yellow-300 text-sm">Unmarked</p>
            </div>
          </div>
        </div>

        {/* Student List */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Student Attendance</h2>
            <div className="flex space-x-2">
              <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center">
                <Upload size={16} className="mr-2" />
                Import
              </button>
              <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center">
                <Download size={16} className="mr-2" />
                Export
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {filteredStudents.map((student) => (
              <div key={student.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">{student.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">{student.name}</p>
                    <p className="text-gray-400 text-sm">Roll No: {student.rollNo}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => markAttendance(student.id, true)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      student.present === true
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-600 hover:bg-green-600 text-gray-300 hover:text-white'
                    }`}
                  >
                    Present
                  </button>
                  <button
                    onClick={() => markAttendance(student.id, false)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      student.present === false
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-600 hover:bg-red-600 text-gray-300 hover:text-white'
                    }`}
                  >
                    Absent
                  </button>
                  
                  {student.present === true && (
                    <CheckCircle className="text-green-400" size={20} />
                  )}
                  {student.present === false && (
                    <XCircle className="text-red-400" size={20} />
                  )}
                  {student.present === null && (
                    <AlertCircle className="text-yellow-400" size={20} />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={submitAttendance}
              disabled={!selectedClass || stats.unmarkedCount > 0}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Submit Attendance ({stats.presentCount} Present, {stats.absentCount} Absent)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
