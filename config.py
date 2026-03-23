"""
Configuration settings for the Social Media Sentiment Dashboard
"""

import os
from pathlib import Path

# Project paths
PROJECT_ROOT = Path(__file__).parent
DATA_DIR = PROJECT_ROOT / "data"
LOGS_DIR = PROJECT_ROOT / "logs"

# Create directories if they don't exist
DATA_DIR.mkdir(exist_ok=True)
LOGS_DIR.mkdir(exist_ok=True)

# Twitter API Configuration
TWITTER_CONFIG = {
    'bearer_token': os.getenv('TWITTER_BEARER_TOKEN'),
    'api_key': os.getenv('TWITTER_API_KEY'),
    'api_secret': os.getenv('TWITTER_API_SECRET'),
    'access_token': os.getenv('TWITTER_ACCESS_TOKEN'),
    'access_token_secret': os.getenv('TWITTER_ACCESS_TOKEN_SECRET'),
}

# Sentiment Analysis Configuration
SENTIMENT_CONFIG = {
    'positive_threshold': 0.05,
    'negative_threshold': -0.05,
    'compound_score_range': (-1, 1),
}

# Data Collection Settings
COLLECTION_CONFIG = {
    'max_tweets_per_request': 100,
    'default_days_back': 7,
    'default_language': 'en',
    'rate_limit_wait': 15 * 60,  # 15 minutes
}

# Text Processing Settings
TEXT_PROCESSING = {
    'remove_urls': True,
    'remove_mentions': True,
    'remove_hashtags': True,
    'remove_special_chars': True,
    'min_text_length': 10,
    'stop_words': [
        'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of',
        'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have',
        'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
        'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these',
        'those', 'a', 'an', 'as', 'if', 'so', 'than', 'too', 'very'
    ]
}

# Streamlit Configuration
STREAMLIT_CONFIG = {
    'page_title': 'Social Media Sentiment Dashboard',
    'page_icon': '📊',
    'layout': 'wide',
    'initial_sidebar_state': 'expanded',
    'default_keyword': 'artificial intelligence',
    'max_tweets_slider': (10, 500, 100),
    'days_back_slider': (1, 7, 7),
}

# React Configuration
REACT_CONFIG = {
    'default_update_interval': 30000,  # 30 seconds
    'chart_colors': {
        'positive': '#28a745',
        'negative': '#dc3545',
        'neutral': '#ffc107',
        'primary': '#667eea',
    },
    'animation_duration': 300,
}

# Logging Configuration
LOGGING_CONFIG = {
    'level': os.getenv('LOG_LEVEL', 'INFO'),
    'format': '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    'file': LOGS_DIR / 'sentiment_dashboard.log',
    'max_bytes': 10 * 1024 * 1024,  # 10MB
    'backup_count': 5,
}

# Export Settings
EXPORT_CONFIG = {
    'csv_encoding': 'utf-8',
    'json_indent': 2,
    'timestamp_format': '%Y%m%d_%H%M%S',
}