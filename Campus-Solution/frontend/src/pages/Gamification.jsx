import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Trophy, 
  Star, 
  Award, 
  TrendingUp, 
  Users, 
  Target, 
  Gift,
  Zap,
  Crown,
  Medal,
  Flame,
  Calendar
} from 'lucide-react';
import { gamificationAPI } from '../utils/api';

const Gamification = () => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState({
    level: 5,
    points: 1250,
    nextLevelPoints: 1500,
    totalPoints: 3750,
    rank: 23,
    streak: 7,
    badges: 8
  });

  const [leaderboard, setLeaderboard] = useState([
    { rank: 1, name: 'Alex Chen', points: 2850, level: 8, avatar: 'AC' },
    { rank: 2, name: 'Sarah Kumar', points: 2720, level: 7, avatar: 'SK' },
    { rank: 3, name: 'Mike Johnson', points: 2650, level: 7, avatar: 'MJ' },
    { rank: 4, name: 'Priya Sharma', points: 2480, level: 6, avatar: 'PS' },
    { rank: 5, name: 'David Lee', points: 2350, level: 6, avatar: 'DL' }
  ]);

  const [badges, setBadges] = useState([
    {
      id: 1,
      name: 'Eco Warrior',
      description: 'Ordered 10 eco-friendly meals',
      icon: 'ECO',
      earned: true,
      points: 50,
      rarity: 'common'
    },
    {
      id: 2,
      name: 'Event Enthusiast',
      description: 'Attended 15 campus events',
      icon: 'EVT',
      earned: true,
      points: 75,
      rarity: 'uncommon'
    },
    {
      id: 3,
      name: 'Study Master',
      description: 'Booked study rooms 25 times',
      icon: 'STU',
      earned: true,
      points: 100,
      rarity: 'rare'
    },
    {
      id: 4,
      name: 'Social Butterfly',
      description: 'Made 50 new connections',
      icon: 'SOC',
      earned: false,
      points: 125,
      rarity: 'epic',
      progress: 32
    },
    {
      id: 5,
      name: 'Tech Guru',
      description: 'Complete 5 tech workshops',
      icon: 'TEC',
      earned: false,
      points: 150,
      rarity: 'legendary',
      progress: 3
    },
    {
      id: 6,
      name: 'Campus Explorer',
      description: 'Visit all campus locations',
      icon: 'EXP',
      earned: true,
      points: 200,
      rarity: 'legendary'
    }
  ]);

  const [challenges, setChallenges] = useState([
    {
      id: 1,
      title: 'Green Week Challenge',
      description: 'Order 5 eco-friendly meals this week',
      progress: 3,
      target: 5,
      reward: 100,
      timeLeft: '3 days',
      type: 'weekly'
    },
    {
      id: 2,
      title: 'Study Streak',
      description: 'Book study rooms for 7 consecutive days',
      progress: 4,
      target: 7,
      reward: 150,
      timeLeft: '4 days',
      type: 'challenge'
    },
    {
      id: 3,
      title: 'Event Explorer',
      description: 'Attend 3 different types of events',
      progress: 1,
      target: 3,
      reward: 75,
      timeLeft: '10 days',
      type: 'monthly'
    }
  ]);

  const getRarityColor = (rarity) => {
    const colors = {
      common: 'border-gray-500 bg-gray-500/20',
      uncommon: 'border-green-500 bg-green-500/20',
      rare: 'border-blue-500 bg-blue-500/20',
      epic: 'border-purple-500 bg-purple-500/20',
      legendary: 'border-yellow-500 bg-yellow-500/20'
    };
    return colors[rarity] || colors.common;
  };

  const getChallengeTypeColor = (type) => {
    const colors = {
      weekly: 'bg-green-600',
      monthly: 'bg-blue-600',
      challenge: 'bg-purple-600'
    };
    return colors[type] || colors.challenge;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6">
          <h1 className="text-3xl font-bold mb-2">Gamification Hub</h1>
          <p className="text-purple-100">Level up your campus experience and earn rewards!</p>
        </div>

        {/* User Profile Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Level Progress */}
          <div className="lg:col-span-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold">Level {userProfile.level}</h2>
                <p className="text-blue-100">{userProfile.points} / {userProfile.nextLevelPoints} XP</p>
              </div>
              <Crown className="text-yellow-300" size={48} />
            </div>
            
            <div className="mb-4">
              <div className="w-full bg-blue-800 rounded-full h-3">
                <div 
                  className="bg-yellow-300 h-3 rounded-full transition-all duration-300" 
                  style={{ width: `${(userProfile.points / userProfile.nextLevelPoints) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="flex justify-between text-sm">
              <span>Next Level: {userProfile.nextLevelPoints - userProfile.points} XP needed</span>
              <span>Total: {userProfile.totalPoints} XP</span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Campus Rank</p>
                  <p className="text-2xl font-bold text-white">#{userProfile.rank}</p>
                </div>
                <TrendingUp className="text-green-400" size={24} />
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Daily Streak</p>
                  <p className="text-2xl font-bold text-white">{userProfile.streak}</p>
                </div>
                <Flame className="text-orange-400" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Badges Earned</p>
                <p className="text-2xl font-bold text-white">{userProfile.badges}</p>
              </div>
              <Award className="text-purple-400" size={24} />
            </div>
          </div>
        </div>

        {/* Active Challenges */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Target className="mr-2 text-yellow-400" size={24} />
            Active Challenges
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {challenges.map((challenge) => (
              <div key={challenge.id} className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className={`${getChallengeTypeColor(challenge.type)} px-2 py-1 rounded text-xs font-medium text-white`}>
                    {challenge.type.toUpperCase()}
                  </span>
                  <span className="text-yellow-400 font-bold">+{challenge.reward} XP</span>
                </div>
                
                <h3 className="font-semibold text-white mb-2">{challenge.title}</h3>
                <p className="text-gray-300 text-sm mb-3">{challenge.description}</p>
                
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-white">{challenge.progress}/{challenge.target}</span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div 
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${(challenge.progress / challenge.target) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400 flex items-center">
                    <Calendar size={14} className="mr-1" />
                    {challenge.timeLeft} left
                  </span>
                  {challenge.progress === challenge.target && (
                    <button className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-xs font-medium transition-colors">
                      Claim Reward
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Badges Collection */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Medal className="mr-2 text-purple-400" size={24} />
            Badge Collection
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {badges.map((badge) => (
              <div 
                key={badge.id} 
                className={`relative rounded-lg p-4 border-2 transition-all duration-300 ${
                  badge.earned 
                    ? `${getRarityColor(badge.rarity)} hover:scale-105` 
                    : 'border-gray-600 bg-gray-700/50 opacity-60'
                }`}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">{badge.icon}</div>
                  <h3 className="font-semibold text-sm text-white mb-1">{badge.name}</h3>
                  <p className="text-xs text-gray-300 mb-2">{badge.description}</p>
                  
                  {badge.earned ? (
                    <div className="flex items-center justify-center space-x-1">
                      <Star className="text-yellow-400" size={12} />
                      <span className="text-yellow-400 text-xs font-bold">+{badge.points} XP</span>
                    </div>
                  ) : (
                    badge.progress && (
                      <div className="text-xs">
                        <div className="text-gray-400 mb-1">{badge.progress}/{badge.rarity === 'epic' ? 50 : 5}</div>
                        <div className="w-full bg-gray-600 rounded-full h-1">
                          <div 
                            className="bg-blue-400 h-1 rounded-full" 
                            style={{ width: `${(badge.progress / (badge.rarity === 'epic' ? 50 : 5)) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )
                  )}
                </div>
                
                {badge.earned && (
                  <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
                    <Star className="text-white" size={12} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Trophy className="mr-2 text-yellow-400" size={24} />
              Campus Leaderboard
            </h2>
            <div className="space-y-3">
              {leaderboard.map((player, index) => (
                <div key={player.rank} className="flex items-center space-x-4 p-3 bg-gray-700 rounded-lg">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    index === 0 ? 'bg-yellow-500 text-black' :
                    index === 1 ? 'bg-gray-400 text-black' :
                    index === 2 ? 'bg-orange-600 text-white' :
                    'bg-gray-600 text-white'
                  }`}>
                    {player.rank}
                  </div>
                  <div className="text-2xl">{player.avatar}</div>
                  <div className="flex-1">
                    <p className="font-semibold text-white">{player.name}</p>
                    <p className="text-gray-400 text-sm">Level {player.level}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-yellow-400">{player.points.toLocaleString()}</p>
                    <p className="text-gray-400 text-sm">XP</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-blue-600/20 border border-blue-600/50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center font-bold text-white">
                    {userProfile.rank}
                  </div>
                  <div>
                    <p className="font-semibold text-white">You</p>
                    <p className="text-blue-300 text-sm">Level {userProfile.level}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-yellow-400">{userProfile.points.toLocaleString()}</p>
                  <p className="text-blue-300 text-sm">XP</p>
                </div>
              </div>
            </div>
          </div>

          {/* Rewards Store */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Gift className="mr-2 text-pink-400" size={24} />
              Rewards Store
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">🍕</div>
                  <div>
                    <p className="font-semibold text-white">Free Pizza Slice</p>
                    <p className="text-gray-400 text-sm">Canteen voucher</p>
                  </div>
                </div>
                <button className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded text-sm font-medium transition-colors">
                  500 XP
                </button>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl font-bold text-blue-400">STU</div>
                  <div>
                    <p className="font-semibold text-white">Study Room Priority</p>
                    <p className="text-gray-400 text-sm">Skip booking queue</p>
                  </div>
                </div>
                <button className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded text-sm font-medium transition-colors">
                  750 XP
                </button>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">🎫</div>
                  <div>
                    <p className="font-semibold text-white">Event VIP Pass</p>
                    <p className="text-gray-400 text-sm">Premium event access</p>
                  </div>
                </div>
                <button className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded text-sm font-medium transition-colors">
                  1000 XP
                </button>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg opacity-50">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl font-bold text-yellow-400">LEG</div>
                  <div>
                    <p className="font-semibold text-white">Campus Legend Badge</p>
                    <p className="text-gray-400 text-sm">Exclusive recognition</p>
                  </div>
                </div>
                <button className="bg-gray-600 px-4 py-2 rounded text-sm font-medium cursor-not-allowed">
                  5000 XP
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gamification;
