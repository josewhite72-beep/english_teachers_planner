import { useState, useEffect } from 'react';
import dataService from '../services/dataService';

function Resources() {
  const [resources, setResources] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    const data = await dataService.getResources();
    setResources(data);
  };

  const filteredResources = filter === 'all' 
    ? resources 
    : resources.filter(r => r.category === filter);

  const categories = [...new Set(resources.map(r => r.category))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Teaching Resources</h2>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'all'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === category
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        {filteredResources.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No resources found for this category.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <div key={resource.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                <div className="mb-3">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-800 flex-1">
                      {resource.title}
                    </h3>
                    <span className="text-2xl ml-2">
                      {resource.type === 'PDF' && '📄'}
                      {resource.type === 'Activity' && '🎯'}
                      {resource.type === 'Flashcards' && '🎴'}
                      {resource.type === 'Audio' && '🎧'}
                      {resource.type === 'Video' && '🎥'}
                    </span>
                  </div>
                  <div className="flex gap-2 mb-2">
                    <span className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded">
                      {resource.category}
                    </span>
                    <span className="px-2 py-1 text-xs font-semibold bg-purple-100 text-purple-700 rounded">
                      {resource.level}
                    </span>
                  </div>
                </div>

                {resource.description && (
                  <p className="text-sm text-gray-600 mb-3">
                    {resource.description}
                  </p>
                )}

                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-2 bg-primary-500 text-white text-sm rounded hover:bg-primary-600 transition-colors">
                    📥 Download
                  </button>
                  <button className="px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200 transition-colors">
                    👁️ Preview
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <p className="text-sm text-blue-800">
          💡 <strong>Tip:</strong> These are sample resources. In a full version, you could upload 
          your own materials and organize them by topics, levels, and types.
        </p>
      </div>
    </div>
  );
}

export default Resources;
