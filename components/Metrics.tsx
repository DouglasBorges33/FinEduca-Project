

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import type { Theme } from '../themes';
import type { PointEvent } from '../types';

interface MetricsProps {
    pointsHistory: PointEvent[];
    activeTheme: Theme;
}

const Metrics: React.FC<MetricsProps> = ({ pointsHistory, activeTheme }) => {
    // Group points by day
    const pointsByDay = pointsHistory.reduce((acc, event) => {
        const date = new Date(event.timestamp);
        date.setHours(0,0,0,0);
        const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD for sorting
        
        if (!acc[dateString]) {
            acc[dateString] = 0;
        }
        acc[dateString] += event.points;
        return acc;
    }, {} as Record<string, number>);

    // Convert to array, sort, and format for the chart
    const chartData = Object.entries(pointsByDay)
        .map(([date, points]) => ({ date, points }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map(item => ({
            name: new Date(item.date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' }),
            Pontos: item.points
        }));

    const primaryColor = `rgb(${activeTheme.colors['--color-primary']})`;

    return (
        <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 h-full flex flex-col">
            <h2 className="text-xl font-bold mb-4">Evolução dos Pontos</h2>
            {chartData.length > 0 ? (
                <div className="flex-grow" style={{ width: '100%', minHeight: 250 }}>
                    <ResponsiveContainer>
                        <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-grid-line)" />
                            <XAxis dataKey="name" stroke="var(--color-text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="var(--color-text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                cursor={{fill: 'rgba(125, 125, 125, 0.1)'}}
                                contentStyle={{ 
                                    backgroundColor: 'var(--color-tooltip-bg)', 
                                    border: '1px solid var(--color-tooltip-border)', 
                                    color: 'var(--color-text-primary)', 
                                    borderRadius: '0.5rem' 
                                }}
                            />
                            <Bar dataKey="Pontos" fill={primaryColor} radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <div className="flex-grow flex items-center justify-center">
                    <p className="text-slate-500 dark:text-slate-400 text-center">Complete atividades para ver seu progresso aqui!</p>
                </div>
            )}
        </div>
    );
};

export default Metrics;