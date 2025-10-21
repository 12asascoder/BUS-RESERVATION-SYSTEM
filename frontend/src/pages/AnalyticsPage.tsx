import React from 'react'
import { useData } from '../contexts/DataContext'
import { useWebSocket } from '../contexts/WebSocketContext'
import { 
  ChartBarIcon,
  ArrowTrendingUpIcon,
  BoltIcon,
  HeartIcon,
  ClockIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

const AnalyticsPage: React.FC = () => {
  const { systemStats, buses } = useData()
  const { isConnected } = useWebSocket()
  const energyData = [
    { name: 'Jan', efficiency: 85, fuel: 120, greenScore: 88 },
    { name: 'Feb', efficiency: 87, fuel: 115, greenScore: 90 },
    { name: 'Mar', efficiency: 89, fuel: 110, greenScore: 92 },
    { name: 'Apr', efficiency: 91, fuel: 105, greenScore: 94 },
    { name: 'May', efficiency: 88, fuel: 108, greenScore: 91 },
    { name: 'Jun', efficiency: 93, fuel: 102, greenScore: 96 }
  ]

  const busPerformance = [
    { name: 'SB-001', trips: 45, efficiency: 92, satisfaction: 94 },
    { name: 'SB-002', trips: 38, efficiency: 89, satisfaction: 91 },
    { name: 'SB-003', trips: 52, efficiency: 87, satisfaction: 88 },
    { name: 'SB-004', trips: 41, efficiency: 95, satisfaction: 96 }
  ]

  const routeAnalytics = [
    { name: 'Mumbai-Delhi', passengers: 1200, revenue: 3000000, efficiency: 88 },
    { name: 'Bangalore-Chennai', passengers: 980, revenue: 1176000, efficiency: 92 },
    { name: 'Delhi-Jaipur', passengers: 750, revenue: 600000, efficiency: 85 },
    { name: 'Kolkata-Hyderabad', passengers: 1100, revenue: 1980000, efficiency: 90 }
  ]

  const pieData = [
    { name: 'Excellent', value: 45, color: '#10B981' },
    { name: 'Good', value: 35, color: '#3B82F6' },
    { name: 'Average', value: 15, color: '#F59E0B' },
    { name: 'Poor', value: 5, color: '#EF4444' }
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <p>Comprehensive insights into fleet performance and sustainability metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <BoltIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium">Energy Efficiency</p>
              <p className="text-2xl font-bold">{systemStats.energyEfficiency.toFixed(1)}%</p>
              <p className="text-xs text-green-600">+2.3% from last month</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <HeartIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium">Green Score</p>
              <p className="text-2xl font-bold">{systemStats.greenScore.toFixed(1)}</p>
              <p className="text-xs text-green-600">+1.8 from last month</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <ArrowTrendingUpIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium">Fuel Savings</p>
              <p className="text-2xl font-bold">18.5%</p>
              <p className="text-xs text-green-600">₹8,24,000 saved</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium">On-Time Rate</p>
              <p className="text-2xl font-bold">96.8%</p>
              <p className="text-xs text-green-600">+0.5% from last month</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Energy Efficiency Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={energyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="efficiency" stroke="#10B981" strokeWidth={2} />
              <Line type="monotone" dataKey="greenScore" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Fuel Consumption</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={energyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="fuel" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bus Performance */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Bus Performance Analysis</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Bus
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Trips
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Efficiency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Satisfaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {busPerformance.map((bus) => (
                <tr key={bus.name}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {bus.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {bus.trips}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {bus.efficiency}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {bus.satisfaction}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`sensor-indicator ${
                      bus.efficiency >= 90 ? 'sensor-good' : 
                      bus.efficiency >= 80 ? 'sensor-warning' : 'sensor-danger'
                    }`}>
                      {bus.efficiency >= 90 ? 'Excellent' : 
                       bus.efficiency >= 80 ? 'Good' : 'Needs Attention'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Route Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Route Performance</h3>
          <div className="space-y-4">
            {routeAnalytics.map((route) => (
              <div key={route.name} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{route.name}</h4>
                  <span className="sensor-indicator sensor-good">{route.efficiency}%</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p>Passengers: {route.passengers.toLocaleString()}</p>
                    <p>Revenue: ₹{(route.revenue / 100000).toFixed(1)}L</p>
                  </div>
                  <div className="text-right">
                    <p>Efficiency: {route.efficiency}%</p>
                    <p>Avg. Revenue: ₹{(route.revenue / route.passengers).toFixed(0)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Customer Satisfaction</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 flex flex-wrap justify-center space-x-4">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm">{item.name} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sustainability Metrics */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Sustainability Impact</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-green-50 rounded-lg">
            <div className="text-3xl font-bold text-green-600 mb-2">2,847</div>
            <div className="text-sm">CO₂ Saved (kg)</div>
            <div className="text-xs text-green-600 mt-1">+12% this month</div>
          </div>
          <div className="text-center p-6 bg-blue-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600 mb-2">1,156</div>
            <div className="text-sm">Liters Fuel Saved</div>
            <div className="text-xs text-blue-600 mt-1">+8% this month</div>
          </div>
          <div className="text-center p-6 bg-purple-50 rounded-lg">
            <div className="text-3xl font-bold text-purple-600 mb-2">94.2</div>
            <div className="text-sm">Overall Green Score</div>
            <div className="text-xs text-purple-600 mt-1">+1.5 this month</div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">AI Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Route Optimization</h4>
            <p className="text-sm text-blue-700">
              Consider adjusting departure times for Route Delhi-Jaipur to improve efficiency by 3.2%.
            </p>
          </div>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">Driver Training</h4>
            <p className="text-sm text-green-700">
              Schedule eco-driving training for drivers on Bus SB-003 to improve fuel efficiency.
            </p>
          </div>
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <h4 className="font-medium text-purple-800 mb-2">Maintenance Alert</h4>
            <p className="text-sm text-purple-700">
              Bus SB-002 shows signs of decreased efficiency. Schedule maintenance check.
            </p>
          </div>
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <h4 className="font-medium text-orange-800 mb-2">Capacity Optimization</h4>
            <p className="text-sm text-orange-700">
              Route Bangalore-Chennai shows high demand. Consider adding more trips during peak hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsPage
