// src/components/RevenueChart.js

import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import './RevenueChart.css';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Đăng ký các thành phần cần thiết cho Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const RevenueChart = ({ data, companyName }) => {
    const total = data.reduce((acc, item) => acc + item.amount, 0);

    const chartData = {
        labels: data.map((item) => item.source),
        datasets: [
            {
                data: data.map((item) =>
                    Number(((item.amount / total) * 100).toFixed(2))
                ),
                backgroundColor: generateColors(data.length),
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false, // Để dễ dàng tùy chỉnh kích thước
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const label = context.label || '';
                        const value = context.parsed || 0;
                        const amount = data[context.dataIndex].amount;
                        return `${label}: ${value}% (${formatNumber(amount)} VNĐ)`;
                    },
                },
            },
            legend: {
                position: 'right', // Hiển thị legend bên phải
                labels: {
                    generateLabels: (chart) => {
                        const data = chart.data;
                        if (data.labels.length && data.datasets.length) {
                            return data.labels.map((label, i) => {
                                const dataset = data.datasets[0];
                                const backgroundColor = dataset.backgroundColor[i];
                                const value = dataset.data[i];
                                return {
                                    text: `${label} (${value}%)`,
                                    fillStyle: backgroundColor,
                                    strokeStyle: backgroundColor,
                                    index: i,
                                };
                            });
                        }
                        return [];
                    },
                },
            },
        },
        cutout: '50%', // Tạo hình rỗng ruột (doughnut)
    };

    // Hàm tạo màu ngẫu nhiên
    function generateColors(num) {
        const colors = [];
        for (let i = 0; i < num; i++) {
            const r = Math.floor(Math.random() * 255);
            const g = Math.floor(Math.random() * 255);
            const b = Math.floor(Math.random() * 255);
            colors.push(`rgba(${r}, ${g}, ${b}, 0.6)`);
        }
        return colors;
    }

    // Hàm định dạng số tiền
    function formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    return (
        <div className="chart-container">
            <h2>Biểu Đồ Doanh Thu</h2>
            <div className="doughnut-chart-wrapper">
                <Doughnut data={chartData} options={options} />
                <div className="chart-center-text">
                    {companyName}
                </div>
            </div>
        </div>
    );
};

export default RevenueChart;
