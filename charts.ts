import { 
    Chart,
    ChartConfiguration,
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    PieController,
    ArcElement,
    Legend,
    Tooltip
} from 'chart.js';

// Register the required components
Chart.register(
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    PieController,
    ArcElement,
    Legend,
    Tooltip
);

document.addEventListener('DOMContentLoaded', () => {
    const usageCtx = document.getElementById('usageChart') as HTMLCanvasElement;
    const distributionCtx = document.getElementById('distributionChart') as HTMLCanvasElement;

    if (!usageCtx || !distributionCtx) {
        console.error('Chart canvases not found');
        return;
    }

    const usageConfig: ChartConfiguration = {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'User Activity',
                data: [65, 59, 80, 81, 56, 55],
                borderColor: '#3498db',
                tension: 0.1
            }]
        }
    };

    const distributionConfig: ChartConfiguration = {
        type: 'pie',
        data: {
            labels: ['Active', 'Inactive', 'New'],
            datasets: [{
                data: [300, 50, 100],
                backgroundColor: ['#3498db', '#e74c3c', '#2ecc71']
            }]
        }
    };

    new Chart(usageCtx, usageConfig);
    new Chart(distributionCtx, distributionConfig);
}); 