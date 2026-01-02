"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TrendingUp,
  DollarSign,
  Package,
  Users,
  ShoppingCart,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState("month");

  // Sample data for graphs
  const monthlyData = [
    { name: "Jan", production: 4000, sales: 2400, revenue: 24000 },
    { name: "Feb", production: 3000, sales: 1398, revenue: 22100 },
    { name: "Mar", production: 2000, sales: 9800, revenue: 22900 },
    { name: "Apr", production: 2780, sales: 3908, revenue: 20000 },
    { name: "May", production: 1890, sales: 4800, revenue: 21810 },
    { name: "Jun", production: 2390, sales: 3800, revenue: 25000 },
  ];

  const weeklyData = [
    { name: "Week 1", production: 1200, sales: 800, revenue: 6000 },
    { name: "Week 2", production: 1500, sales: 900, revenue: 7500 },
    { name: "Week 3", production: 1800, sales: 1100, revenue: 8200 },
    { name: "Week 4", production: 1400, sales: 950, revenue: 7100 },
  ];

  const yearlyData = [
    { name: "2020", production: 12000, sales: 8000, revenue: 80000 },
    { name: "2021", production: 15000, sales: 9500, revenue: 95000 },
    { name: "2022", production: 18000, sales: 11000, revenue: 110000 },
    { name: "2023", production: 22000, sales: 14000, revenue: 140000 },
    { name: "2024", production: 25000, sales: 16000, revenue: 160000 },
  ];

  const pieData = [
    { name: "Production", value: 400, color: "#3B82F6" },
    { name: "Sales", value: 300, color: "#10B981" },
    { name: "Inventory", value: 200, color: "#F59E0B" },
    { name: "Employees", value: 100, color: "#8B5CF6" },
  ];

  const getData = () => {
    switch (timeRange) {
      case "week":
        return weeklyData;
      case "year":
        return yearlyData;
      default:
        return monthlyData;
    }
  };

  const currentData = getData();

  return (
    <div className="space-y-6">
      {/* Header with Time Range Selector */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-black">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Track your business metrics and performance
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <div className="text-sm text-gray-500">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Package className="w-8 h-8 text-blue-600" />
              <span className="text-xs font-medium text-blue-600">+12%</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">1,234</div>
            <p className="text-sm text-blue-700">Total Production</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Users className="w-8 h-8 text-green-600" />
              <span className="text-xs font-medium text-green-600">+5%</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">89</div>
            <p className="text-sm text-green-700">Active Employees</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <ShoppingCart className="w-8 h-8 text-purple-600" />
              <span className="text-xs font-medium text-purple-600">+18%</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">456</div>
            <p className="text-sm text-purple-700">Sales Orders</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <DollarSign className="w-8 h-8 text-orange-600" />
              <span className="text-xs font-medium text-orange-600">+22%</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">$89,432</div>
            <p className="text-sm text-orange-700">Revenue</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart - Production & Sales Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Production & Sales Trend
            </CardTitle>
            <CardDescription>
              Track production and sales over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={currentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="production"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ fill: "#3B82F6" }}
                />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ fill: "#10B981" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Area Chart - Revenue */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Revenue Overview
            </CardTitle>
            <CardDescription>
              Revenue trends over selected period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={currentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#F59E0B"
                  fill="#F59E0B"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart - Production Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="w-5 h-5 mr-2" />
              Production Analysis
            </CardTitle>
            <CardDescription>Production volume comparison</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={currentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="production" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart - Department Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Department Distribution
            </CardTitle>
            <CardDescription>
              Resource allocation across departments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${((percent || 0) * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
