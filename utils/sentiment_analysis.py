
import nltk
import torch
from nltk.sentiment import SentimentIntensityAnalyzer
from transformers import pipeline, AutoModelForSequenceClassification, AutoTokenizer
import requests
from bs4 import BeautifulSoup
import os
import yfinance as yf
import re

# Download necessary NLTK data (first time only)
try:
    nltk.data.find('vader_lexicon')
except LookupError:
    nltk.download('vader_lexicon')

# Initialize the sentiment analyzer
sia = SentimentIntensityAnalyzer()

# Initialize a lightweight sentiment model
sentiment_model_name = "distilbert-base-uncased-finetuned-sst-2-english"
try:
    sentiment_pipeline = pipeline("sentiment-analysis", model=sentiment_model_name)
except:
    # Fallback to VADER if the model can't be loaded
    sentiment_pipeline = None

def analyze_sentiment(text):
    """Analyze sentiment using NLTK's VADER and/or the transformer model."""
    # Get VADER sentiment
    vader_scores = sia.polarity_scores(text)
    
    # Get transformer model sentiment if available
    transformer_scores = None
    if sentiment_pipeline:
        try:
            # Limit text length for transformer model
            limited_text = text[:512]
            transformer_result = sentiment_pipeline(limited_text)[0]
            transformer_scores = {
                "label": transformer_result["label"],
                "score": transformer_result["score"]
            }
        except Exception as e:
            print(f"Error using transformer model: {e}")
    
    return {
        "vader": vader_scores,
        "transformer": transformer_scores
    }

def get_news_sentiment(symbol, num_articles=5):
    """Get news articles and analyze their sentiment for a given stock."""
    # Fetch news using yfinance
    stock = yf.Ticker(symbol)
    news_data = stock.news
    
    if not news_data:
        return {"error": "No news found"}
    
    # Limit to the requested number of articles
    news_data = news_data[:num_articles]
    
    analyzed_news = []
    combined_text = ""
    
    for article in news_data:
        title = article.get('title', '')
        combined_text += title + " "
        
        # Analyze each article
        sentiment = analyze_sentiment(title)
        
        analyzed_news.append({
            "title": title,
            "publisher": article.get('publisher', ''),
            "link": article.get('link', ''),
            "publish_date": article.get('providerPublishTime', ''),
            "sentiment": sentiment
        })
    
    # Analyze all headlines together
    overall_sentiment = analyze_sentiment(combined_text)
    
    return {
        "analyzed_news": analyzed_news,
        "overall_sentiment": overall_sentiment
    }

def generate_stock_insights(symbol, price_data=None):
    """Generate insights about a stock using available data."""
    # Get stock information
    stock = yf.Ticker(symbol)
    info = stock.info
    
    # Basic stock information
    company_name = info.get('shortName', symbol)
    sector = info.get('sector', 'Unknown')
    industry = info.get('industry', 'Unknown')
    
    # Create a summary
    summary = f"Analysis for {company_name} ({symbol}):\n\n"
    
    # Add company description if available
    if 'longBusinessSummary' in info:
        summary += f"Company Description: {info['longBusinessSummary'][:300]}...\n\n"
    
    # Add sector and industry
    summary += f"Sector: {sector}\n"
    summary += f"Industry: {industry}\n\n"
    
    # Add price information if available
    if price_data is not None:
        current_price = price_data.get('price', 'N/A')
        price_change = price_data.get('change', 'N/A')
        change_percent = price_data.get('changePercent', 'N/A')
        
        summary += f"Current Price: ${current_price}\n"
        summary += f"Price Change: ${price_change} ({change_percent}%)\n\n"
    
    # Add financial metrics if available
    if 'trailingPE' in info:
        summary += f"P/E Ratio: {info.get('trailingPE', 'N/A')}\n"
    
    if 'marketCap' in info:
        market_cap = info.get('marketCap', 0)
        if market_cap > 1_000_000_000:
            market_cap_str = f"${market_cap / 1_000_000_000:.2f} billion"
        else:
            market_cap_str = f"${market_cap / 1_000_000:.2f} million"
        summary += f"Market Cap: {market_cap_str}\n"
    
    summary += "\nThis is an automated analysis and should not be considered financial advice."
    
    return summary

def get_stock_sentiment_summary(symbol):
    """Get a combined sentiment and summary for a stock."""
    # Get news sentiment
    news_sentiment = get_news_sentiment(symbol)
    
    # Get stock info
    stock = yf.Ticker(symbol)
    quote = stock.history(period="1d")
    
    if not quote.empty:
        price_data = {
            'price': quote['Close'].iloc[-1],
            'change': quote['Close'].iloc[-1] - quote['Open'].iloc[-1],
            'changePercent': ((quote['Close'].iloc[-1] - quote['Open'].iloc[-1]) / quote['Open'].iloc[-1]) * 100
        }
    else:
        price_data = None
    
    # Generate insights
    insights = generate_stock_insights(symbol, price_data)
    
    # Calculate overall sentiment score
    if "overall_sentiment" in news_sentiment:
        vader_score = news_sentiment["overall_sentiment"]["vader"]["compound"]
        sentiment_label = "Positive" if vader_score > 0.05 else "Negative" if vader_score < -0.05 else "Neutral"
    else:
        vader_score = 0
        sentiment_label = "Neutral"
    
    return {
        "symbol": symbol,
        "insights": insights,
        "news_sentiment": news_sentiment,
        "sentiment_score": vader_score,
        "sentiment_label": sentiment_label
    }
