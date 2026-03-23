# 📊 Social Media Sentiment Dashboard

A comprehensive real-time sentiment analysis dashboard for social media data with multiple interfaces including Python backend, Streamlit web app, and React dashboard with live updating charts.

## 🚀 Features

### Core Functionality
- **Real-time Tweet Fetching**: Collect tweets using Twitter API v2 with Tweepy
- **Advanced Text Cleaning**: Remove hashtags, mentions, links, and normalize text
- **VADER Sentiment Analysis**: Classify tweets as Positive, Negative, or Neutral
- **Data Persistence**: Save results in structured Pandas DataFrames and CSV files

### Streamlit Dashboard
- **Interactive Sidebar Controls**: Filter by keyword, date range, and tweet count
- **Multiple Visualizations**:
  - 📈 Line chart showing sentiment trends over time
  - 📊 Pie chart displaying sentiment distribution
  - ☁️ Word cloud of most common words
- **Automated Insights**: Text summaries highlighting sentiment spikes and drops
- **Data Export**: Download results as CSV files

### React Dashboard
- **Live Updating Charts**: Real-time data refresh with smooth animations
- **Modern UI**: Dark/light theme support with responsive design
- **Interactive Charts**: Built with Recharts library
- **Smooth Animations**: Powered by Framer Motion for fluid transitions
- **Multiple Chart Types**: Line charts, pie charts, and bar charts
- **Customizable Refresh Intervals**: 10 seconds to 5 minutes

### Data Processing
- **Text Preprocessing**: Advanced cleaning and normalization
- **Sentiment Scoring**: VADER compound scores with threshold-based labeling
- **Temporal Analysis**: Hourly and daily aggregations
- **Statistical Insights**: Mean, distribution, and trend analysis

## 🛠 Installation

### Prerequisites
- Python 3.8+
- Node.js 14+
- Twitter Developer Account (for API access)

### Quick Setup

1. **Clone or extract the project**
   ```bash
   cd social_media_sentiment_dashboard
   ```

2. **Set up Python environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Install Node.js dependencies**
   ```bash
   cd react_app
   npm install
   cd ..
   ```

4. **Configure API credentials**
   ```bash
   cp .env.example .env
   # Edit .env file and add your Twitter Bearer Token
   ```

## 📋 Twitter API Setup

1. **Create Twitter Developer Account**
   - Visit [developer.twitter.com](https://developer.twitter.com)
   - Apply for developer access
   - Create a new app/project

2. **Generate Bearer Token**
   - In your Twitter app dashboard
   - Go to "Keys and tokens"
   - Generate Bearer Token
   - Copy the token to your `.env` file

3. **API Permissions**
   - Ensure your app has "Read" permissions
   - Twitter API v2 access is required

## 🚀 Usage

### 1. Run the Streamlit Dashboard

```bash
cd streamlit_app
streamlit run app.py
```

**Features:**
- Access at `http://localhost:8501`
- Interactive sidebar controls
- Real-time data fetching
- Multiple visualization types
- Export functionality

### 2. Run the React Dashboard

```bash
cd react_app
npm start
```

**Features:**
- Access at `http://localhost:3000`
- Live updating charts
- Smooth animations
- Dark/light theme toggle
- Responsive design

### 3. Use the Python Backend Directly

```python
from backend.tweet_sentiment_analyzer import TwitterSentimentAnalyzer

# Initialize analyzer
analyzer = TwitterSentimentAnalyzer("YOUR_BEARER_TOKEN")

# Fetch and analyze tweets
df = analyzer.fetch_tweets("artificial intelligence", max_results=100, days_back=7)

# Get sentiment summary
summary = analyzer.get_sentiment_summary(df, hours_back=24)

# Save data
analyzer.save_data(df, "sentiment_analysis.csv")
```

## 📁 Project Structure

```
social_media_sentiment_dashboard/
├── backend/
│   └── tweet_sentiment_analyzer.py    # Core sentiment analysis module
├── streamlit_app/
│   └── app.py                         # Streamlit dashboard
├── react_app/
│   ├── public/
│   │   └── index.html                 # React app template
│   ├── src/
│   │   ├── components/
│   │   │   └── SentimentDashboard.js  # Main React component
│   │   ├── App.js                     # React app entry point
│   │   ├── App.css                    # Main styles
│   │   ├── index.js                   # React DOM rendering
│   │   └── index.css                  # Base styles
│   └── package.json                   # Node.js dependencies
├── data/                              # Data storage directory
├── requirements.txt                   # Python dependencies
├── .env.example                       # Environment variables template
├── .gitignore                         # Git ignore file
└── README.md                          # This file
```

## 🔧 Configuration Options

### Environment Variables (.env)
```env
TWITTER_BEARER_TOKEN=your_token_here
DEBUG=True
LOG_LEVEL=INFO
```

### Streamlit Configuration
- Modify `streamlit_app/app.py` for custom styling
- Adjust visualization parameters
- Configure data refresh intervals

### React Configuration
- Edit `react_app/src/components/SentimentDashboard.js`
- Customize chart colors and themes
- Modify update intervals and animations

## 📊 Data Schema

### Tweet Data Structure
```python
{
    'tweet_id': str,
    'created_at': datetime,
    'original_text': str,
    'cleaned_text': str,
    'author_id': str,
    'retweet_count': int,
    'like_count': int,
    'reply_count': int,
    'quote_count': int,
    'sentiment_positive': float,
    'sentiment_negative': float,
    'sentiment_neutral': float,
    'sentiment_compound': float,
    'sentiment_label': str,  # 'Positive', 'Negative', 'Neutral'
    'keyword': str,
    'date': date,
    'hour': int
}
```

### Sentiment Analysis Thresholds
- **Positive**: compound score ≥ 0.05
- **Negative**: compound score ≤ -0.05  
- **Neutral**: -0.05 < compound score < 0.05

## 🎨 Customization

### Adding New Visualizations
1. **Streamlit**: Add new functions in `streamlit_app/app.py`
2. **React**: Create new components in `react_app/src/components/`

### Custom Sentiment Analysis
- Modify `backend/tweet_sentiment_analyzer.py`
- Replace VADER with other sentiment analysis libraries
- Add custom preprocessing steps

### Theme Customization
- **Streamlit**: Modify CSS in the app file
- **React**: Edit `App.css` for theme variables

## 🚨 Troubleshooting

### Common Issues

1. **Twitter API Rate Limits**
   - Solution: Implement exponential backoff
   - Monitor API usage in Twitter dashboard

2. **Empty DataFrame**
   - Check API credentials
   - Verify keyword search terms
   - Ensure recent tweets exist for the keyword

3. **Port Conflicts**
   - Streamlit default: 8501
   - React default: 3000
   - Modify ports if needed

4. **Installation Issues**
   - Use virtual environments
   - Update pip: `pip install --upgrade pip`
   - Check Python/Node.js versions

### Performance Optimization
- Limit tweet fetch count for faster processing
- Use caching for repeated analysis
- Implement data pagination for large datasets

## 📈 Advanced Features

### Batch Processing
```python
keywords = ["AI", "machine learning", "data science"]
for keyword in keywords:
    df = analyzer.fetch_tweets(keyword, max_results=50)
    analyzer.save_data(df, f"{keyword}_sentiment.csv")
```

### Custom Time Ranges
```python
# Analyze specific time periods
from datetime import datetime, timedelta

start_time = datetime.now() - timedelta(days=3)
df = analyzer.fetch_tweets("python", start_time=start_time)
```

### Export Options
- CSV files for data analysis
- JSON format for API integration
- Plotly HTML exports for sharing

## 🤝 Contributing

1. Fork the project
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🔗 Resources

- [Twitter API v2 Documentation](https://developer.twitter.com/en/docs/twitter-api)
- [Tweepy Documentation](https://docs.tweepy.org/)
- [VADER Sentiment Analysis](https://github.com/cjhutto/vaderSentiment)
- [Streamlit Documentation](https://docs.streamlit.io/)
- [Recharts Documentation](https://recharts.org/)
- [Framer Motion Documentation](https://www.framer.com/motion/)

## 📧 Support

For questions and support, please check the documentation or create an issue in the project repository.

---

**Built with ❤️ using Python, Streamlit, React, and modern web technologies**