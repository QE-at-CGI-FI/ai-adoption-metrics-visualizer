// AI Adoption Metrics Visualizer - Talent Pipeline
class TalentMetricsApp {
    constructor() {
        this.data = this.loadData();
        this.editingIndex = null;
        this.charts = {};
        
        this.init();
    }

    init() {
        this.updateDisplay();
        this.createCharts();
        this.updateCharts();
        this.updateDataTable();
        
        // Set default month to current month
        const currentDate = new Date();
        const currentMonth = currentDate.getFullYear() + '-' + String(currentDate.getMonth() + 1).padStart(2, '0');
        document.getElementById('month-input').value = currentMonth;
    }

    loadData() {
        const saved = localStorage.getItem('talentMetricsData');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error('Error loading data:', e);
            }
        }
        return [];
    }

    saveData() {
        localStorage.setItem('talentMetricsData', JSON.stringify(this.data));
    }

    getLatestData() {
        if (this.data.length === 0) return null;
        
        // Sort by date and return the most recent
        const sorted = [...this.data].sort((a, b) => new Date(b.month) - new Date(a.month));
        return sorted[0];
    }

    updateDisplay() {
        const latest = this.getLatestData();
        
        if (!latest) {
            // No data available
            this.clearDisplay();
            return;
        }

        // Update main tiles
        this.updateTile('partners-tile', latest.partners, null, latest.month);
        this.updateTile('license-tile', latest.license, this.calculatePercentage(latest.license, latest.partners), latest.month);
        this.updateTile('github-copilot-tile', latest.githubCopilot, this.calculatePercentage(latest.githubCopilot, latest.license), latest.month);
        this.updateTile('chatgpt-enterprise-tile', latest.chatgptEnterprise, this.calculatePercentage(latest.chatgptEnterprise, latest.license), latest.month);
        this.updateTile('production-tile', latest.production, this.calculatePercentage(latest.production, latest.license), latest.month);
        this.updateTile('ai-moment-tile', latest.aiMoment, this.calculatePercentage(latest.aiMoment, latest.partners), latest.month);

        // Update Copilot requests tile
        const requestsTile = document.getElementById('copilot-requests-tile');
        document.getElementById('requests-min').textContent = latest.requestsMin;
        document.getElementById('requests-avg').textContent = Number(latest.requestsAvg).toFixed(1);
        document.getElementById('requests-max').textContent = latest.requestsMax;
        requestsTile.querySelector('.metric-date').textContent = this.formatDate(latest.month);
    }

    updateTile(tileId, number, percentage, month) {
        const tile = document.getElementById(tileId);
        tile.querySelector('.metric-number').textContent = number || '-';
        
        const percentageElement = tile.querySelector('.metric-percentage');
        if (percentageElement) {
            percentageElement.textContent = percentage ? `${percentage}%` : '-';
        }
        
        tile.querySelector('.metric-date').textContent = month ? this.formatDate(month) : '-';
    }

    clearDisplay() {
        const tiles = document.querySelectorAll('.metric-tile');
        tiles.forEach(tile => {
            const numberEl = tile.querySelector('.metric-number');
            const percentageEl = tile.querySelector('.metric-percentage');
            const dateEl = tile.querySelector('.metric-date');
            
            if (numberEl) numberEl.textContent = '-';
            if (percentageEl) percentageEl.textContent = '-';
            if (dateEl) dateEl.textContent = '-';
        });

        // Clear requests tile
        document.getElementById('requests-min').textContent = '-';
        document.getElementById('requests-avg').textContent = '-';
        document.getElementById('requests-max').textContent = '-';
    }

    calculatePercentage(value, total) {
        if (!total || total === 0) return null;
        return Math.round((value / total) * 100);
    }

    formatDate(monthString) {
        const date = new Date(monthString + '-01');
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    }

    addData(formData) {
        const existingIndex = this.data.findIndex(item => item.month === formData.month);
        
        if (existingIndex !== -1) {
            // Update existing data
            this.data[existingIndex] = formData;
        } else {
            // Add new data
            this.data.push(formData);
        }
        
        this.saveData();
        this.updateDisplay();
        this.updateCharts();
        this.updateDataTable();
    }

    editData(index) {
        const item = this.data[index];
        this.editingIndex = index;
        
        // Populate form with existing data
        document.getElementById('month-input').value = item.month;
        document.getElementById('partners-input').value = item.partners;
        document.getElementById('license-input').value = item.license;
        document.getElementById('github-copilot-input').value = item.githubCopilot;
        document.getElementById('chatgpt-enterprise-input').value = item.chatgptEnterprise;
        document.getElementById('production-input').value = item.production;
        document.getElementById('requests-min-input').value = item.requestsMin;
        document.getElementById('requests-avg-input').value = item.requestsAvg;
        document.getElementById('requests-max-input').value = item.requestsMax;
        document.getElementById('ai-moment-input').value = item.aiMoment;
        
        // Update modal title and button
        document.getElementById('modal-title').textContent = 'Edit Monthly Data';
        document.getElementById('submit-btn').textContent = 'Update Data';
        
        openDataModal();
    }

    deleteData(index) {
        if (confirm('Are you sure you want to delete this data entry?')) {
            this.data.splice(index, 1);
            this.saveData();
            this.updateDisplay();
            this.updateCharts();
            this.updateDataTable();
        }
    }

    createCharts() {
        // Trends Chart
        const trendsCtx = document.getElementById('trendsChart').getContext('2d');
        this.charts.trends = new Chart(trendsCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Total Partners',
                        data: [],
                        borderColor: '#200A58',
                        backgroundColor: 'rgba(32, 10, 88, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: 'With License',
                        data: [],
                        borderColor: '#5236AB',
                        backgroundColor: 'rgba(82, 54, 171, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: 'Production Use',
                        data: [],
                        borderColor: '#9E83F5',
                        backgroundColor: 'rgba(158, 131, 245, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: 'AI Moment',
                        data: [],
                        borderColor: '#CBC3E6',
                        backgroundColor: 'rgba(203, 195, 230, 0.1)',
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0
                        }
                    }
                }
            }
        });

        // Adoption Rates Chart
        const adoptionCtx = document.getElementById('adoptionChart').getContext('2d');
        this.charts.adoption = new Chart(adoptionCtx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'License Adoption %',
                        data: [],
                        backgroundColor: '#5236AB'
                    },
                    {
                        label: 'Production Use %',
                        data: [],
                        backgroundColor: '#9E83F5'
                    },
                    {
                        label: 'AI Moment %',
                        data: [],
                        backgroundColor: '#CBC3E6'
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                }
            }
        });
    }

    updateCharts() {
        if (!this.data.length) return;

        // Sort data by date
        const sortedData = [...this.data].sort((a, b) => new Date(a.month) - new Date(b.month));
        
        // Update trends chart
        const labels = sortedData.map(item => this.formatDate(item.month));
        this.charts.trends.data.labels = labels;
        this.charts.trends.data.datasets[0].data = sortedData.map(item => item.partners);
        this.charts.trends.data.datasets[1].data = sortedData.map(item => item.license);
        this.charts.trends.data.datasets[2].data = sortedData.map(item => item.production);
        this.charts.trends.data.datasets[3].data = sortedData.map(item => item.aiMoment);
        this.charts.trends.update();

        // Update adoption rates chart
        this.charts.adoption.data.labels = labels;
        this.charts.adoption.data.datasets[0].data = sortedData.map(item => 
            this.calculatePercentage(item.license, item.partners) || 0
        );
        this.charts.adoption.data.datasets[1].data = sortedData.map(item => 
            this.calculatePercentage(item.production, item.partners) || 0
        );
        this.charts.adoption.data.datasets[2].data = sortedData.map(item => 
            this.calculatePercentage(item.aiMoment, item.partners) || 0
        );
        this.charts.adoption.update();
    }

    updateDataTable() {
        const tbody = document.getElementById('data-table-body');
        tbody.innerHTML = '';

        if (!this.data.length) {
            tbody.innerHTML = '<tr><td colspan="9" class="no-data">No data available. Add your first monthly entry!</td></tr>';
            return;
        }

        // Sort by date (newest first)
        const sortedData = [...this.data].sort((a, b) => new Date(b.month) - new Date(a.month));

        sortedData.forEach((item, originalIndex) => {
            const actualIndex = this.data.findIndex(d => d.month === item.month);
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${this.formatDate(item.month)}</td>
                <td>${item.partners}</td>
                <td>${item.license} (${this.calculatePercentage(item.license, item.partners) || 0}%)</td>
                <td>${item.githubCopilot} (${this.calculatePercentage(item.githubCopilot, item.license) || 0}%)</td>
                <td>${item.chatgptEnterprise} (${this.calculatePercentage(item.chatgptEnterprise, item.license) || 0}%)</td>
                <td>${item.production} (${this.calculatePercentage(item.production, item.partners) || 0}%)</td>
                <td>${item.requestsMin} / ${Number(item.requestsAvg).toFixed(1)} / ${item.requestsMax}</td>
                <td>${item.aiMoment} (${this.calculatePercentage(item.aiMoment, item.partners) || 0}%)</td>
                <td class="table-actions">
                    <button class="btn-small btn-secondary" onclick="app.editData(${actualIndex})">Edit</button>
                    <button class="btn-small btn-danger" onclick="app.deleteData(${actualIndex})">Delete</button>
                </td>
            `;
            
            tbody.appendChild(row);
        });
    }

    exportData() {
        const dataStr = JSON.stringify({
            type: 'talent-metrics',
            version: '1.0',
            exportDate: new Date().toISOString(),
            data: this.data
        }, null, 2);
        
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `talent-metrics-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
    }

    importData(jsonData) {
        try {
            const parsed = JSON.parse(jsonData);
            
            if (parsed.type !== 'talent-metrics') {
                throw new Error('Invalid file type. Please select a talent metrics export file.');
            }
            
            if (!Array.isArray(parsed.data)) {
                throw new Error('Invalid data format.');
            }
            
            // Validate data structure
            for (const item of parsed.data) {
                if (!item.month || typeof item.partners !== 'number') {
                    throw new Error('Invalid data structure in file.');
                }
            }
            
            // Merge or replace data
            const shouldReplace = confirm('Do you want to replace existing data? Click Cancel to merge with existing data.');
            
            if (shouldReplace) {
                this.data = parsed.data;
            } else {
                // Merge data, replacing duplicates by month
                for (const newItem of parsed.data) {
                    const existingIndex = this.data.findIndex(item => item.month === newItem.month);
                    if (existingIndex !== -1) {
                        this.data[existingIndex] = newItem;
                    } else {
                        this.data.push(newItem);
                    }
                }
            }
            
            this.saveData();
            this.updateDisplay();
            this.updateCharts();
            this.updateDataTable();
            
            alert('Data imported successfully!');
        } catch (error) {
            alert('Error importing data: ' + error.message);
        }
    }
}

// Global app instance
let app;

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    app = new TalentMetricsApp();
});

// Modal functions
function openDataModal() {
    document.getElementById('dataModal').style.display = 'block';
}

function closeDataModal() {
    document.getElementById('dataModal').style.display = 'none';
    
    // Reset form and editing state
    document.getElementById('data-form').reset();
    app.editingIndex = null;
    document.getElementById('modal-title').textContent = 'Add Monthly Data';
    document.getElementById('submit-btn').textContent = 'Add Data';
    
    // Set default month to current month
    const currentDate = new Date();
    const currentMonth = currentDate.getFullYear() + '-' + String(currentDate.getMonth() + 1).padStart(2, '0');
    document.getElementById('month-input').value = currentMonth;
}

// Form submission
document.getElementById('data-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        month: document.getElementById('month-input').value,
        partners: parseInt(document.getElementById('partners-input').value),
        license: parseInt(document.getElementById('license-input').value),
        githubCopilot: parseInt(document.getElementById('github-copilot-input').value),
        chatgptEnterprise: parseInt(document.getElementById('chatgpt-enterprise-input').value),
        production: parseInt(document.getElementById('production-input').value),
        requestsMin: parseInt(document.getElementById('requests-min-input').value),
        requestsAvg: parseFloat(document.getElementById('requests-avg-input').value),
        requestsMax: parseInt(document.getElementById('requests-max-input').value),
        aiMoment: parseInt(document.getElementById('ai-moment-input').value)
    };
    
    app.addData(formData);
    closeDataModal();
});

// Import/Export functions
function exportData() {
    app.exportData();
}

function importData() {
    document.getElementById('file-input').click();
}

function handleFileImport(input) {
    const file = input.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        app.importData(e.target.result);
        input.value = ''; // Reset file input
    };
    reader.readAsText(file);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('dataModal');
    if (event.target === modal) {
        closeDataModal();
    }
}

// ESC key to close modal
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeDataModal();
    }
});