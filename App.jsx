import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import LessonPlanner from './components/LessonPlanner';
import StudentProgress from './components/StudentProgress';
import Resources from './components/Resources';
import Analytics from './components/Analytics';
import Navigation from './components/Navigation';

function App() {
  return (
    <BrowserRouter basename="/english-teachers-planner">
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/planner" element={<LessonPlanner />} />
            <Route path="/students" element={<StudentProgress />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
