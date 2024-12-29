

import React, { useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import './App.css';


Chart.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const centerTextPlugin = {
    id: 'centerText',
    afterDraw: (chart) => {
        const { ctx, chartArea: { width, height } } = chart;
        const centerX = width / 2;
        const centerY = height / 2;
        const text = chart.config.options.plugins.centerText.text;

        if (!text) return;

        ctx.save();
        ctx.fillStyle = chart.config.options.plugins.centerText.color || '#000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        let fontSize = chart.config.options.plugins.centerText.fontSize || 20;
        const fontStyle = chart.config.options.plugins.centerText.fontStyle || 'bold';
        const fontFamily = chart.config.options.plugins.centerText.fontFamily || 'Arial';
        ctx.font = `${fontStyle} ${fontSize}px ${fontFamily}`;

        const wrapText = (text, maxWidth, maxLines) => {
            const words = text.split(' ');
            const lines = [];
            let currentLine = '';

            words.forEach(word => {
                const testLine = currentLine ? `${currentLine} ${word}` : word;
                const metrics = ctx.measureText(testLine);
                const testWidth = metrics.width;

                if (testWidth > maxWidth && currentLine) {
                    lines.push(currentLine);
                    currentLine = word;
                } else {
                    currentLine = testLine;
                }
            });

            if (currentLine) {
                lines.push(currentLine);
            }
            
            if (lines.length > maxLines) {
                const truncatedLines = lines.slice(0, maxLines);
                const lastLine = truncatedLines[maxLines - 1];
                truncatedLines[maxLines - 1] = lastLine + '...';
                return truncatedLines;
            }

            return lines;
        };
        const maxWidth = width / 5;
        const maxLines = 3;
        const lines = wrapText(text, maxWidth, maxLines);

        if (lines.length === maxLines && text.length > 20) {
            fontSize = 16;
            ctx.font = `${fontStyle} ${fontSize}px ${fontFamily}`;
        }

        const lineHeight = fontSize + 5;
        const totalHeight = lines.length * lineHeight;
        let startY = centerY - totalHeight / 2 + lineHeight / 2;

        lines.forEach(line => {
            ctx.fillText(line, centerX, startY);
            startY += lineHeight;
        });

        ctx.restore();
    }
};

function App() {
    const [labels, setLabels] = useState([]);
    const [dataValues, setDataValues] = useState([]);
    const [newLabel, setNewLabel] = useState('');
    const [newValue, setNewValue] = useState('');
    const [centerText, setCenterText] = useState('');

    const handleAddData = (e) => {
        e.preventDefault();
        if (newLabel.trim() === '' || newValue === '') {
            alert('Vui lòng nhập đầy đủ nhãn và giá trị.');
            return;
        }

        setLabels([...labels, newLabel]);
        setDataValues([...dataValues, Number(newValue)]);
        setNewLabel('');
        setNewValue('');
    };

    const total = dataValues.reduce((acc, value) => acc + value, 0);

    const data = {
        labels: labels,
        datasets: [
            {
                label: '# of Votes',
                data: dataValues,
                backgroundColor: generateColors(dataValues.length),
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const label = context.label || '';
                        const value = context.parsed || 0;
                        const percentage = total ? ((value / total) * 100).toFixed(2) : 0;
                        return `${label}: ${percentage}%`;
                    },
                },
            },
            legend: {
                position: 'bottom',
            },
            centerText: {
                text: centerText && dataValues.length > 0 ? centerText : '',
                fontSize: 20,
                fontStyle: 'bold',
                fontFamily: 'Arial',
                color: '#000',
            },
            datalabels: {
                color: '#000',
                formatter: (value, context) => {
                    const percentage = total ? ((value / total) * 100).toFixed(2) : 0;
                    return `${context.chart.data.labels[context.dataIndex]}: ${percentage}%`;
                },
                anchor: 'end',
                align: 'start',
                offset: 10,
                borderWidth: 1,
                borderColor: '#fff',
                borderRadius: 4,
                backgroundColor: '#fff',
                font: {
                    weight: 'bold',
                    size: 12,
                },
            },
        },
        cutout: '50%',
    };

    function generateColors(num) {
        const colors = [];
        const predefinedColors = [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(199, 199, 199, 0.6)',
            'rgba(83, 102, 255, 0.6)',
            'rgba(255, 102, 255, 0.6)',
            'rgba(102, 255, 178, 0.6)',
        ];

        for (let i = 0; i < num; i++) {
            if (i < predefinedColors.length) {
                colors.push(predefinedColors[i]);
            } else {
                const r = Math.floor(Math.random() * 255);
                const g = Math.floor(Math.random() * 255);
                const b = Math.floor(Math.random() * 255);
                colors.push(`rgba(${r}, ${g}, ${b}, 0.6)`);
            }
        }
        return colors;
    }

    return (
        <div className="App">
            <h1>Biểu Đồ Doughnut với Chart.js</h1>

            <form onSubmit={handleAddData}>
                <div>
                    <label>Nhãn:</label>
                    <input
                        type="text"
                        value={newLabel}
                        onChange={(e) => setNewLabel(e.target.value)}
                        placeholder="Nhập nhãn"
                    />
                </div>
                <div>
                    <label>Giá trị:</label>
                    <input
                        type="number"
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                        placeholder="Nhập giá trị"
                    />
                </div>
                <div>
                    <label>Tên Biểu Đồ:</label>
                    <input
                        type="text"
                        value={centerText}
                        onChange={(e) => setCenterText(e.target.value)}
                        placeholder="Nhập tên biểu đồ"
                    />
                </div>
                <button type="submit">Thêm Dữ Liệu</button>
            </form>

            <div className="chart-container">
                {labels.length > 0 && dataValues.length > 0 && centerText.trim() !== '' ? (
                    <Doughnut data={data} options={options} plugins={[centerTextPlugin]} />
                ) : (
                    <p>Vui lòng nhập dữ liệu và tên biểu đồ để hiển thị biểu đồ.</p>
                )}
            </div>
        </div>
    );
}

export default App;
