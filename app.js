// AI Adoption Metrics Visualizer - Main Application
class MetricsApp {
    constructor() {
        this.talentData = [];
        this.clientData = [];
        this.currentView = 'talent';
        this.charts = {
            talentTrends: null,
            talentConversion: null,
            clientTrends: null,
            clientConversion: null
        };
        
        this.init();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        this.initializeCharts();
        this.updateUI();
    }

    setupEventListeners() {
        // View switching
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => this.switchView(btn.dataset.view));
        });

        // Modal controls
        const modal = document.getElementById('data-modal');
        const addDataBtn = document.getElementById('add-data-btn');
        const closeBtn = document.querySelector('.close');
        const cancelBtn = document.getElementById('cancel-btn');
        
        addDataBtn.addEventListener('click', () => this.openModal());
        closeBtn.addEventListener('click', () => this.closeModal());
        cancelBtn.addEventListener('click', () => this.closeModal());
        
        // Close modal when clicking outside
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                this.closeModal();
            }
        });

        // Form submission
        const form = document.getElementById('data-form');
        form.addEventListener('submit', (e) => this.handleFormSubmit(e));

        // Update previous values info when month changes
        const monthInput = document.getElementById('month');
        monthInput.addEventListener('change', () => this.showPreviousValuesInfo());

        // Import/Export
        const importBtn = document.getElementById('import-btn');
        const exportBtn = document.getElementById('export-btn');
        const fileInput = document.getElementById('file-input');
        
        importBtn.addEventListener('click', () => fileInput.click());
        exportBtn.addEventListener('click', () => this.exportData());
        fileInput.addEventListener('change', (e) => this.importData(e));

        // Set default month to current month
        const monthInput = document.getElementById('month');
        const now = new Date();
        const currentMonth = now.toISOString().slice(0, 7);
        monthInput.value = currentMonth;
    }

    switchView(view) {
        this.currentView = view;
        
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });

        // Update modal title
        const modalTitle = document.getElementById('modal-title');
        modalTitle.textContent = view === 'talent' 
            ? 'Add Talent Monthly Data' 
            : 'Add Client Monthly Data';

        // Show/hide form fields
        document.getElementById('talent-fields').style.display = 
            view === 'talent' ? 'block' : 'none';
        document.getElementById('client-fields').style.display = 
            view === 'client' ? 'block' : 'none';

        // Show/hide dashboards
        document.getElementById('talent-dashboard').style.display = 
            view === 'talent' ? 'block' : 'none';
        document.getElementById('client-dashboard').style.display = 
            view === 'client' ? 'block' : 'none';

        // Show/hide charts
        document.getElementById('talent-charts').style.display = 
            view === 'talent' ? 'block' : 'none';
        document.getElementById('client-charts').style.display = 
            view === 'client' ? 'block' : 'none';

        // Show/hide tables
        document.getElementById('talent-table').style.display = 
            view === 'talent' ? 'block' : 'none';
        document.getElementById('client-table').style.display = 
            view === 'client' ? 'block' : 'none';

        // Update previous values info if modal is open
        const modal = document.getElementById('data-modal');
        if (modal.style.display === 'block') {
            // Update form field visibility within the modal
            document.getElementById('talent-fields').style.display = 
                view === 'talent' ? 'block' : 'none';
            document.getElementById('client-fields').style.display = 
                view === 'client' ? 'block' : 'none';
            
            // Update modal title
            const modalTitle = document.getElementById('modal-title');
            modalTitle.textContent = view === 'talent' 
                ? 'Add Talent Monthly Data' 
                : 'Add Client Monthly Data';
                
            // Update previous values info
            this.showPreviousValuesInfo();
        }

        this.updateUI();
    }

    loadData() {
        // Load talent data
        const storedTalent = localStorage.getItem('ai-metrics-talent-data');
        if (storedTalent) {
            try {
                this.talentData = JSON.parse(storedTalent);
                this.talentData.sort((a, b) => new Date(a.month + '-01') - new Date(b.month + '-01'));
            } catch (error) {
                console.error('Error loading talent data from localStorage:', error);
                this.talentData = [];
            }
        }

        // Load client data
        const storedClient = localStorage.getItem('ai-metrics-client-data');
        if (storedClient) {
            try {
                this.clientData = JSON.parse(storedClient);
                this.clientData.sort((a, b) => new Date(a.month + '-01') - new Date(b.month + '-01'));
            } catch (error) {
                console.error('Error loading client data from localStorage:', error);
                this.clientData = [];
            }
        }
    }

    saveData() {
        try {
            localStorage.setItem('ai-metrics-talent-data', JSON.stringify(this.talentData));
            localStorage.setItem('ai-metrics-client-data', JSON.stringify(this.clientData));
        } catch (error) {
            console.error('Error saving data to localStorage:', error);
            this.showMessage('Error saving data', 'error');
        }
    }

    getCurrentData() {
        return this.currentView === 'talent' ? this.talentData : this.clientData;
    }

    openModal(existingData = null) {
        const modal = document.getElementById('data-modal');
        modal.style.display = 'block';
        
        // Update modal title based on current view
        const modalTitle = document.getElementById('modal-title');
        modalTitle.textContent = this.currentView === 'talent' 
            ? 'Add Talent Monthly Data' 
            : 'Add Client Monthly Data';

        // Show/hide appropriate form fields
        document.getElementById('talent-fields').style.display = 
            this.currentView === 'talent' ? 'block' : 'none';
        document.getElementById('client-fields').style.display = 
            this.currentView === 'client' ? 'block' : 'none';
        
        // Show previous values information
        this.showPreviousValuesInfo();
        
        if (existingData) {
            // Populate form with existing data for editing
            document.getElementById('month').value = existingData.month;
            
            if (this.currentView === 'talent') {
                document.getElementById('people-count').value = existingData.peopleCount;
                document.getElementById('license-users').value = existingData.licenseUsers;
                document.getElementById('premium-requests').value = existingData.premiumRequests;
                document.getElementById('ai-coverage').value = existingData.aiCoverage;
            } else {
                document.getElementById('total-clients').value = existingData.totalClients;
                document.getElementById('ai-permission-clients').value = existingData.aiPermissionClients;
                document.getElementById('fixed-price-projects').value = existingData.fixedPriceProjects;
            }
        }
    }

    closeModal() {
        const modal = document.getElementById('data-modal');
        modal.style.display = 'none';
        document.getElementById('data-form').reset();
        
        // Remove previous values info
        const existingInfo = document.querySelector('.previous-value-info');
        if (existingInfo) {
            existingInfo.remove();
        }
        
        // Reset to current month
        const monthInput = document.getElementById('month');
        const now = new Date();
        const currentMonth = now.toISOString().slice(0, 7);
        monthInput.value = currentMonth;
    }

    handleFormSubmit(event) {
        event.preventDefault();
        
        let month = document.getElementById('month').value;
        
        // Use current month if no month specified
        if (!month) {
            const now = new Date();
            month = now.toISOString().slice(0, 7);
        }
        
        let formData;
        
        if (this.currentView === 'talent') {
            const previousData = this.getPreviousMonthData(month, 'talent');
            
            formData = {
                month: month,
                peopleCount: this.getValueOrPrevious('people-count', previousData?.peopleCount, 0),
                licenseUsers: this.getValueOrPrevious('license-users', previousData?.licenseUsers, 0),
                premiumRequests: this.getValueOrPrevious('premium-requests', previousData?.premiumRequests, 0),
                aiCoverage: this.getValueOrPrevious('ai-coverage', previousData?.aiCoverage, 0, parseFloat)
            };
        } else {
            const previousData = this.getPreviousMonthData(month, 'client');
            
            formData = {
                month: month,
                totalClients: this.getValueOrPrevious('total-clients', previousData?.totalClients, 0),
                aiPermissionClients: this.getValueOrPrevious('ai-permission-clients', previousData?.aiPermissionClients, 0),
                fixedPriceProjects: this.getValueOrPrevious('fixed-price-projects', previousData?.fixedPriceProjects, 0)
            };
        }

        // Validate data
        if (!this.validateData(formData)) {
            return;
        }

        const currentData = this.getCurrentData();
        const existingIndex = currentData.findIndex(item => item.month === formData.month);
        
        if (existingIndex >= 0) {
            // Update existing data
            currentData[existingIndex] = formData;
            this.showMessage('Data updated successfully', 'success');
        } else {
            // Add new data
            currentData.push(formData);
            this.showMessage('Data added successfully', 'success');
        }

        // Sort data by month
        currentData.sort((a, b) => new Date(a.month + '-01') - new Date(b.month + '-01'));
        
        this.saveData();
        this.updateUI();
        this.closeModal();
    }

    getPreviousMonthData(currentMonth, view) {
        const data = view === 'talent' ? this.talentData : this.clientData;
        const currentMonthDate = new Date(currentMonth + '-01');
        
        // Find the most recent month before the current month
        let previousData = null;
        let previousDate = null;
        
        for (const item of data) {
            const itemDate = new Date(item.month + '-01');
            if (itemDate < currentMonthDate) {
                if (!previousDate || itemDate > previousDate) {
                    previousDate = itemDate;
                    previousData = item;
                }
            }
        }
        
        return previousData;
    }
    
    getValueOrPrevious(fieldId, previousValue, defaultValue, parser = parseInt) {
        const fieldValue = document.getElementById(fieldId).value;
        
        if (fieldValue !== null && fieldValue !== undefined && fieldValue !== '') {
            return parser(fieldValue) || defaultValue;
        }
        
        return previousValue !== null && previousValue !== undefined ? previousValue : defaultValue;
    }

    validateData(data) {
        if (this.currentView === 'talent') {
            // Check if license users doesn't exceed total people (only if both are provided)
            if (data.peopleCount > 0 && data.licenseUsers > data.peopleCount) {
                this.showMessage('License users cannot exceed total people count', 'error');
                return false;
            }

            // Check if AI coverage is within valid range
            if (data.aiCoverage < 0 || data.aiCoverage > 100) {
                this.showMessage('AI coverage must be between 0 and 100', 'error');
                return false;
            }
        } else {
            // Check if AI permission clients doesn't exceed total clients (only if both are provided)
            if (data.totalClients > 0 && data.aiPermissionClients > data.totalClients) {
                this.showMessage('AI permission clients cannot exceed total clients', 'error');
                return false;
            }
        }

        return true;
    }

    deleteData(month) {
        if (confirm('Are you sure you want to delete this data?')) {
            const currentData = this.getCurrentData();
            const filteredData = currentData.filter(item => item.month !== month);
            
            if (this.currentView === 'talent') {
                this.talentData = filteredData;
            } else {
                this.clientData = filteredData;
            }
            
            this.saveData();
            this.updateUI();
            this.showMessage('Data deleted successfully', 'success');
        }
    }

    editData(month) {
        const currentData = this.getCurrentData();
        const data = currentData.find(item => item.month === month);
        if (data) {
            this.openModal(data);
        }
    }

    updateUI() {
        this.updateDashboard();
        this.updateTable();
        this.updateCharts();
    }

    updateDashboard() {
        if (this.currentView === 'talent') {
            this.updateTalentDashboard();
        } else {
            this.updateClientDashboard();
        }
    }

    updateTalentDashboard() {
        const latestData = this.talentData[this.talentData.length - 1];
        
        if (!latestData) {
            document.getElementById('current-people').textContent = '-';
            document.getElementById('current-license').textContent = '-';
            document.getElementById('current-premium').textContent = '-';
            document.getElementById('current-coverage').textContent = '-%';
            document.getElementById('license-percentage').textContent = '-';
            return;
        }

        document.getElementById('current-people').textContent = latestData.peopleCount.toLocaleString();
        document.getElementById('current-license').textContent = latestData.licenseUsers.toLocaleString();
        document.getElementById('current-premium').textContent = latestData.premiumRequests.toLocaleString();
        document.getElementById('current-coverage').textContent = latestData.aiCoverage.toFixed(1) + '%';
        
        const licensePercentage = latestData.peopleCount > 0 
            ? ((latestData.licenseUsers / latestData.peopleCount) * 100).toFixed(1)
            : '0.0';
        document.getElementById('license-percentage').textContent = `(${licensePercentage}%)`;
    }

    updateClientDashboard() {
        const latestData = this.clientData[this.clientData.length - 1];
        
        if (!latestData) {
            document.getElementById('current-total-clients').textContent = '-';
            document.getElementById('current-ai-clients').textContent = '-';
            document.getElementById('current-fixed-projects').textContent = '-';
            document.getElementById('ai-permission-percentage').textContent = '-';
            document.getElementById('fixed-projects-percentage').textContent = '-';
            return;
        }

        document.getElementById('current-total-clients').textContent = latestData.totalClients.toLocaleString();
        document.getElementById('current-ai-clients').textContent = latestData.aiPermissionClients.toLocaleString();
        document.getElementById('current-fixed-projects').textContent = latestData.fixedPriceProjects.toLocaleString();
        
        const aiPermissionPercentage = latestData.totalClients > 0 
            ? ((latestData.aiPermissionClients / latestData.totalClients) * 100).toFixed(1)
            : '0.0';
        document.getElementById('ai-permission-percentage').textContent = `(${aiPermissionPercentage}%)`;
        
        const fixedProjectsPercentage = latestData.aiPermissionClients > 0 
            ? ((latestData.fixedPriceProjects / latestData.aiPermissionClients) * 100).toFixed(1)
            : '0.0';
        document.getElementById('fixed-projects-percentage').textContent = `(${fixedProjectsPercentage}%)`;
    }

    updateTable() {
        if (this.currentView === 'talent') {
            this.updateTalentTable();
        } else {
            this.updateClientTable();
        }
    }

    updateTalentTable() {
        const tbody = document.querySelector('#talent-data-table tbody');
        tbody.innerHTML = '';

        if (this.talentData.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="empty-state">
                        <div>
                            <h3>No Talent Data Available</h3>
                            <p>Add your first talent monthly data entry to get started</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        this.talentData.forEach(item => {
            const licensePercentage = item.peopleCount > 0 
                ? ((item.licenseUsers / item.peopleCount) * 100).toFixed(1)
                : '0.0';
            const monthName = new Date(item.month + '-01').toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long' 
            });

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${monthName}</td>
                <td>${item.peopleCount.toLocaleString()}</td>
                <td>${item.licenseUsers.toLocaleString()}</td>
                <td>${licensePercentage}%</td>
                <td>${item.premiumRequests.toLocaleString()}</td>
                <td>${item.aiCoverage.toFixed(1)}%</td>
                <td class="actions">
                    <button class="btn btn-secondary btn-small" onclick="app.editData('${item.month}')">
                        Edit
                    </button>
                    <button class="btn btn-danger btn-small" onclick="app.deleteData('${item.month}')">
                        Delete
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    updateClientTable() {
        const tbody = document.querySelector('#client-data-table tbody');
        tbody.innerHTML = '';

        if (this.clientData.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="empty-state">
                        <div>
                            <h3>No Client Data Available</h3>
                            <p>Add your first client monthly data entry to get started</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        this.clientData.forEach(item => {
            const aiPermissionPercentage = item.totalClients > 0 
                ? ((item.aiPermissionClients / item.totalClients) * 100).toFixed(1)
                : '0.0';
            const projectPercentage = item.aiPermissionClients > 0 
                ? ((item.fixedPriceProjects / item.aiPermissionClients) * 100).toFixed(1)
                : '0.0';
            const monthName = new Date(item.month + '-01').toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long' 
            });

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${monthName}</td>
                <td>${item.totalClients.toLocaleString()}</td>
                <td>${item.aiPermissionClients.toLocaleString()}</td>
                <td>${aiPermissionPercentage}%</td>
                <td>${item.fixedPriceProjects.toLocaleString()}</td>
                <td>${projectPercentage}%</td>
                <td class="actions">
                    <button class="btn btn-secondary btn-small" onclick="app.editData('${item.month}')">
                        Edit
                    </button>
                    <button class="btn btn-danger btn-small" onclick="app.deleteData('${item.month}')">
                        Delete
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    initializeCharts() {
        this.charts.talentTrends = new SimpleChart('talent-trends-chart');
        this.charts.talentConversion = new SimpleChart('talent-conversion-chart');
        this.charts.clientTrends = new SimpleChart('client-trends-chart');
        this.charts.clientConversion = new SimpleChart('client-conversion-chart');
    }

    updateCharts() {
        if (this.currentView === 'talent') {
            this.updateTalentCharts();
        } else {
            this.updateClientCharts();
        }
    }

    updateTalentCharts() {
        if (this.talentData.length === 0) {
            this.charts.talentTrends.drawEmptyState();
            this.charts.talentConversion.drawEmptyState();
            return;
        }

        // Trends chart - line chart with all metrics over time
        const trendsData = this.talentData.map(item => ({
            month: item.month,
            peopleCount: item.peopleCount,
            licenseUsers: item.licenseUsers,
            premiumRequests: item.premiumRequests,
            aiCoverage: item.aiCoverage
        }));

        this.charts.talentTrends.drawLineChart(trendsData);

        // Conversion rates chart - bar chart showing percentages
        const latestData = this.talentData[this.talentData.length - 1];
        if (latestData) {
            const conversionData = [
                {
                    label: 'License Adoption',
                    value: latestData.peopleCount > 0 
                        ? (latestData.licenseUsers / latestData.peopleCount) * 100
                        : 0,
                    color: '#5236AB'
                },
                {
                    label: 'Premium Usage',
                    value: latestData.licenseUsers > 0 
                        ? (latestData.premiumRequests / latestData.licenseUsers) * 100
                        : 0,
                    color: '#9E83F5'
                },
                {
                    label: 'AI Coverage',
                    value: latestData.aiCoverage,
                    color: '#1AB977'
                }
            ];

            this.charts.talentConversion.drawBarChart(conversionData);
        }
    }

    updateClientCharts() {
        if (this.clientData.length === 0) {
            this.charts.clientTrends.drawEmptyState();
            this.charts.clientConversion.drawEmptyState();
            return;
        }

        // Trends chart - line chart with all metrics over time
        const trendsData = this.clientData.map(item => ({
            month: item.month,
            totalClients: item.totalClients,
            aiPermissionClients: item.aiPermissionClients,
            fixedPriceProjects: item.fixedPriceProjects
        }));

        this.charts.clientTrends.drawLineChart(trendsData);

        // Conversion rates chart - bar chart showing percentages
        const latestData = this.clientData[this.clientData.length - 1];
        if (latestData) {
            const conversionData = [
                {
                    label: 'AI Permission Adoption',
                    value: latestData.totalClients > 0 
                        ? (latestData.aiPermissionClients / latestData.totalClients) * 100
                        : 0,
                    color: '#5236AB'
                },
                {
                    label: 'Fixed Price Projects',
                    value: latestData.aiPermissionClients > 0 
                        ? (latestData.fixedPriceProjects / latestData.aiPermissionClients) * 100
                        : 0,
                    color: '#9E83F5'
                }
            ];

            this.charts.clientConversion.drawBarChart(conversionData);
        }
    }

    exportData() {
        const exportData = {
            talent: this.talentData,
            client: this.clientData,
            exportDate: new Date().toISOString(),
            version: "2.0"
        };

        if (this.talentData.length === 0 && this.clientData.length === 0) {
            this.showMessage('No data to export', 'error');
            return;
        }

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `ai-metrics-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.showMessage('Data exported successfully', 'success');
    }

    importData(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                
                // Check if it's the new format with talent and client data
                if (importedData.version === "2.0" && importedData.talent && importedData.client) {
                    this.importNewFormat(importedData);
                } else if (Array.isArray(importedData)) {
                    // Legacy format - assume it's talent data
                    this.importLegacyFormat(importedData);
                } else {
                    throw new Error('Invalid data format');
                }
                
            } catch (error) {
                console.error('Import error:', error);
                this.showMessage('Error importing data: ' + error.message, 'error');
            }

            // Reset file input
            event.target.value = '';
        };

        reader.readAsText(file);
    }

    importNewFormat(importedData) {
        let importCount = 0;

        // Import talent data
        if (Array.isArray(importedData.talent)) {
            const requiredTalentFields = ['month', 'peopleCount', 'licenseUsers', 'premiumRequests', 'aiCoverage'];
            const isValidTalent = importedData.talent.every(item => 
                requiredTalentFields.every(field => field in item)
            );

            if (isValidTalent) {
                importedData.talent.forEach(newItem => {
                    const existingIndex = this.talentData.findIndex(item => item.month === newItem.month);
                    if (existingIndex >= 0) {
                        this.talentData[existingIndex] = newItem;
                    } else {
                        this.talentData.push(newItem);
                    }
                });
                this.talentData.sort((a, b) => new Date(a.month + '-01') - new Date(b.month + '-01'));
                importCount += importedData.talent.length;
            }
        }

        // Import client data
        if (Array.isArray(importedData.client)) {
            const requiredClientFields = ['month', 'totalClients', 'aiPermissionClients', 'fixedPriceProjects'];
            const isValidClient = importedData.client.every(item => 
                requiredClientFields.every(field => field in item)
            );

            if (isValidClient) {
                importedData.client.forEach(newItem => {
                    const existingIndex = this.clientData.findIndex(item => item.month === newItem.month);
                    if (existingIndex >= 0) {
                        this.clientData[existingIndex] = newItem;
                    } else {
                        this.clientData.push(newItem);
                    }
                });
                this.clientData.sort((a, b) => new Date(a.month + '-01') - new Date(b.month + '-01'));
                importCount += importedData.client.length;
            }
        }

        this.saveData();
        this.updateUI();
        this.showMessage(`Successfully imported ${importCount} records (talent: ${importedData.talent?.length || 0}, client: ${importedData.client?.length || 0})`, 'success');
    }

    importLegacyFormat(importedData) {
        // Legacy format - treat as talent data
        const requiredFields = ['month', 'peopleCount', 'licenseUsers', 'premiumRequests', 'aiCoverage'];
        const isValid = importedData.every(item => 
            requiredFields.every(field => field in item)
        );

        if (!isValid) {
            throw new Error('Legacy data is missing required fields');
        }

        importedData.forEach(newItem => {
            const existingIndex = this.talentData.findIndex(item => item.month === newItem.month);
            if (existingIndex >= 0) {
                this.talentData[existingIndex] = newItem;
            } else {
                this.talentData.push(newItem);
            }
        });

        this.talentData.sort((a, b) => new Date(a.month + '-01') - new Date(b.month + '-01'));
        this.saveData();
        this.updateUI();
        this.showMessage(`Successfully imported ${importedData.length} legacy talent records`, 'success');
    }

    showMessage(text, type = 'success') {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.message');
        existingMessages.forEach(msg => msg.remove());

        // Create new message
        const message = document.createElement('div');
        message.className = `message ${type}`;
        message.textContent = text;
        message.style.display = 'block';

        // Insert after header
        const header = document.querySelector('header');
        header.parentNode.insertBefore(message, header.nextSibling);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (message.parentNode) {
                message.remove();
            }
        }, 5000);
    }

    showPreviousValuesInfo() {
        // Remove existing previous values info
        const existingInfo = document.querySelector('.previous-value-info');
        if (existingInfo) {
            existingInfo.remove();
        }

        const currentMonth = document.getElementById('month').value || new Date().toISOString().slice(0, 7);
        const previousData = this.getPreviousMonthData(currentMonth, this.currentView);
        
        const infoDiv = document.createElement('div');
        infoDiv.className = 'previous-value-info';
        
        if (previousData) {
            let content = `<h4>Previous month values (${previousData.month}) will be used for empty fields:</h4>`;
            
            if (this.currentView === 'talent') {
                content += `
                    <span class="value">People: ${previousData.peopleCount}</span>
                    <span class="value">License Users: ${previousData.licenseUsers}</span>
                    <span class="value">Premium Requests: ${previousData.premiumRequests}</span>
                    <span class="value">AI Coverage: ${previousData.aiCoverage}%</span>
                `;
            } else {
                content += `
                    <span class="value">Total Clients: ${previousData.totalClients}</span>
                    <span class="value">AI Permission: ${previousData.aiPermissionClients}</span>
                    <span class="value">Fixed Price Projects: ${previousData.fixedPriceProjects}</span>
                `;
            }
            
            infoDiv.innerHTML = content;
        } else {
            infoDiv.innerHTML = `
                <h4>No previous data available</h4>
                <p>Empty fields will default to 0. Enter the date and any values you have.</p>
            `;
            infoDiv.style.backgroundColor = '#fff7e6';
            infoDiv.style.borderColor = '#ffc107';
            infoDiv.style.color = '#856404';
        }
        
        // Insert after modal header
        const modalHeader = document.querySelector('.modal-header');
        if (modalHeader) {
            modalHeader.insertAdjacentElement('afterend', infoDiv);
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new MetricsApp();
});

// Handle window resize for charts
window.addEventListener('resize', () => {
    if (window.app && window.app.charts) {
        setTimeout(() => {
            Object.values(window.app.charts).forEach(chart => {
                if (chart) chart.setupCanvas();
            });
            window.app.updateCharts();
        }, 100);
    }
});