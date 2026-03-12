import { useState, useEffect } from 'react';
import dataService from '../services/dataService';

function LessonPlanner() {
  const [lessons, setLessons] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    level: 'A1',
    objectives: '',
    materials: '',
    notes: ''
  });

  useEffect(() => {
    loadLessons();
  }, []);

  const loadLessons = async () => {
    const data = await dataService.getLessons();
    setLessons(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const lessonData = {
      ...formData,
      objectives: formData.objectives.split(',').map(s => s.trim()),
      materials: formData.materials.split(',').map(s => s.trim()),
    };
    await dataService.saveLesson(lessonData);
    setShowForm(false);
    setFormData({
      title: '',
      date: '',
      level: 'A1',
      objectives: '',
      materials: '',
      notes: ''
    });
    loadLessons();
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this lesson?')) {
      await dataService.deleteLesson(id);
      loadLessons();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Lesson Planner</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          {showForm ? 'Cancel' : '+ New Lesson'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Create New Lesson</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Objectives (comma separated)
              </label>
              <input
                type="text"
                value={formData.objectives}
                onChange={(e) => setFormData({...formData, objectives: e.target.value})}
                placeholder="e.g., Practice present simple, Learn new vocabulary"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Materials (comma separated)
              </label>
              <input
                type="text"
                value={formData.materials}
                onChange={(e) => setFormData({...formData, materials: e.target.value})}
                placeholder="e.g., Worksheets, Flashcards, Audio files"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Create Lesson
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">All Lessons</h3>
        {lessons.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No lessons yet. Create your first lesson!</p>
        ) : (
          <div className="space-y-4">
            {lessons.map((lesson) => (
              <div key={lesson.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold text-gray-800">{lesson.title}</h4>
                      <span className="px-2 py-1 text-xs font-semibold bg-primary-100 text-primary-700 rounded">
                        {lesson.level}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      📅 {new Date(lesson.date).toLocaleDateString()}
                    </p>
                    {lesson.objectives && lesson.objectives.length > 0 && (
                      <div className="mb-2">
                        <p className="text-sm font-medium text-gray-700">Objectives:</p>
                        <ul className="list-disc list-inside text-sm text-gray-600">
                          {lesson.objectives.map((obj, idx) => (
                            <li key={idx}>{obj}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {lesson.notes && (
                      <p className="text-sm text-gray-600 italic">"{lesson.notes}"</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(lesson.id)}
                    className="ml-4 px-3 py-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default LessonPlanner;
