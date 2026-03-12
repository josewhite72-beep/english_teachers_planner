import { useState, useEffect } from 'react';
import dataService from '../services/dataService';

function StudentProgress() {
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    level: 'A1',
    attendance: 100,
    progress: 0,
    strengths: '',
    weaknesses: ''
  });

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    const data = await dataService.getStudents();
    setStudents(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const studentData = {
      ...formData,
      strengths: formData.strengths.split(',').map(s => s.trim()),
      weaknesses: formData.weaknesses.split(',').map(s => s.trim()),
    };
    await dataService.saveStudent(studentData);
    setShowForm(false);
    setFormData({
      name: '',
      level: 'A1',
      attendance: 100,
      progress: 0,
      strengths: '',
      weaknesses: ''
    });
    loadStudents();
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this student?')) {
      await dataService.deleteStudent(id);
      loadStudents();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Student Progress</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          {showForm ? 'Cancel' : '+ Add Student'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Add New Student</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Student Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Level *
                </label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData({...formData, level: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="A1">A1 - Beginner</option>
                  <option value="A2">A2 - Elementary</option>
                  <option value="B1">B1 - Intermediate</option>
                  <option value="B2">B2 - Upper Intermediate</option>
                  <option value="C1">C1 - Advanced</option>
                  <option value="C2">C2 - Proficient</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Attendance (%) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  max="100"
                  value={formData.attendance}
                  onChange={(e) => setFormData({...formData, attendance: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Progress (%) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  max="100"
                  value={formData.progress}
                  onChange={(e) => setFormData({...formData, progress: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Strengths (comma separated)
              </label>
              <input
                type="text"
                value={formData.strengths}
                onChange={(e) => setFormData({...formData, strengths: e.target.value})}
                placeholder="e.g., Vocabulary, Reading, Pronunciation"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weaknesses (comma separated)
              </label>
              <input
                type="text"
                value={formData.weaknesses}
                onChange={(e) => setFormData({...formData, weaknesses: e.target.value})}
                placeholder="e.g., Grammar, Speaking, Writing"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Add Student
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">All Students</h3>
        {students.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No students yet. Add your first student!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {students.map((student) => (
              <div key={student.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">{student.name}</h4>
                    <span className="text-sm text-gray-600">Level: {student.level}</span>
                  </div>
                  <button
                    onClick={() => handleDelete(student.id)}
                    className="text-red-600 hover:bg-red-50 p-1 rounded"
                  >
                    🗑️
                  </button>
                </div>

                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Attendance</span>
                      <span className="font-semibold">{student.attendance}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${student.attendance}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-semibold">{student.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${student.progress}%` }}
                      />
                    </div>
                  </div>

                  {student.strengths && student.strengths.length > 0 && (
                    <div className="text-sm">
                      <span className="font-medium text-green-700">💪 Strengths: </span>
                      <span className="text-gray-600">{student.strengths.join(', ')}</span>
                    </div>
                  )}

                  {student.weaknesses && student.weaknesses.length > 0 && (
                    <div className="text-sm">
                      <span className="font-medium text-orange-700">📝 Areas to improve: </span>
                      <span className="text-gray-600">{student.weaknesses.join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentProgress;
