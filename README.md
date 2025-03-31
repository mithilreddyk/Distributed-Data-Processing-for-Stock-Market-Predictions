
# Stock Market Tracker - Python Application

This application allows users to track stock prices, view historical data, analyze technical indicators, and leverage machine learning for stock sentiment analysis.

## Features

- Search for stocks locally and online using Yahoo Finance API
- View current stock prices and price changes
- Display historical price data with candlestick charts
- Calculate and display technical indicators (RSI, MACD, Moving Averages, Bollinger Bands)
- Machine Learning features:
  - News sentiment analysis using Natural Language Processing
  - AI-generated stock summaries and insights
  - Technical indicator analysis

## Setup

1. Install required dependencies:
   ```
   pip install -r requirements.txt
   ```

2. Run the Streamlit application:
   ```
   streamlit run app.py
   ```
   
   Or use the run.py script:
   ```
   python run.py
   ```

3. Open your browser and navigate to the URL provided by Streamlit (typically http://localhost:8501)

## Usage

1. Search for a stock by entering its ticker symbol and clicking "Search"
2. Toggle between "Local" and "Online" search modes to find stocks
3. Select a stock from the list to view its details
4. Analyze the candlestick chart and technical indicators
5. Click "Generate ML Insights" to view AI-powered analysis and sentiment

## Technologies Used

- Python 3.8+
- Streamlit for the frontend interface
- YFinance for stock data retrieval
- Pandas for data manipulation
- Plotly for interactive charts
- NumPy for numerical calculations
- NLTK and Transformers for natural language processing and sentiment analysis
- PyTorch for machine learning models

## Notes

The machine learning components may require downloading model files on first use, which could take some time depending on your internet connection. The application will fall back to simpler models if the larger ones cannot be loaded.
