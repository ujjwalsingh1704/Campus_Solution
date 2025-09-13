import React, { useState } from 'react';
import { useAuth, useRole } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  User, 
  Users, 
  Settings,
  Eye,
  Lock
} from 'lucide-react';

const RoleBasedAccessTest = () => {
  const { user, login } = useAuth();
  const { isStudent, isFaculty, isAdmin, hasRole, hasAnyRole } = useRole();
  const navigate = useNavigate();
  const [testResults, setTestResults] = useState([]);

  const testRoutes = [
    { path: '/dashboard', name: 'Dashboard', allowedRoles: ['student', 'faculty', 'admin'] },
    { path: '/timetable', name: 'Timetable', allowedRoles: ['student', 'faculty', 'admin'] },
    { path: '/events', name: 'Events', allowedRoles: ['student', 'faculty', 'admin'] },
    { path: '/canteen', name: 'Canteen', allowedRoles: ['student', 'faculty', 'admin'] },
    { path: '/booking', name: 'Booking', allowedRoles: ['student', 'faculty', 'admin'] },
    { path: '/navigation', name: 'Navigation', allowedRoles: ['student', 'faculty', 'admin'] },
    { path: '/wallet', name: 'Wallet', allowedRoles: ['student', 'faculty', 'admin'] },
    { path: '/gamification', name: 'Gamification', allowedRoles: ['student'] },
    { path: '/attendance', name: 'Attendance', allowedRoles: ['student', 'faculty', 'admin'] },
    { path: '/ai-assistant', name: 'AI Assistant', allowedRoles: ['student', 'faculty', 'admin'] },
    { path: '/user-management', name: 'User Management', allowedRoles: ['admin'] },
    { path: '/notifications', name: 'Notifications', allowedRoles: ['student', 'faculty', 'admin'] },
    { path: '/profile', name: 'Profile', allowedRoles: ['student', 'faculty', 'admin'] }
  ];

  const testRoles = [
    { role: 'student', email: 'student@nmims.edu', name: 'Test Student' },
    { role: 'faculty', email: 'faculty@nmims.edu', name: 'Test Faculty' },
    { role: 'admin', email: 'admin@nmims.edu', name: 'Test Admin' }
  ];

  const runAccessTests = async () => {
    const results = [];
    
    for (const testRole of testRoles) {
      // Simulate login for each role
      await login(testRole.email, 'test', testRole.name, testRole.role);
      
      for (const route of testRoutes) {
        const hasAccess = route.allowedRoles.includes(testRole.role);
        const testPassed = hasAccess === hasAnyRole(route.allowedRoles);
        
        results.push({
          role: testRole.role,
          route: route.name,
          path: route.path,
          expectedAccess: hasAccess,
          actualAccess: hasAnyRole(route.allowedRoles),
          testPassed,
          timestamp: new Date()
        });
      }
    }
    
    setTestResults(results);
  };

  const testRoleHelpers = () => {
    const helperTests = [
      {
        name: 'isStudent()',
        expected: user?.role === 'student',
        actual: isStudent(),
        passed: (user?.role === 'student') === isStudent()
      },
      {
        name: 'isFaculty()',
        expected: user?.role === 'faculty',
        actual: isFaculty(),
        passed: (user?.role === 'faculty') === isFaculty()
      },
      {
        name: 'isAdmin()',
        expected: user?.role === 'admin',
        actual: isAdmin(),
        passed: (user?.role === 'admin') === isAdmin()
      },
      {
        name: 'hasRole("student")',
        expected: user?.role === 'student',
        actual: hasRole('student'),
        passed: (user?.role === 'student') === hasRole('student')
      },
      {
        name: 'hasAnyRole(["faculty", "admin"])',
        expected: ['faculty', 'admin'].includes(user?.role),
        actual: hasAnyRole(['faculty', 'admin']),
        passed: ['faculty', 'admin'].includes(user?.role) === hasAnyRole(['faculty', 'admin'])
      }
    ];

    return helperTests;
  };

  const switchRole = async (role, email, name) => {
    await login(email, 'test', name, role);
  };

  const getAccessIcon = (hasAccess) => {
    return hasAccess ? (
      <CheckCircle className="text-green-400" size={16} />
    ) : (
      <XCircle className="text-red-400" size={16} />
    );
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'student':
        return <User className="text-blue-400" size={16} />;
      case 'faculty':
        return <Users className="text-green-400" size={16} />;
      case 'admin':
        return <Settings className="text-purple-400" size={16} />;
      default:
        return <Shield className="text-gray-400" size={16} />;
    }
  };

  const passedTests = testResults.filter(result => result.testPassed).length;
  const totalTests = testResults.length;
  const successRate = totalTests > 0 ? (passedTests / totalTests * 100).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Role-Based Access Control Test</h1>
              <p className="text-purple-100">Verify routing and navigation permissions</p>
            </div>
            <Shield size={48} className="text-white opacity-80" />
          </div>
        </div>

        {/* Current User Info */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Eye className="mr-2" size={20} />
            Current User
          </h2>
          <div className="flex items-center space-x-4">
            {getRoleIcon(user?.role)}
            <div>
              <p className="text-white font-medium">{user?.name}</p>
              <p className="text-gray-400">{user?.email}</p>
              <p className="text-sm text-blue-400 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Role Helper Tests */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Role Helper Functions Test</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {testRoleHelpers().map((test, index) => (
              <div key={index} className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <code className="text-sm text-blue-300">{test.name}</code>
                  {getAccessIcon(test.passed)}
                </div>
                <div className="text-xs text-gray-400">
                  <p>Expected: {test.expected.toString()}</p>
                  <p>Actual: {test.actual.toString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Role Switch */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Quick Role Switch</h2>
          <div className="flex space-x-4">
            {testRoles.map((role) => (
              <button
                key={role.role}
                onClick={() => switchRole(role.role, role.email, role.name)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  user?.role === role.role
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                }`}
              >
                {getRoleIcon(role.role)}
                <span className="capitalize">{role.role}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Access Test Controls */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Route Access Tests</h2>
            <button
              onClick={runAccessTests}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Run All Tests
            </button>
          </div>
          
          {testResults.length > 0 && (
            <div className="mb-4 p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium">Test Results</span>
                <div className="flex items-center space-x-4">
                  <span className={`font-bold ${successRate === '100.0' ? 'text-green-400' : 'text-yellow-400'}`}>
                    {successRate}% Success Rate
                  </span>
                  <span className="text-gray-400">
                    {passedTests}/{totalTests} Tests Passed
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Test Results Table */}
        {testResults.length > 0 && (
          <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Role</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Route</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-300">Expected</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-300">Actual</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-300">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {testResults.map((result, index) => (
                    <tr key={index} className={result.testPassed ? 'bg-gray-800' : 'bg-red-900/20'}>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          {getRoleIcon(result.role)}
                          <span className="capitalize">{result.role}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium">{result.route}</p>
                          <p className="text-xs text-gray-400">{result.path}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {getAccessIcon(result.expectedAccess)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {getAccessIcon(result.actualAccess)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {result.testPassed ? (
                          <CheckCircle className="text-green-400 mx-auto" size={20} />
                        ) : (
                          <XCircle className="text-red-400 mx-auto" size={20} />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Route Access Matrix */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Route Access Matrix</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-300">Route</th>
                  <th className="px-4 py-2 text-center text-sm font-medium text-blue-400">Student</th>
                  <th className="px-4 py-2 text-center text-sm font-medium text-green-400">Faculty</th>
                  <th className="px-4 py-2 text-center text-sm font-medium text-purple-400">Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {testRoutes.map((route, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 font-medium">{route.name}</td>
                    <td className="px-4 py-2 text-center">
                      {route.allowedRoles.includes('student') ? (
                        <CheckCircle className="text-green-400 mx-auto" size={16} />
                      ) : (
                        <Lock className="text-gray-500 mx-auto" size={16} />
                      )}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {route.allowedRoles.includes('faculty') ? (
                        <CheckCircle className="text-green-400 mx-auto" size={16} />
                      ) : (
                        <Lock className="text-gray-500 mx-auto" size={16} />
                      )}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {route.allowedRoles.includes('admin') ? (
                        <CheckCircle className="text-green-400 mx-auto" size={16} />
                      ) : (
                        <Lock className="text-gray-500 mx-auto" size={16} />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleBasedAccessTest;
