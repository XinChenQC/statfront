import { useEffect, useRef } from 'react';
import { calculateUserGrowth, calculateCountryDistribution } from '../statistics/userStats';
import type { User } from '../types';
import Chart from 'chart.js/auto';

interface UserStatisticsProps {
  users: User[];
}

export const UserStatistics = ({ users }: UserStatisticsProps) => {
  const growthChartRef = useRef<HTMLCanvasElement>(null);
  const countryChartRef = useRef<HTMLCanvasElement>(null);
  const growthChartInstance = useRef<Chart | null>(null);
  const countryChartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!users.length) return;

    // Destroy existing charts
    growthChartInstance.current?.destroy();
    countryChartInstance.current?.destroy();

    // User Growth Chart
    const growthData = calculateUserGrowth(users);
    const growthCtx = growthChartRef.current?.getContext('2d');
    if (growthCtx) {
      growthChartInstance.current = new Chart(growthCtx, {
        type: 'line',
        data: {
          labels: growthData.map(d => d.date),
          datasets: [{
            label: 'New Users',
            data: growthData.map(d => d.count),
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            title: {
              display: true,
              text: 'Total Users Over Time'
            }
          }
        }
      });
    }

    // Country Distribution Chart
    const countryData = calculateCountryDistribution(users);
    const countryCtx = countryChartRef.current?.getContext('2d');
    if (countryCtx) {
      countryChartInstance.current = new Chart(countryCtx, {
        type: 'pie',
        data: {
          labels: countryData.map(d => d.country),
          datasets: [{
            data: countryData.map(d => d.count),
            backgroundColor: [
              'rgb(255, 99, 132)',
              'rgb(54, 162, 235)',
              'rgb(255, 205, 86)',
              'rgb(75, 192, 192)',
              'rgb(153, 102, 255)',
              'rgb(201, 203, 207)',
              'rgb(255, 159, 64)',
              'rgb(102, 255, 204)',
              'rgb(204, 102, 255)',
              'rgb(255, 204, 102)',
            ]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,  // ✅ 关键：不保持宽高比
          plugins: {
            title: {
              display: true,
              text: 'User Distribution by Country',
              align: 'center',
              padding: { top: 10, bottom: 10 }
            },
            legend: {
              position: 'right',  // ✅ 更好地腾出空间
              labels: {
                boxWidth: 12,
                padding: 10
              }
            }
          }
        }
      });
    }

    return () => {
      growthChartInstance.current?.destroy();
      countryChartInstance.current?.destroy();
    };
  }, [users]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* User Growth Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <canvas ref={growthChartRef}></canvas>
      </div>

      {/* Country Distribution Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="w-full h-[500px] relative"> 
          <canvas ref={countryChartRef}></canvas>
        </div>
      </div>
    </div>
  );
};
