
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Product } from '../types';

interface ComparisonChartProps {
  products: Product[];
}

const ComparisonChart: React.FC<ComparisonChartProps> = ({ products }) => {
  const data = products.map(p => ({
    name: p.store,
    price: parseFloat(p.price.replace(/[$,]/g, '')),
    originalPrice: p.price
  })).sort((a, b) => a.price - b.price);

  if (data.length === 0) return null;

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm mt-8">
      <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
        <i className="fas fa-chart-bar text-indigo-500"></i> Price Distribution
      </h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
            <YAxis hide />
            <Tooltip 
              cursor={{ fill: '#f8fafc' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white p-3 border rounded-xl shadow-xl border-slate-100">
                      <p className="font-bold text-slate-900">{payload[0].payload.name}</p>
                      <p className="text-indigo-600 font-medium">{payload[0].payload.originalPrice}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="price" radius={[8, 8, 0, 0]} barSize={40}>
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={index === 0 ? '#4f46e5' : '#cbd5e1'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ComparisonChart;
