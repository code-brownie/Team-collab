/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const ProgressChart = ({ tasksCompleted = 0, totalTasks = 0 }) => {
    const [mounted, setMounted] = useState(false);
    const chartRef = useRef(null);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    const safeTasksCompleted = Number(tasksCompleted) || 0;
    const safeTotalTasks = Number(totalTasks) || 0;
    const pendingTasks = Math.max(0, safeTotalTasks - safeTasksCompleted);

    // Calculate completion percentage
    const completionPercentage = safeTotalTasks > 0
        ? ((safeTasksCompleted / safeTotalTasks) * 100).toFixed(0)
        : 0;

    const chartData = {
        labels: ['Completed', 'Pending'],
        datasets: [
            {
                data: [safeTasksCompleted, pendingTasks],
                backgroundColor: ['#10b981', '#e2e8f0'],
                borderWidth: 0,
                borderRadius: 5,
                spacing: 2,
            },
        ],
    };

    const chartOptions = {
        cutout: '75%',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const value = context.raw;
                        const total = safeTasksCompleted + pendingTasks;
                        const percentage = ((value / total) * 100).toFixed(0);
                        return `${context.label}: ${value} (${percentage}%)`;
                    },
                },
                backgroundColor: 'white',
                titleColor: 'black',
                bodyColor: 'black',
                bodyFont: {
                    size: 14,
                },
                padding: 12,
                cornerRadius: 8,
                displayColors: false,
                borderWidth: 1,
                borderColor: '#e2e8f0',
            },
        },
    };

    if (!mounted) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Progress Overview</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[200px] flex items-center justify-center">
                        <Skeleton className="h-[200px] w-[200px] rounded-full" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Progress Overview</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[200px] relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center z-10">
                            <div className="text-3xl font-bold animate-fadeIn">
                                {completionPercentage}%
                            </div>
                            <div className="text-sm text-gray-500 animate-fadeIn">Complete</div>
                        </div>
                    </div>
                    <Doughnut
                        ref={chartRef}
                        data={chartData}
                        options={chartOptions}
                    />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                    <div className="bg-gray-50 p-3 rounded-lg transform transition-all duration-500 hover:scale-105">
                        <div className="text-sm text-gray-500">Total Tasks</div>
                        <div className="text-xl font-bold">{safeTotalTasks}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg transform transition-all duration-500 hover:scale-105">
                        <div className="text-sm text-gray-500">Completed</div>
                        <div className="text-xl font-bold">{safeTasksCompleted}</div>
                    </div>
                </div>
                <div className="mt-4 flex justify-center gap-6">
                    {['#10b981', '#e2e8f0'].map((color, index) => (
                        <div
                            key={color}
                            className="flex items-center gap-2 animate-fadeIn"
                            style={{ animationDelay: `${index * 200}ms` }}
                        >
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: color }}
                            />
                            <span className="text-sm text-gray-600">
                                {index === 0 ? 'Completed' : 'Pending'}
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default ProgressChart;