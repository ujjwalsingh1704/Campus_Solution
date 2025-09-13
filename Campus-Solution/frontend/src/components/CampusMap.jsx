import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Search, Filter, Route, Clock, Users } from 'lucide-react';

const CampusMap = ({ selectedBuilding, onBuildingSelect, showDirections = false }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [directions, setDirections] = useState(null);
  const [userLocation, setUserLocation] = useState({ x: 50, y: 50 }); // Mock user location

  // Mock campus buildings and facilities
  const campusBuildings = [
    {
      id: 'main-building',
      name: 'Main Academic Building',
      type: 'academic',
      coordinates: { x: 200, y: 150 },
      facilities: ['Classrooms 101-120', 'Faculty Offices', 'Admin Office'],
      description: 'Primary academic building with lecture halls and administrative offices',
    },
    {
      id: 'library',
      name: 'Central Library',
      type: 'library',
      coordinates: { x: 350, y: 200 },
      facilities: ['Study Rooms', 'Computer Lab', 'Reading Hall', 'Digital Resources'],
      description: '4-floor library with extensive collection and study spaces',
    },
    {
      id: 'lab-complex',
      name: 'Laboratory Complex',
      type: 'lab',
      coordinates: { x: 150, y: 300 },
      facilities: ['Computer Labs 1-5', 'Physics Lab', 'Chemistry Lab', 'Biology Lab'],
      description: 'State-of-the-art laboratory facilities for all departments',
    },
    {
      id: 'sports-center',
      name: 'Sports & Recreation Center',
      type: 'sports',
      coordinates: { x: 400, y: 350 },
      facilities: ['Gymnasium', 'Swimming Pool', 'Tennis Courts', 'Basketball Courts'],
      description: 'Complete sports facility with indoor and outdoor courts',
    },
    {
      id: 'cafeteria',
      name: 'Student Cafeteria',
      type: 'dining',
      coordinates: { x: 250, y: 250 },
      facilities: ['Main Dining Hall', 'Coffee Shop', 'Outdoor Seating'],
      description: 'Multi-cuisine dining facility with 500+ seating capacity',
    },
    {
      id: 'auditorium',
      name: 'Main Auditorium',
      type: 'event',
      coordinates: { x: 300, y: 100 },
      facilities: ['Main Hall (500 seats)', 'Conference Rooms A-D', 'AV Equipment'],
      description: 'Premier venue for events, conferences, and presentations',
    },
    {
      id: 'hostel-a',
      name: 'Hostel Block A',
      type: 'residential',
      coordinates: { x: 100, y: 400 },
      facilities: ['Student Rooms', 'Common Room', 'Laundry', 'Mess Hall'],
      description: 'Residential facility for 200 students with modern amenities',
    },
    {
      id: 'parking',
      name: 'Main Parking Area',
      type: 'parking',
      coordinates: { x: 450, y: 150 },
      facilities: ['Car Parking (200 spots)', 'Bike Parking', 'EV Charging'],
      description: 'Secure parking facility with electric vehicle charging stations',
    },
  ];

  const buildingTypes = [
    { value: 'all', label: 'All Buildings', color: 'bg-gray-600' },
    { value: 'academic', label: 'Academic', color: 'bg-blue-600' },
    { value: 'lab', label: 'Laboratories', color: 'bg-green-600' },
    { value: 'library', label: 'Library', color: 'bg-purple-600' },
    { value: 'sports', label: 'Sports', color: 'bg-orange-600' },
    { value: 'dining', label: 'Dining', color: 'bg-red-600' },
    { value: 'event', label: 'Events', color: 'bg-yellow-600' },
    { value: 'residential', label: 'Residential', color: 'bg-pink-600' },
    { value: 'parking', label: 'Parking', color: 'bg-gray-500' },
  ];

  const filteredBuildings = campusBuildings.filter(building => {
    const matchesSearch = building.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         building.facilities.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = selectedFilter === 'all' || building.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const getBuildingColor = (type) => {
    const typeConfig = buildingTypes.find(t => t.value === type);
    return typeConfig ? typeConfig.color : 'bg-gray-600';
  };

  const calculateRoute = (from, to) => {
    // Simple pathfinding simulation
    const distance = Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2));
    const walkingTime = Math.ceil(distance / 50); // Rough walking time calculation
    
    return {
      distance: Math.ceil(distance),
      walkingTime,
      steps: [
        `Start from your current location`,
        `Head ${to.x > from.x ? 'east' : 'west'} towards the main pathway`,
        `Continue ${to.y > from.y ? 'south' : 'north'} for ${Math.ceil(distance / 2)} meters`,
        `You will find the destination on your ${to.x > from.x ? 'right' : 'left'}`,
      ],
    };
  };

  const handleBuildingClick = (building) => {
    onBuildingSelect?.(building);
    if (showDirections) {
      const route = calculateRoute(userLocation, building.coordinates);
      setDirections({ building, route });
    }
  };

  const clearDirections = () => {
    setDirections(null);
    onBuildingSelect?.(null);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center space-x-2">
          <MapPin className="text-blue-400" size={24} />
          <span>Campus Map & Navigation</span>
        </h2>
        
        {/* Search and Filter Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search buildings, rooms, or facilities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="text-gray-400" size={20} />
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {buildingTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Map */}
        <div className="lg:col-span-2">
          <div className="bg-gray-700 rounded-lg p-4 relative overflow-hidden" style={{ height: '500px' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 to-green-700/20">
              {/* Campus Pathways */}
              <svg className="absolute inset-0 w-full h-full">
                <path
                  d="M 50 50 L 200 150 L 350 200 L 400 350 M 200 150 L 250 250 L 300 100 M 150 300 L 250 250"
                  stroke="#4B5563"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray="5,5"
                />
              </svg>

              {/* User Location */}
              <div
                className="absolute w-4 h-4 bg-blue-500 rounded-full border-2 border-white animate-pulse"
                style={{ left: `${userLocation.x}px`, top: `${userLocation.y}px` }}
              >
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-white bg-blue-500 px-2 py-1 rounded whitespace-nowrap">
                  You are here
                </div>
              </div>

              {/* Buildings */}
              {filteredBuildings.map(building => (
                <div
                  key={building.id}
                  className={`absolute w-12 h-12 ${getBuildingColor(building.type)} rounded-lg border-2 border-white cursor-pointer transform hover:scale-110 transition-transform ${
                    selectedBuilding?.id === building.id ? 'ring-4 ring-yellow-400' : ''
                  }`}
                  style={{ 
                    left: `${building.coordinates.x}px`, 
                    top: `${building.coordinates.y}px` 
                  }}
                  onClick={() => handleBuildingClick(building)}
                  title={building.name}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <MapPin className="text-white" size={20} />
                  </div>
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-white bg-gray-800 px-2 py-1 rounded whitespace-nowrap">
                    {building.name}
                  </div>
                </div>
              ))}

              {/* Route Line */}
              {directions && (
                <svg className="absolute inset-0 w-full h-full">
                  <path
                    d={`M ${userLocation.x} ${userLocation.y} L ${directions.building.coordinates.x} ${directions.building.coordinates.y}`}
                    stroke="#EF4444"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray="8,4"
                    className="animate-pulse"
                  />
                </svg>
              )}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-4 grid grid-cols-3 md:grid-cols-5 gap-2">
            {buildingTypes.slice(1).map(type => (
              <div key={type.value} className="flex items-center space-x-2 text-sm">
                <div className={`w-3 h-3 ${type.color} rounded`}></div>
                <span className="text-gray-300">{type.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Building Details & Directions */}
        <div className="space-y-4">
          {selectedBuilding ? (
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-white">{selectedBuilding.name}</h3>
                <button
                  onClick={clearDirections}
                  className="text-gray-400 hover:text-white"
                >
                  ×
                </button>
              </div>
              
              <p className="text-gray-300 text-sm mb-4">{selectedBuilding.description}</p>
              
              <div className="mb-4">
                <h4 className="text-white font-medium mb-2">Available Facilities:</h4>
                <ul className="space-y-1">
                  {selectedBuilding.facilities.map((facility, index) => (
                    <li key={index} className="text-gray-300 text-sm flex items-center space-x-2">
                      <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                      <span>{facility}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {directions && (
                <div className="border-t border-gray-600 pt-4">
                  <h4 className="text-white font-medium mb-3 flex items-center space-x-2">
                    <Navigation className="text-blue-400" size={16} />
                    <span>Directions</span>
                  </h4>
                  
                  <div className="flex items-center space-x-4 mb-3 text-sm">
                    <div className="flex items-center space-x-1 text-gray-300">
                      <Route size={14} />
                      <span>{directions.route.distance}m</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-300">
                      <Clock size={14} />
                      <span>{directions.route.walkingTime} min walk</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {directions.route.steps.map((step, index) => (
                      <div key={index} className="flex items-start space-x-2 text-sm">
                        <div className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs mt-0.5">
                          {index + 1}
                        </div>
                        <span className="text-gray-300">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-700 rounded-lg p-6 text-center">
              <MapPin className="mx-auto text-gray-500 mb-3" size={48} />
              <h3 className="text-white font-medium mb-2">Select a Building</h3>
              <p className="text-gray-400 text-sm">
                Click on any building on the map to view details and get directions
              </p>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="text-white font-medium mb-3">Quick Navigation</h4>
            <div className="space-y-2">
              <button
                onClick={() => handleBuildingClick(campusBuildings.find(b => b.id === 'library'))}
                className="w-full text-left px-3 py-2 bg-gray-600 hover:bg-gray-500 rounded text-gray-300 text-sm transition-colors"
              >
                📚 Go to Library
              </button>
              <button
                onClick={() => handleBuildingClick(campusBuildings.find(b => b.id === 'cafeteria'))}
                className="w-full text-left px-3 py-2 bg-gray-600 hover:bg-gray-500 rounded text-gray-300 text-sm transition-colors"
              >
                🍽️ Find Cafeteria
              </button>
              <button
                onClick={() => handleBuildingClick(campusBuildings.find(b => b.id === 'lab-complex'))}
                className="w-full text-left px-3 py-2 bg-gray-600 hover:bg-gray-500 rounded text-gray-300 text-sm transition-colors"
              >
                🔬 Locate Labs
              </button>
              <button
                onClick={() => handleBuildingClick(campusBuildings.find(b => b.id === 'parking'))}
                className="w-full text-left px-3 py-2 bg-gray-600 hover:bg-gray-500 rounded text-gray-300 text-sm transition-colors"
              >
                🚗 Find Parking
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampusMap;
