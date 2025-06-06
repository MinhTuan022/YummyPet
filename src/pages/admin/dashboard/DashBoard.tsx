import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts';
import './Dashboard.scss';

const Dashboard = () => {
  // Sample data for charts
  const revenueData = [
    { month: 'Jan', online: 45, offline: 35 },
    { month: 'Feb', online: 52, offline: 42 },
    { month: 'Mar', online: 48, offline: 38 },
    { month: 'Apr', online: 61, offline: 45 },
    { month: 'May', online: 55, offline: 52 },
    { month: 'Jun', online: 67, offline: 48 },
    { month: 'Jul', online: 43, offline: 41 },
    { month: 'Aug', online: 58, offline: 44 }
  ];

  const visitorData = [
    { day: 'Mon', newCustomers: 120, repeatCustomers: 80, uniqueCustomers: 100 },
    { day: 'Tue', newCustomers: 150, repeatCustomers: 90, uniqueCustomers: 120 },
    { day: 'Wed', newCustomers: 180, repeatCustomers: 110, uniqueCustomers: 140 },
    { day: 'Thu', newCustomers: 160, repeatCustomers: 100, uniqueCustomers: 130 },
    { day: 'Fri', newCustomers: 200, repeatCustomers: 130, uniqueCustomers: 160 },
    { day: 'Sat', newCustomers: 170, repeatCustomers: 120, uniqueCustomers: 150 },
    { day: 'Sun', newCustomers: 140, repeatCustomers: 95, uniqueCustomers: 125 }
  ];

  const satisfactionData = [
    { month: 'Jan', satisfaction: 85 },
    { month: 'Feb', satisfaction: 87 },
    { month: 'Mar', satisfaction: 82 },
    { month: 'Apr', satisfaction: 89 },
    { month: 'May', satisfaction: 86 },
    { month: 'Jun', satisfaction: 91 }
  ];

  const targetData = [
    { month: 'Jan', reality: 85, target: 90 },
    { month: 'Feb', reality: 92, target: 95 },
    { month: 'Mar', reality: 78, target: 85 },
    { month: 'Apr', reality: 96, target: 100 },
    { month: 'May', reality: 88, target: 90 },
    { month: 'Jun', reality: 94, target: 98 }
  ];

  const volumeServiceData = [
    { service: 'Live', volume: 85 },
    { service: 'Bot', volume: 65 }
  ];

  const topProducts = [
    { name: 'Home Decor Range', progress: 85, sales: '2.1M' },
    { name: 'Disney Princess Doll Bag', progress: 70, sales: '1.8M' },
    { name: 'Bathroom Essentials', progress: 65, sales: '1.2M' },
    { name: 'Apple Smart Watches', progress: 45, sales: '0.9M' }
  ];

  return (
    <div className="dashboard">
      {/* <div className="dashboard-header">
        <h1>Dashboard</h1>
      </div> */}
      
      <div className="dashboard-grid">
        {/* Today's Sales */}
        <div className="section sales-summary">
          <div className="section-header">
            <h2>Today's Sales</h2>
            <p>Sales Summary</p>
          </div>
          <div className="metrics-row">
            <div className="metric-card total-sales">
              <div className="metric-icon">📊</div>
              <div className="metric-info">
                <h3>$1k</h3>
                <p>Total Sales</p>
                <span className="change positive">+8% from yesterday</span>
              </div>
            </div>
            <div className="metric-card total-order">
              <div className="metric-icon">📦</div>
              <div className="metric-info">
                <h3>300</h3>
                <p>Total Order</p>
                <span className="change positive">+5% from yesterday</span>
              </div>
            </div>
            <div className="metric-card product-sold">
              <div className="metric-icon">✅</div>
              <div className="metric-info">
                <h3>5</h3>
                <p>Product Sold</p>
                <span className="change positive">+1.2% from yesterday</span>
              </div>
            </div>
            <div className="metric-card new-customers">
              <div className="metric-icon">👥</div>
              <div className="metric-info">
                <h3>8</h3>
                <p>New Customers</p>
                <span className="change positive">+0.5% from yesterday</span>
              </div>
            </div>
          </div>
        </div>

        {/* Visitor Insights */}
        <div className="section visitor-insights">
          <div className="section-header">
            <h2>Visitor Insights</h2>
            <button className="report-btn">📊 Report</button>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={visitorData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Line type="monotone" dataKey="newCustomers" stroke="#8884d8" strokeWidth={2} />
                <Line type="monotone" dataKey="repeatCustomers" stroke="#82ca9d" strokeWidth={2} />
                <Line type="monotone" dataKey="uniqueCustomers" stroke="#ffc658" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
            <div className="legend">
              <div className="legend-item">
                <span className="legend-color" style={{backgroundColor: '#8884d8'}}></span>
                <span>New Customers</span>
              </div>
              <div className="legend-item">
                <span className="legend-color" style={{backgroundColor: '#82ca9d'}}></span>
                <span>Repeat Customers</span>
              </div>
              <div className="legend-item">
                <span className="legend-color" style={{backgroundColor: '#ffc658'}}></span>
                <span>Unique Customers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="section total-revenue">
          <h2>Total Revenue</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Bar dataKey="online" fill="#4f46e5" />
                <Bar dataKey="offline" fill="#06b6d4" />
              </BarChart>
            </ResponsiveContainer>
            <div className="legend">
              <div className="legend-item">
                <span className="legend-color" style={{backgroundColor: '#4f46e5'}}></span>
                <span>Online Sales</span>
              </div>
              <div className="legend-item">
                <span className="legend-color" style={{backgroundColor: '#06b6d4'}}></span>
                <span>Offline Sales</span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Satisfaction */}
        <div className="section customer-satisfaction">
          <h2>Customer Satisfaction</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={satisfactionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Area type="monotone" dataKey="satisfaction" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
            <div className="satisfaction-metrics">
              <div className="metric">
                <span className="label">Last Month</span>
                <span className="value">$3,004</span>
              </div>
              <div className="metric">
                <span className="label">This Month</span>
                <span className="value">$4,504</span>
              </div>
            </div>
          </div>
        </div>

        {/* Target vs Reality */}
        <div className="section target-reality">
          <h2>Target vs Reality</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={targetData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Bar dataKey="reality" fill="#eab308" />
                <Bar dataKey="target" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
            <div className="legend">
              <div className="legend-item">
                <span className="legend-color" style={{backgroundColor: '#eab308'}}></span>
                <span>Reality Sales</span>
              </div>
              <div className="legend-item">
                <span className="legend-color" style={{backgroundColor: '#22c55e'}}></span>
                <span>Target Sales</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="section top-products">
          <h2>Top Products</h2>
          <div className="products-list">
            {topProducts.map((product, index) => (
              <div key={index} className="product-item">
                <div className="product-number">{String(index + 1).padStart(2, '0')}</div>
                <div className="product-details">
                  <h4>{product.name}</h4>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{width: `${product.progress}%`}}
                    ></div>
                  </div>
                </div>
                <div className="product-sales">{product.sales}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Sales Mapping by Country */}
        <div className="section sales-mapping">
          <h2>Sales Mapping by Country</h2>
          <div className="world-map">
            <svg viewBox="0 0 400 200" className="map-svg">
              {/* Simplified world map representation */}
              <circle cx="100" cy="80" r="8" fill="#ef4444" />
              <circle cx="200" cy="60" r="12" fill="#3b82f6" />
              <circle cx="300" cy="90" r="6" fill="#10b981" />
              <circle cx="150" cy="120" r="10" fill="#f59e0b" />
              <circle cx="250" cy="110" r="8" fill="#8b5cf6" />
            </svg>
          </div>
        </div>

        {/* Volume vs Service Level */}
        <div className="section volume-service">
          <h2>Volume vs Service Level</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={volumeServiceData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="service" type="category" />
                <Bar dataKey="volume" fill="#06b6d4" />
              </BarChart>
            </ResponsiveContainer>
            <div className="legend">
              <div className="legend-item">
                <span className="legend-color" style={{backgroundColor: '#06b6d4'}}></span>
                <span>Live</span>
              </div>
              <div className="legend-item">
                <span className="legend-color" style={{backgroundColor: '#8b5cf6'}}></span>
                <span>Bot</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;