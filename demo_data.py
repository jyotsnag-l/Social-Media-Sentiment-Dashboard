"""
Demo data generator for testing the sentiment dashboard without API access
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random
import json

def generate_demo_tweets(keyword="demo", num_tweets=100, days_back=7):
    """Generate demo tweet data for testing purposes."""

    # Sample tweet templates
    positive_templates = [
        "Love this new {keyword} feature!",
        "Amazing work on {keyword}, keep it up!",
        "{keyword} is absolutely fantastic",
        "Great to see improvements in {keyword}",
        "Excited about the future of {keyword}",
    ]

    negative_templates = [
        "Not happy with {keyword} lately",
        "{keyword} needs serious improvement",
        "Disappointed with {keyword} performance",
        "Having issues with {keyword}",
        "{keyword} is not working as expected",
    ]

    neutral_templates = [
        "Just used {keyword} for the first time",
        "Learning about {keyword} today",
        "{keyword} announcement scheduled for tomorrow",
        "Reading an article about {keyword}",
        "Attending a conference about {keyword}",
    ]

    # Generate tweets
    tweets = []
    for i in range(num_tweets):
        # Random timestamp within the date range
        random_seconds = random.randint(0, days_back * 24 * 3600)
        timestamp = datetime.now() - timedelta(seconds=random_seconds)

        # Randomly select sentiment and template
        sentiment_type = random.choices(
            ['positive', 'negative', 'neutral'],
            weights=[0.4, 0.3, 0.3]
        )[0]

        if sentiment_type == 'positive':
            template = random.choice(positive_templates)
            sentiment_score = random.uniform(0.1, 0.9)
            sentiment_label = 'Positive'
        elif sentiment_type == 'negative':
            template = random.choice(negative_templates)
            sentiment_score = random.uniform(-0.9, -0.1)
            sentiment_label = 'Negative'
        else:
            template = random.choice(neutral_templates)
            sentiment_score = random.uniform(-0.05, 0.05)
            sentiment_label = 'Neutral'

        # Generate tweet text
        tweet_text = template.format(keyword=keyword)

        # Add some variation
        if random.random() < 0.2:  # 20% chance to add extra text
            extra_phrases = [
                " Really impressed!",
                " Could be better though.",
                " What do you think?",
                " #innovation #tech",
                " Looking forward to updates.",
            ]
            tweet_text += random.choice(extra_phrases)

        tweet = {
            'tweet_id': f"demo_{i:06d}",
            'created_at': timestamp,
            'original_text': tweet_text,
            'cleaned_text': tweet_text.replace('#', '').replace('@', ''),
            'author_id': f"user_{random.randint(1, 1000)}",
            'retweet_count': random.randint(0, 50),
            'like_count': random.randint(0, 200),
            'reply_count': random.randint(0, 20),
            'quote_count': random.randint(0, 10),
            'sentiment_positive': max(0, sentiment_score) if sentiment_score > 0 else 0,
            'sentiment_negative': abs(min(0, sentiment_score)) if sentiment_score < 0 else 0,
            'sentiment_neutral': 1 - abs(sentiment_score) if -0.05 < sentiment_score < 0.05 else 0,
            'sentiment_compound': round(sentiment_score, 3),
            'sentiment_label': sentiment_label,
            'keyword': keyword,
            'date': timestamp.date(),
            'hour': timestamp.hour,
        }

        tweets.append(tweet)

    return pd.DataFrame(tweets).sort_values('created_at').reset_index(drop=True)

def save_demo_data(keyword="artificial intelligence", filename=None):
    """Generate and save demo data to CSV file."""
    df = generate_demo_tweets(keyword=keyword, num_tweets=200, days_back=7)

    if filename is None:
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"demo_sentiment_data_{timestamp}.csv"

    filepath = f"data/{filename}"
    df.to_csv(filepath, index=False)

    print(f"Demo data saved to: {filepath}")
    print(f"Generated {len(df)} demo tweets")
    print(f"Sentiment distribution:")
    print(df['sentiment_label'].value_counts())

    return filepath

if __name__ == "__main__":
    # Generate demo data when run directly
    save_demo_data()