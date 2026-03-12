import { useState, useEffect } from 'react';
import dataService from '../services/dataService';

function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [analyticsData, studentsData] = await Promise.all([
        dataService.getAnalytics(),
        dataService.getStudents()
      ]);
      setAnalytics(analyticsData);
      setStudents(studentsData);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-500">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Analytics & Reports</h2>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Students</p>
              <p className="text-4xl font-bold">{analytics?.totalStudents || 0}</p>
            </div>
            <div className="text-5xl opacity-20">👥</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Avg. Progress</p>
              <p className="text-4xl font-bold">{analytics?.averageProgress || 0}%</p>
            </div>
            <div className="text-5xl opacity-20">📈</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Attendance Rate</p>
              <p className="text-4xl font-bold">{analytics?.attendanceRate || 0}%</p>
            </div>
            <div className="text-5xl opacity-20">📅</div>
          </div>
        </div>
      </div>

      {/* Level Distribution */}
      {analytics?.levelDistribution && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Student Distribution by Level</h3>
          <div className="space-y-3">
            {Object.entries(analytics.levelDistribution).map(([level, count]) => {
              const total = analytics.totalStudents;
              const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={level}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">Level {level}</span>
                    <span className="text-gray-600">{count} students ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-primary-500 h-3 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Weekly Stats */}
      {analytics?.weeklyStats && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Weekly Performance</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 text-gray-700">Week</th>
                  <th className="text-left py-3 px-4 text-gray-700">Lessons Completed</th>
                  <th className="text-left py-3 px-4 text-gray-700">Avg. Attendance</th>
                </tr>
              </thead>
              <tbody>
                {analytics.weeklyStats.map((week, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{week.week}</td>
                    <td className="py-3 px-4">{week.lessonsCompleted}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${week.avgAttendance}%` }}
                          />
                        </div>
                        <span>{week.avgAttendance}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Top Performers */}
      {students.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Top Performers</h3>
          <div className="space-y-3">
            {students
              .sort((a, b) => b.progress - a.progress)
              .slice(0, 5)
              .map((student, idx) => (
                <div key={student.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">{student.name}</div>
                    <div className="text-sm text-gray-600">Level {student.level}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">{student.progress}%</div>
                    <div className="text-xs text-gray-500">progress</div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Analytics;
