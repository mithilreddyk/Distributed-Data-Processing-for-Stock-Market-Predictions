
# Stock Market Tracker - Python Application

This application allows users to track stock prices, view historical data, analyze technical indicators, and leverage machine learning for stock sentiment analysis and price prediction.

## Features

- Search for stocks locally and online using Yahoo Finance API
- View current stock prices and price changes
- Display historical price data with candlestick charts
- Calculate and display technical indicators (RSI, MACD, Moving Averages, Bollinger Bands)
- Machine Learning features:
  - News sentiment analysis using Natural Language Processing
  - AI-generated stock summaries and insights
  - Advanced ML stock price prediction algorithms:
    - Linear Regression
    - Random Forest
    - Support Vector Machine (SVM)
    - Ensemble method (combination of all algorithms)
  - MapReduce-like parallel data processing
  - Algorithm performance comparison

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
5. Choose a machine learning algorithm for price prediction:
   - Linear Regression: Simple but effective for stocks with linear price trends
   - Random Forest: Better for capturing non-linear relationships
   - SVM: Good for identifying complex patterns
   - Ensemble: Combines all algorithms for more robust predictions
6. Click "Generate ML Insights" to view AI-powered analysis and predictions

## Machine Learning Approach

The application uses a MapReduce-like approach to process large datasets in parallel:
- Map phase: Splits data into chunks and processes each chunk independently
- Reduce phase: Combines results from all chunks for final prediction

The prediction pipeline includes:
1. Feature engineering from historical price data
2. Model training using the selected algorithm
3. Price prediction for the next 30 days
4. Performance evaluation and algorithm comparison

## Technologies Used

- Python 3.8+
- Streamlit for the frontend interface
- YFinance for stock data retrieval
- Pandas and NumPy for data manipulation
- Plotly for interactive charts
- Scikit-learn for machine learning models
- NLTK and Transformers for natural language processing and sentiment analysis
- PyTorch for transformer models
- Joblib for model serialization

## Notes

The machine learning components may require downloading model files on first use, which could take some time depending on your internet connection. The application will fall back to simpler models if the larger ones cannot be loaded.
