// Simple Chart Library for AI Adoption Metrics
class SimpleChart {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.colors = {
            darkPurple: '#200A58',
            cgiPurple: '#5236AB',
            purpleVivid: '#9E83F5',
            purpleMedium: '#CBC3E6',
            success: '#1AB977',
            warning: '#FFAC25',
            error: '#B00020'
        };
        this.setupCanvas();
    }

    setupCanvas() {
        // Set up high DPI canvas
        const rect = this.canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.ctx.scale(dpr, dpr);
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawLineChart(data, options = {}) {
        this.clear();
        
        if (!data || data.length === 0) {
            this.drawEmptyState();
            return;
        }

        const padding = options.padding || 60;
        const width = this.canvas.offsetWidth - (padding * 2);
        const height = this.canvas.offsetHeight - (padding * 2);

        // Find data ranges
        const allValues = data.flatMap(item => 
            Object.values(item).filter(val => typeof val === 'number')
        );
        const maxValue = Math.max(...allValues) * 1.1;
        const minValue = Math.min(0, Math.min(...allValues));

        // Draw axes
        this.drawAxes(padding, width, height, maxValue, minValue);

        // Draw lines for each metric
        const metrics = Object.keys(data[0]).filter(key => key !== 'month');
        const colors = [this.colors.cgiPurple, this.colors.purpleVivid, this.colors.success, this.colors.warning];

        metrics.forEach((metric, index) => {
            this.drawLine(data, metric, padding, width, height, maxValue, minValue, colors[index % colors.length]);
        });

        // Draw legend
        this.drawLegend(metrics, colors, padding, height);
    }

    drawLine(data, metric, padding, width, height, maxValue, minValue, color) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();

        data.forEach((item, index) => {
            const x = padding + (index / (data.length - 1)) * width;
            const y = padding + height - ((item[metric] - minValue) / (maxValue - minValue)) * height;
            
            if (index === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        });

        this.ctx.stroke();

        // Draw points
        this.ctx.fillStyle = color;
        data.forEach((item, index) => {
            const x = padding + (index / (data.length - 1)) * width;
            const y = padding + height - ((item[metric] - minValue) / (maxValue - minValue)) * height;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, 4, 0, 2 * Math.PI);
            this.ctx.fill();
        });
    }

    drawAxes(padding, width, height, maxValue, minValue) {
        this.ctx.strokeStyle = '#A8A8A8';
        this.ctx.lineWidth = 1;

        // Y-axis
        this.ctx.beginPath();
        this.ctx.moveTo(padding, padding);
        this.ctx.lineTo(padding, padding + height);
        this.ctx.stroke();

        // X-axis
        this.ctx.beginPath();
        this.ctx.moveTo(padding, padding + height);
        this.ctx.lineTo(padding + width, padding + height);
        this.ctx.stroke();

        // Y-axis labels
        this.ctx.fillStyle = '#333333';
        this.ctx.font = '12px sans-serif';
        this.ctx.textAlign = 'right';
        this.ctx.textBaseline = 'middle';

        for (let i = 0; i <= 5; i++) {
            const value = minValue + (maxValue - minValue) * (i / 5);
            const y = padding + height - (i / 5) * height;
            this.ctx.fillText(Math.round(value), padding - 10, y);
        }
    }

    drawLegend(metrics, colors, padding, height) {
        this.ctx.font = '12px sans-serif';
        this.ctx.textAlign = 'left';
        
        metrics.forEach((metric, index) => {
            const x = padding + index * 120;
            const y = padding + height + 30;
            
            // Draw color indicator
            this.ctx.fillStyle = colors[index % colors.length];
            this.ctx.fillRect(x, y - 6, 12, 12);
            
            // Draw text
            this.ctx.fillStyle = '#333333';
            this.ctx.fillText(this.formatMetricName(metric), x + 18, y);
        });
    }

    drawBarChart(data, options = {}) {
        this.clear();
        
        if (!data || data.length === 0) {
            this.drawEmptyState();
            return;
        }

        const padding = options.padding || 60;
        const width = this.canvas.offsetWidth - (padding * 2);
        const height = this.canvas.offsetHeight - (padding * 2);

        const maxValue = Math.max(...data.map(item => item.value)) * 1.1;
        const barWidth = width / data.length * 0.8;
        const barSpacing = width / data.length * 0.2;

        // Draw axes
        this.drawAxes(padding, width, height, maxValue, 0);

        // Draw bars
        data.forEach((item, index) => {
            const barHeight = (item.value / maxValue) * height;
            const x = padding + index * (barWidth + barSpacing) + barSpacing / 2;
            const y = padding + height - barHeight;

            this.ctx.fillStyle = item.color || this.colors.cgiPurple;
            this.ctx.fillRect(x, y, barWidth, barHeight);

            // Draw labels
            this.ctx.fillStyle = '#333333';
            this.ctx.font = '12px sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(item.label, x + barWidth / 2, padding + height + 20);
            
            // Draw values on top of bars
            this.ctx.textBaseline = 'bottom';
            this.ctx.fillText(item.value.toFixed(1) + '%', x + barWidth / 2, y - 5);
        });
    }

    drawEmptyState() {
        this.ctx.fillStyle = '#A8A8A8';
        this.ctx.font = '16px sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(
            'No data available', 
            this.canvas.offsetWidth / 2, 
            this.canvas.offsetHeight / 2
        );
    }

    formatMetricName(metric) {
        const names = {
            // Talent metrics
            'peopleCount': 'Total People',
            'licenseUsers': 'License Users',
            'premiumRequests': 'Premium Requests',
            'aiCoverage': 'AI Coverage %',
            // Client metrics
            'totalClients': 'Total Clients',
            'aiPermissionClients': 'AI Permission Clients',
            'fixedPriceProjects': 'Fixed Price Projects'
        };
        return names[metric] || metric;
    }
}

// Export for use in main app
window.SimpleChart = SimpleChart;