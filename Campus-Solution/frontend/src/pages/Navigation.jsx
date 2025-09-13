import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCampusNavigation } from '../hooks/useRealTimeData';
import { 
  MapPin, 
  Navigation as NavigationIcon, 
  Search, 
  Clock, 
  Building, 
  Coffee, 
  BookOpen, 
  Car,
  Wifi,
  Users,
  Route
} from 'lucide-react';
import { navigationAPI } from '../utils/api';

const Navigation = () => {
  const { user } = useAuth();
  const { 
    pointsOfInterest, 
    quickAccessLocations, 
    directions: navigationDirections, 
    isNavigating,
    getDirections: getNavigationDirections,
    stopNavigation,
    searchLocations
  } = useCampusNavigation();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [currentLocation, setCurrentLocation] = useState('Main Campus Gate');
  const [directions, setDirections] = useState(null);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [pois, setPois] = useState([
    {
      id: 1,
      name: 'Library',
      category: 'Academic',
      icon: BookOpen,
      description: 'Central Library - 24/7 Access',
      estimatedTime: '5 min walk',
      coordinates: { lat: 19.0760, lng: 72.8777 }
    },
    {
      id: 2,
      name: 'Canteen',
      category: 'Food',
      icon: Coffee,
      description: 'Main Canteen - Multiple food courts',
      estimatedTime: '3 min walk',
      coordinates: { lat: 19.0765, lng: 72.8780 }
    },
    {
      id: 3,
      name: 'Computer Lab A',
      category: 'Academic',
      icon: Building,
      description: 'Computer Science Department',
      estimatedTime: '7 min walk',
      coordinates: { lat: 19.0770, lng: 72.8785 }
    },
    {
      id: 4,
      name: 'Parking Area',
      category: 'Facilities',
      icon: Car,
      description: 'Student & Faculty Parking',
      estimatedTime: '2 min walk',
      coordinates: { lat: 19.0755, lng: 72.8775 }
    },
    {
      id: 5,
      name: 'WiFi Zone',
      category: 'Facilities',
      icon: Wifi,
      description: 'High-speed internet access',
      estimatedTime: '4 min walk',
      coordinates: { lat: 19.0762, lng: 72.8782 }
    },
    {
      id: 6,
      name: 'Student Center',
      category: 'Social',
      icon: Users,
      description: 'Recreation & Events',
      estimatedTime: '6 min walk',
      coordinates: { lat: 19.0768, lng: 72.8778 }
    }
  ]);

  const categories = [
    { name: 'All', color: 'bg-gray-600' },
    { name: 'Academic', color: 'bg-blue-600' },
    { name: 'Food', color: 'bg-green-600' },
    { name: 'Facilities', color: 'bg-orange-600' },
    { name: 'Social', color: 'bg-purple-600' }
  ];


  const filteredPois = pois.filter(poi => {
    const matchesSearch = poi.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         poi.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || poi.category.toLowerCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleGetDirections = async (destination) => {
    setSelectedDestination(destination);
    setDirections([
      `Head north from ${currentLocation}`,
      `Walk straight for 200 meters`,
      `Turn right at the main pathway`,
      `Continue for 150 meters`,
      `${destination.name} will be on your left`
    ]);
  };

  const quickLocations = [
    { name: 'My Next Class', location: 'Room A-101', time: '10:00 AM' },
    { name: 'Hostel Block C', location: 'Residential Area', time: '15 min walk' },
    { name: 'Sports Complex', location: 'Athletic Facilities', time: '8 min walk' }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-blue-600 rounded-lg p-6">
          <h1 className="text-3xl font-bold mb-2">Campus Navigation</h1>
          <p className="text-teal-100">Find your way around campus with step-by-step directions</p>
        </div>

        {/* Current Location & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {/* Search & Filters */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search for buildings, rooms, facilities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>
              
              {/* Category Filters */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === category.name
                        ? `${category.color} text-white`
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Points of Interest */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-bold mb-4">Campus Locations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredPois.map((poi) => {
                  const Icon = poi.icon;
                  return (
                    <div key={poi.id} className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors">
                      <div className="flex items-start space-x-3">
                        <div className="bg-teal-600 p-2 rounded-lg">
                          <Icon size={20} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-white">{poi.name}</h3>
                          <p className="text-gray-300 text-sm mb-2">{poi.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-teal-400 text-sm flex items-center">
                              <Clock size={14} className="mr-1" />
                              {poi.estimatedTime}
                            </span>
                            <button
                              onClick={() => handleGetDirections(poi)}
                              className="bg-teal-600 hover:bg-teal-700 px-3 py-1 rounded text-sm text-white transition-colors flex items-center"
                            >
                              <Route size={14} className="mr-1" />
                              Get Directions
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Current Location */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <MapPin className="mr-2 text-teal-400" size={20} />
                Current Location
              </h3>
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-white font-medium">{currentLocation}</p>
                <button className="mt-2 text-teal-400 text-sm hover:text-teal-300 transition-colors">
                  Update Location
                </button>
              </div>
            </div>

            {/* Quick Locations */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Quick Access</h3>
              <div className="space-y-3">
                {quickLocations.map((location, index) => (
                  <div key={index} className="bg-gray-700 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium text-sm">{location.name}</p>
                        <p className="text-gray-400 text-xs">{location.location}</p>
                      </div>
                      <span className="text-teal-400 text-xs">{location.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Directions */}
            {directions && selectedDestination && (
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <NavigationIcon className="mr-2 text-teal-400" size={20} />
                  Directions to {selectedDestination.name}
                </h3>
                <div className="space-y-3">
                  {directions.map((step, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="bg-teal-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                      <p className="text-gray-300 text-sm">{step}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-teal-600/20 border border-teal-600/50 rounded-lg">
                  <p className="text-teal-200 text-sm">
                    <Clock size={14} className="inline mr-1" />
                    Estimated time: {selectedDestination.estimatedTime}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Campus Map Placeholder */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-bold mb-4">Interactive Campus Map</h2>
          <div className="bg-gray-700 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="mx-auto mb-4 text-teal-400" size={48} />
              <p className="text-gray-300">Interactive map will be displayed here</p>
              <p className="text-gray-400 text-sm mt-2">
                Click on any location above to see it highlighted on the map
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
