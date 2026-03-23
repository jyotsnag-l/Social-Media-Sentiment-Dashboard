// Application State
let currentChart = null;
let updateInterval = null;
let countdownInterval = null;
let currentData = [];
let currentKeyword = 'artificial intelligence';
let currentChartType = 'trend';
let currentDateRange = 7;
let currentUpdateInterval = 30;

// Sample data from the provided JSON
const sampleTweets = [
    {"hour": "2025-09-20T07:00", "sentiment": 0.2, "positive": 12, "negative": 3, "neutral": 8},
    {"hour": "2025-09-20T08:00", "sentiment": 0.15, "positive": 15, "negative": 5, "neutral": 12},
    {"hour": "2025-09-20T09:00", "sentiment": -0.1, "positive": 8, "negative": 14, "neutral": 10},
    {"hour": "2025-09-20T10:00", "sentiment": 0.3, "positive": 18, "negative": 4, "neutral": 9},
    {"hour": "2025-09-20T11:00", "sentiment": 0.05, "positive": 11, "negative": 8, "neutral": 15},
    {"hour": "2025-09-20T12:00", "sentiment": -0.2, "positive": 6, "negative": 16, "neutral": 11},
    {"hour": "2025-09-20T13:00", "sentiment": 0.1, "positive": 13, "negative": 7, "neutral": 12}
];

const keywords = ["artificial intelligence", "machine learning", "data science", "python programming", "social media"];
const colors = {
    positive: "#1FB8CD",
    negative: "#B4413C", 
    neutral: "#FFC185",
    primary: "#5D878F"
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    generateInitialData();
    updateDashboard();
    startAutoRefresh();
});

function initializeApp() {
    // Set initial values
    document.getElementById('keywordInput').value = currentKeyword;
    document.getElementById('dateRange').value = currentDateRange.toString();
    document.getElementById('updateInterval').value = currentUpdateInterval.toString();
    document.getElementById('chartType').value = currentChartType;
    
    updateLastUpdate();
}

function setupEventListeners() {
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Control inputs
    const keywordInput = document.getElementById('keywordInput');
    if (keywordInput) {
        keywordInput.addEventListener('input', handleKeywordChange);
        keywordInput.addEventListener('blur', handleKeywordChange);
    }
    
    const dateRange = document.getElementById('dateRange');
    if (dateRange) {
        dateRange.addEventListener('change', handleDateRangeChange);
    }
    
    const updateIntervalSelect = document.getElementById('updateInterval');
    if (updateIntervalSelect) {
        updateIntervalSelect.addEventListener('change', handleUpdateIntervalChange);
    }
    
    const chartType = document.getElementById('chartType');
    if (chartType) {
        chartType.addEventListener('change', handleChartTypeChange);
    }
    
    // Refresh button
    const refreshBtn = document.getElementById('refreshData');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', handleManualRefresh);
    }
}

function toggleTheme() {
    const currentScheme = document.documentElement.getAttribute('data-color-scheme');
    const newScheme = currentScheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-color-scheme', newScheme);
    
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
        themeIcon.textContent = newScheme === 'dark' ? '☀️' : '🌙';
    }
    
    // Redraw chart with new theme colors
    setTimeout(() => {
        updateChart();
    }, 100);
}

function handleKeywordChange(event) {
    const newKeyword = event.target.value.trim();
    if (newKeyword && newKeyword !== currentKeyword) {
        currentKeyword = newKeyword;
        showLoading();
        setTimeout(() => {
            generateNewData();
            updateDashboard();
            hideLoading();
        }, 500);
    }
}

function handleDateRangeChange(event) {
    const newDateRange = parseInt(event.target.value);
    if (newDateRange !== currentDateRange) {
        currentDateRange = newDateRange;
        showLoading();
        setTimeout(() => {
            generateNewData();
            updateDashboard();
            hideLoading();
        }, 500);
    }
}

function handleUpdateIntervalChange(event) {
    const newInterval = parseInt(event.target.value);
    if (newInterval !== currentUpdateInterval) {
        currentUpdateInterval = newInterval;
        restartAutoRefresh();
    }
}

function handleChartTypeChange(event) {
    const newChartType = event.target.value;
    if (newChartType !== currentChartType) {
        currentChartType = newChartType;
        showLoading();
        setTimeout(() => {
            updateChart();
            hideLoading();
        }, 300);
    }
}

function handleManualRefresh() {
    const refreshBtn = document.getElementById('refreshData');
    const refreshIcon = refreshBtn.querySelector('.refresh-icon');
    
    // Add spinning animation
    if (refreshIcon) {
        refreshIcon.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            refreshIcon.style.transform = 'rotate(0deg)';
        }, 500);
    }
    
    showLoading();
    
    setTimeout(() => {
        generateNewData();
        updateDashboard();
        hideLoading();
        restartAutoRefresh();
    }, 1000);
}

function generateInitialData() {
    currentData = generateRealisticData(currentKeyword, currentDateRange);
}

function generateNewData() {
    currentData = generateRealisticData(currentKeyword, currentDateRange);
}

function generateRealisticData(keyword, days) {
    const data = [];
    const now = new Date();
    const hoursToGenerate = days * 24;
    
    // Different sentiment patterns based on keywords
    const keywordPatterns = {
        'artificial intelligence': { base: 0.15, volatility: 0.3 },
        'machine learning': { base: 0.1, volatility: 0.25 },
        'data science': { base: 0.05, volatility: 0.2 },
        'python programming': { base: 0.2, volatility: 0.15 },
        'social media': { base: -0.05, volatility: 0.4 }
    };
    
    const pattern = keywordPatterns[keyword.toLowerCase()] || { base: 0, volatility: 0.3 };
    
    for (let i = hoursToGenerate; i >= 0; i--) {
        const date = new Date(now.getTime() - (i * 60 * 60 * 1000));
        
        // Generate realistic sentiment with trends
        const trendFactor = Math.sin((i / hoursToGenerate) * Math.PI * 2) * 0.1;
        const randomFactor = (Math.random() - 0.5) * pattern.volatility;
        const sentiment = Math.max(-1, Math.min(1, pattern.base + trendFactor + randomFactor));
        
        // Generate tweet counts based on time of day
        const hour = date.getHours();
        const baseVolume = getVolumeByHour(hour);
        const totalTweets = Math.floor(baseVolume * (0.8 + Math.random() * 0.4));
        
        // Distribute tweets based on sentiment
        const positive = Math.floor(totalTweets * Math.max(0, (sentiment + 1) / 2) * (0.8 + Math.random() * 0.4));
        const negative = Math.floor(totalTweets * Math.max(0, (1 - sentiment) / 2) * (0.8 + Math.random() * 0.4));
        const neutral = totalTweets - positive - negative;
        
        data.push({
            hour: date.toISOString(),
            sentiment: parseFloat(sentiment.toFixed(3)),
            positive: Math.max(0, positive),
            negative: Math.max(0, negative),
            neutral: Math.max(0, neutral),
            total: positive + negative + neutral
        });
    }
    
    return data;
}

function getVolumeByHour(hour) {
    // Simulate realistic tweet volume patterns throughout the day
    const hourlyPatterns = {
        0: 15, 1: 12, 2: 8, 3: 6, 4: 5, 5: 8,
        6: 15, 7: 25, 8: 35, 9: 40, 10: 38, 11: 35,
        12: 32, 13: 30, 14: 28, 15: 30, 16: 35, 17: 40,
        18: 38, 19: 35, 20: 30, 21: 28, 22: 25, 23: 20
    };
    return hourlyPatterns[hour] || 20;
}

function updateDashboard() {
    updateMetrics();
    updateChart();
    updateLastUpdate();
}

function updateMetrics() {
    const metrics = calculateMetrics(currentData);
    
    // Animate metric updates
    animateValue('totalTweets', metrics.total);
    animateValue('positiveTweets', metrics.positive);
    animateValue('negativeTweets', metrics.negative);
    animateValue('neutralTweets', metrics.neutral);
    animateValue('avgSentiment', metrics.avgSentiment, true);
    
    // Update percentages
    const positivePercentageEl = document.getElementById('positivePercentage');
    const negativePercentageEl = document.getElementById('negativePercentage');
    const neutralPercentageEl = document.getElementById('neutralPercentage');
    
    if (positivePercentageEl) positivePercentageEl.textContent = `${metrics.positivePercentage}%`;
    if (negativePercentageEl) negativePercentageEl.textContent = `${metrics.negativePercentage}%`;
    if (neutralPercentageEl) neutralPercentageEl.textContent = `${metrics.neutralPercentage}%`;
    
    // Update sentiment indicator
    updateSentimentIndicator(metrics.avgSentiment);
}

function calculateMetrics(data) {
    const total = data.reduce((sum, item) => sum + item.positive + item.negative + item.neutral, 0);
    const positive = data.reduce((sum, item) => sum + item.positive, 0);
    const negative = data.reduce((sum, item) => sum + item.negative, 0);
    const neutral = data.reduce((sum, item) => sum + item.neutral, 0);
    
    const avgSentiment = data.length > 0 
        ? data.reduce((sum, item) => sum + item.sentiment, 0) / data.length 
        : 0;
    
    return {
        total,
        positive,
        negative,
        neutral,
        positivePercentage: total > 0 ? Math.round((positive / total) * 100) : 0,
        negativePercentage: total > 0 ? Math.round((negative / total) * 100) : 0,
        neutralPercentage: total > 0 ? Math.round((neutral / total) * 100) : 0,
        avgSentiment: parseFloat(avgSentiment.toFixed(3))
    };
}

function animateValue(elementId, endValue, isDecimal = false) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const startValue = parseFloat(element.textContent) || 0;
    const duration = 800;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = startValue + (endValue - startValue) * easeOutQuart;
        
        if (isDecimal) {
            element.textContent = currentValue.toFixed(3);
        } else {
            element.textContent = Math.floor(currentValue);
        }
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = isDecimal ? endValue.toFixed(3) : endValue;
        }
    }
    
    requestAnimationFrame(update);
}

function updateSentimentIndicator(sentiment) {
    const indicator = document.getElementById('sentimentIndicator');
    if (!indicator) return;
    
    const normalizedSentiment = (sentiment + 1) / 2; // Convert -1,1 to 0,1
    const percentage = Math.max(0, Math.min(100, normalizedSentiment * 100));
    
    // Update colors based on sentiment
    let color = colors.neutral;
    if (sentiment > 0.05) color = colors.positive;
    else if (sentiment < -0.05) color = colors.negative;
    
    // Create or update the style
    let existingStyle = document.getElementById('sentiment-indicator-style');
    if (existingStyle) {
        existingStyle.remove();
    }
    
    const style = document.createElement('style');
    style.id = 'sentiment-indicator-style';
    style.textContent = `
        .sentiment-indicator::after {
            width: ${percentage}% !important;
            background: ${color} !important;
        }
    `;
    document.head.appendChild(style);
}

function updateChart() {
    const ctx = document.getElementById('mainChart');
    if (!ctx) return;
    
    const context = ctx.getContext('2d');
    
    if (currentChart) {
        currentChart.destroy();
        currentChart = null;
    }
    
    switch (currentChartType) {
        case 'trend':
            createTrendChart(context);
            break;
        case 'distribution':
            createDistributionChart(context);
            break;
        case 'volume':
            createVolumeChart(context);
            break;
    }
}

function createTrendChart(ctx) {
    const labels = currentData.map(item => {
        const date = new Date(item.hour);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    });
    
    const sentimentData = currentData.map(item => item.sentiment);
    
    currentChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Sentiment Score',
                data: sentimentData,
                borderColor: colors.primary,
                backgroundColor: colors.primary + '20',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: colors.primary,
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }, {
                label: 'Positive Threshold',
                data: new Array(sentimentData.length).fill(0.05),
                borderColor: colors.positive,
                backgroundColor: 'transparent',
                borderWidth: 1,
                borderDash: [5, 5],
                pointRadius: 0,
                fill: false
            }, {
                label: 'Negative Threshold',
                data: new Array(sentimentData.length).fill(-0.05),
                borderColor: colors.negative,
                backgroundColor: 'transparent',
                borderWidth: 1,
                borderDash: [5, 5],
                pointRadius: 0,
                fill: false
            }, {
                label: 'Neutral Line',
                data: new Array(sentimentData.length).fill(0),
                borderColor: colors.neutral,
                backgroundColor: 'transparent',
                borderWidth: 1,
                borderDash: [2, 2],
                pointRadius: 0,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            if (context.datasetIndex === 0) {
                                return `Sentiment: ${context.parsed.y.toFixed(3)}`;
                            }
                            return context.dataset.label;
                        }
                    }
                }
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Time'
                    },
                    ticks: {
                        maxTicksLimit: 8
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Sentiment Score'
                    },
                    min: -1,
                    max: 1,
                    ticks: {
                        stepSize: 0.2
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
}

function createDistributionChart(ctx) {
    const metrics = calculateMetrics(currentData);
    
    currentChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Positive', 'Negative', 'Neutral'],
            datasets: [{
                data: [metrics.positive, metrics.negative, metrics.neutral],
                backgroundColor: [colors.positive, colors.negative, colors.neutral],
                borderWidth: 2,
                borderColor: '#fff',
                hoverBorderWidth: 3,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

function createVolumeChart(ctx) {
    const labels = currentData.map(item => {
        const date = new Date(item.hour);
        return date.toLocaleDateString() + ' ' + date.getHours() + ':00';
    });
    
    currentChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Positive',
                data: currentData.map(item => item.positive),
                backgroundColor: colors.positive,
                stack: 'Stack 0'
            }, {
                label: 'Neutral',
                data: currentData.map(item => item.neutral),
                backgroundColor: colors.neutral,
                stack: 'Stack 0'
            }, {
                label: 'Negative',
                data: currentData.map(item => item.negative),
                backgroundColor: colors.negative,
                stack: 'Stack 0'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Time'
                    },
                    ticks: {
                        maxTicksLimit: 12
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Tweet Count'
                    },
                    stacked: true
                }
            }
        }
    });
}

function startAutoRefresh() {
    clearIntervals();
    
    let countdown = currentUpdateInterval;
    
    // Update progress bar and countdown
    countdownInterval = setInterval(() => {
        countdown--;
        const countdownEl = document.getElementById('countdown');
        if (countdownEl) {
            countdownEl.textContent = countdown;
        }
        
        const progress = ((currentUpdateInterval - countdown) / currentUpdateInterval) * 100;
        const progressBar = document.getElementById('progressBar');
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
        
        if (countdown <= 0) {
            // Generate new data point and refresh
            showLoading();
            setTimeout(() => {
                addNewDataPoint();
                updateDashboard();
                hideLoading();
            }, 500);
            
            countdown = currentUpdateInterval;
        }
    }, 1000);
}

function restartAutoRefresh() {
    startAutoRefresh();
}

function clearIntervals() {
    if (updateInterval) clearInterval(updateInterval);
    if (countdownInterval) clearInterval(countdownInterval);
}

function addNewDataPoint() {
    // Add a new data point to simulate real-time updates
    if (currentData.length === 0) return;
    
    const lastPoint = currentData[currentData.length - 1];
    const now = new Date();
    
    // Generate new point with some continuity from the last point
    const sentimentChange = (Math.random() - 0.5) * 0.2;
    const newSentiment = Math.max(-1, Math.min(1, lastPoint.sentiment + sentimentChange));
    
    const hour = now.getHours();
    const baseVolume = getVolumeByHour(hour);
    const totalTweets = Math.floor(baseVolume * (0.8 + Math.random() * 0.4));
    
    const positive = Math.floor(totalTweets * Math.max(0, (newSentiment + 1) / 2) * (0.8 + Math.random() * 0.4));
    const negative = Math.floor(totalTweets * Math.max(0, (1 - newSentiment) / 2) * (0.8 + Math.random() * 0.4));
    const neutral = totalTweets - positive - negative;
    
    const newPoint = {
        hour: now.toISOString(),
        sentiment: parseFloat(newSentiment.toFixed(3)),
        positive: Math.max(0, positive),
        negative: Math.max(0, negative),
        neutral: Math.max(0, neutral),
        total: positive + negative + neutral
    };
    
    // Add new point and remove oldest if we exceed the date range
    currentData.push(newPoint);
    const maxPoints = currentDateRange * 24;
    if (currentData.length > maxPoints) {
        currentData.shift();
    }
}

function showLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('hidden');
    }
}

function hideLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.classList.add('hidden');
    }
}

function updateLastUpdate() {
    const now = new Date();
    const lastUpdateEl = document.getElementById('lastUpdate');
    if (lastUpdateEl) {
        lastUpdateEl.textContent = now.toLocaleTimeString();
    }
}

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    clearIntervals();
    if (currentChart) {
        currentChart.destroy();
    }
});