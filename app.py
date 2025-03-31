
import streamlit as st
import yfinance as yf
import pandas as pd
import plotly.graph_objects as go
from datetime import datetime, timedelta
import numpy as np
from utils.technical_indicators import calculate_technical_indicators
from utils.sentiment_analysis import get_stock_sentiment_summary
import os

st.set_page_config(
    page_title="Stock Market Tracker",
    page_icon="📈",
    layout="wide"
)

# Create models directory if it doesn't exist
os.makedirs('models', exist_ok=True)

# Initialize session state variables
if "stocks" not in st.session_state:
    st.session_state.stocks = {
        "AAPL": {"name": "Apple Inc.", "price": 175.0, "change": 2.5},
        "MSFT": {"name": "Microsoft Corporation", "price": 340.0, "change": 1.2},
        "GOOGL": {"name": "Alphabet Inc.", "price": 130.0, "change": -0.8},
        "AMZN": {"name": "Amazon.com, Inc.", "price": 128.0, "change": 0.5},
    }

if "selected_stock" not in st.session_state:
    st.session_state.selected_stock = "AAPL"

if "search_mode" not in st.session_state:
    st.session_state.search_mode = "local"

if "is_processing" not in st.session_state:
    st.session_state.is_processing = False

if "show_ml_insights" not in st.session_state:
    st.session_state.show_ml_insights = False

if "sentiment_data" not in st.session_state:
    st.session_state.sentiment_data = None

if "selected_algorithm" not in st.session_state:
    st.session_state.selected_algorithm = "ensemble"

# UI Layout
st.title("Stock Market Tracker")

col1, col2 = st.columns([1, 3])

# Sidebar for search and controls
with col1:
    st.subheader("Search Stocks")
    
    # Search mode toggle
    search_mode = st.radio(
        "Search Mode",
        options=["Local", "Online"],
        index=0,
        horizontal=True,
        key="search_mode_selector"
    )
    st.session_state.search_mode = search_mode.lower()
    
    # Search input
    search_query = st.text_input("Enter stock symbol", key="search_input")
    
    if st.button("Search"):
        if search_query:
            st.session_state.is_processing = True
            
            if st.session_state.search_mode == "local":
                # Local search
                if search_query.upper() in st.session_state.stocks:
                    st.session_state.selected_stock = search_query.upper()
                    st.success(f"Found stock: {search_query.upper()}")
                else:
                    st.error(f"Stock {search_query.upper()} not found locally")
            else:
                # Online search
                try:
                    stock_info = yf.Ticker(search_query.upper())
                    info = stock_info.info
                    
                    if "shortName" in info:
                        # Add to session state if found
                        latest_quote = stock_info.history(period="1d")
                        if not latest_quote.empty:
                            current_price = latest_quote['Close'].iloc[-1]
                            prev_close = info.get('previousClose', current_price)
                            change = current_price - prev_close
                            
                            st.session_state.stocks[search_query.upper()] = {
                                "name": info.get('shortName', search_query.upper()),
                                "price": current_price,
                                "change": change
                            }
                            
                            st.session_state.selected_stock = search_query.upper()
                            st.success(f"Found and added stock: {info.get('shortName', search_query.upper())}")
                            
                            # Reset sentiment data
                            st.session_state.sentiment_data = None
                            st.session_state.show_ml_insights = False
                        else:
                            st.error(f"No recent data available for {search_query.upper()}")
                    else:
                        st.error(f"Stock {search_query.upper()} not found")
                except Exception as e:
                    st.error(f"Error searching for stock: {str(e)}")
            
            st.session_state.is_processing = False
    
    # Display available stocks
    st.subheader("Available Stocks")
    for symbol, stock_data in st.session_state.stocks.items():
        col_sym, col_price = st.columns([1, 1])
        with col_sym:
            st.write(f"**{symbol}**")
        with col_price:
            change_color = "green" if stock_data["change"] >= 0 else "red"
            change_symbol = "▲" if stock_data["change"] >= 0 else "▼"
            st.write(f"${stock_data['price']:.2f} <span style='color:{change_color}'>{change_symbol} {abs(stock_data['change']):.2f}</span>", unsafe_allow_html=True)
        
        if st.button(f"Select {symbol}"):
            st.session_state.selected_stock = symbol
            # Reset sentiment data when changing stocks
            st.session_state.sentiment_data = None
            st.session_state.show_ml_insights = False
            st.experimental_rerun()
    
    # ML Algorithm Selection
    st.subheader("ML Algorithm")
    algorithm = st.radio(
        "Select Prediction Algorithm",
        options=["Linear Regression", "Random Forest", "SVM", "Ensemble (All)"],
        index=3,
        key="algorithm_selector"
    )
    
    # Map the selection to algorithm code
    algorithm_map = {
        "Linear Regression": "linear_regression",
        "Random Forest": "random_forest",
        "SVM": "svm",
        "Ensemble (All)": "ensemble"
    }
    
    st.session_state.selected_algorithm = algorithm_map[algorithm]
    
    # Display algorithm info
    if algorithm == "Linear Regression":
        st.info("Linear Regression uses a linear approach to modeling the relationship between input features and stock prices.")
    elif algorithm == "Random Forest":
        st.info("Random Forest uses multiple decision trees to make more accurate predictions with better handling of non-linear relationships.")
    elif algorithm == "SVM":
        st.info("Support Vector Machine (SVM) is effective for capturing complex patterns in market data that may not be visible with other algorithms.")
    else:
        st.info("Ensemble combines predictions from multiple algorithms for a more robust forecast.")

# Main content
with col2:
    symbol = st.session_state.selected_stock
    
    if symbol in st.session_state.stocks:
        stock_data = st.session_state.stocks[symbol]
        
        # Stock card
        st.subheader(f"{symbol} - {stock_data['name']}")
        price_col, change_col, ml_col = st.columns([1, 1, 1])
        with price_col:
            st.metric("Current Price", f"${stock_data['price']:.2f}")
        with change_col:
            st.metric("Change", f"{stock_data['change']:.2f}", delta=f"{stock_data['change']:.2f}")
        with ml_col:
            if st.button("Generate ML Insights", key="ml_insights_btn"):
                with st.spinner(f"Analyzing {symbol} with {st.session_state.selected_algorithm} algorithm..."):
                    # Get sentiment analysis and ML insights
                    st.session_state.sentiment_data = get_stock_sentiment_summary(symbol)
                    st.session_state.show_ml_insights = True
        
        # Get historical data
        try:
            end_date = datetime.now()
            start_date = end_date - timedelta(days=180)
            historical_data = yf.download(symbol, start=start_date, end=end_date)
            
            if not historical_data.empty:
                # Stock Chart
                st.subheader("Historical Price Chart")
                
                # Create Plotly figure
                fig = go.Figure()
                fig.add_trace(go.Candlestick(
                    x=historical_data.index,
                    open=historical_data['Open'],
                    high=historical_data['High'],
                    low=historical_data['Low'],
                    close=historical_data['Close'],
                    name="Candlestick"
                ))
                
                # Add predictions if available
                if st.session_state.show_ml_insights and st.session_state.sentiment_data:
                    sentiment_data = st.session_state.sentiment_data
                    if "ml_predictions" in sentiment_data and sentiment_data["ml_predictions"]:
                        predictions = sentiment_data["ml_predictions"].get("predictions", [])
                        
                        if predictions:
                            # Extract prediction data
                            pred_dates = [p["date"] for p in predictions]
                            pred_prices = [p["price"] for p in predictions]
                            
                            # Add prediction trace
                            fig.add_trace(go.Scatter(
                                x=pred_dates,
                                y=pred_prices,
                                mode='lines',
                                line=dict(color='rgb(0, 200, 0)', width=2, dash='dash'),
                                name=f"{st.session_state.selected_algorithm.replace('_', ' ').title()} Prediction"
                            ))
                
                fig.update_layout(
                    title=f"{symbol} Stock Price",
                    xaxis_title="Date",
                    yaxis_title="Price (USD)",
                    height=500,
                )
                
                st.plotly_chart(fig, use_container_width=True)
                
                # Technical indicators
                st.subheader("Technical Indicators")
                
                # Calculate technical indicators
                indicators = calculate_technical_indicators(historical_data)
                
                indicator_cols = st.columns(3)
                with indicator_cols[0]:
                    st.metric("RSI (14)", f"{indicators['RSI']:.2f}")
                with indicator_cols[1]:
                    st.metric("MACD", f"{indicators['MACD']:.2f}")
                with indicator_cols[2]:
                    st.metric("20-Day SMA", f"${indicators['SMA_20']:.2f}")
                
                indicator_cols2 = st.columns(3)
                with indicator_cols2[0]:
                    st.metric("50-Day SMA", f"${indicators['SMA_50']:.2f}")
                with indicator_cols2[1]:
                    st.metric("200-Day SMA", f"${indicators['SMA_200']:.2f}")
                with indicator_cols2[2]:
                    st.metric("Bollinger Bands", f"${indicators['BB_middle']:.2f} (±{indicators['BB_width']:.2f})")
                
                # Show ML insights if requested
                if st.session_state.show_ml_insights and st.session_state.sentiment_data:
                    sentiment_data = st.session_state.sentiment_data
                    
                    st.subheader("AI Analysis & Insights")
                    
                    # Sentiment indicators
                    sentiment_cols = st.columns(3)
                    with sentiment_cols[0]:
                        sentiment_score = sentiment_data["sentiment_score"]
                        sentiment_color = "green" if sentiment_score > 0.05 else "red" if sentiment_score < -0.05 else "gray"
                        st.metric("News Sentiment", 
                                  sentiment_data["sentiment_label"], 
                                  f"{sentiment_score:.2f}", 
                                  delta_color="normal" if sentiment_score >= 0 else "inverse")
                    
                    with sentiment_cols[1]:
                        # Show number of news articles analyzed
                        num_articles = 0
                        if "news_sentiment" in sentiment_data and "analyzed_news" in sentiment_data["news_sentiment"]:
                            num_articles = len(sentiment_data["news_sentiment"]["analyzed_news"])
                        st.metric("News Articles Analyzed", num_articles)
                    
                    with sentiment_cols[2]:
                        # Calculate stock momentum based on recent price action
                        recent_close = historical_data['Close'].iloc[-5:]
                        momentum = (recent_close.iloc[-1] - recent_close.iloc[0]) / recent_close.iloc[0] * 100
                        st.metric("5-Day Momentum", f"{momentum:.2f}%", 
                                  f"{momentum:.2f}%",
                                  delta_color="normal" if momentum >= 0 else "inverse")
                                  
                    # ML Prediction Results
                    if "ml_predictions" in sentiment_data and sentiment_data["ml_predictions"]:
                        ml_predictions = sentiment_data["ml_predictions"]
                        
                        st.subheader("Machine Learning Predictions")
                        
                        # Prediction metrics
                        pred_cols = st.columns(3)
                        with pred_cols[0]:
                            algorithm_name = ml_predictions.get("algorithm", "ensemble").replace("_", " ").title()
                            st.metric("Algorithm", algorithm_name)
                        
                        with pred_cols[1]:
                            if "model_metrics" in ml_predictions:
                                confidence = ml_predictions["model_metrics"].get("confidence", 0)
                                st.metric("Model Confidence", f"{confidence*100:.2f}%")
                        
                        with pred_cols[2]:
                            if "predictions" in ml_predictions and ml_predictions["predictions"]:
                                last_pred = ml_predictions["predictions"][-1]
                                current_price = stock_data["price"]
                                pred_change = ((last_pred["price"] - current_price) / current_price) * 100
                                st.metric("30-Day Forecast", 
                                          f"${last_pred['price']:.2f}", 
                                          f"{pred_change:+.2f}%",
                                          delta_color="normal" if pred_change >= 0 else "inverse")
                    
                        # Algorithm comparison
                        if "algorithm_comparison" in sentiment_data and sentiment_data["algorithm_comparison"]:
                            st.subheader("Algorithm Performance Comparison")
                            
                            algo_data = sentiment_data["algorithm_comparison"]
                            
                            # Create comparison table
                            algo_df = pd.DataFrame.from_dict(algo_data, orient='index')
                            
                            # Sort by accuracy (highest first)
                            if not algo_df.empty and 'accuracy' in algo_df.columns:
                                algo_df = algo_df.sort_values('accuracy', ascending=False)
                                
                                # Highlight the best algorithm
                                st.markdown(f"**Best Algorithm:** {algo_df.index[0].replace('_', ' ').title()} (Accuracy: {algo_df['accuracy'].iloc[0]}%)")
                                
                                # Format column names
                                algo_df.columns = [col.upper() for col in algo_df.columns]
                                algo_df.index = [idx.replace('_', ' ').title() for idx in algo_df.index]
                                
                                # Display table
                                st.table(algo_df)
                                
                                # Add explanation
                                st.markdown("""
                                **Metrics Explanation:**
                                - **MAE:** Mean Absolute Error - Average of absolute differences between predictions and actual values
                                - **RMSE:** Root Mean Squared Error - Square root of the average squared differences
                                - **MAPE:** Mean Absolute Percentage Error - Average percentage difference
                                - **ACCURACY:** 100% - MAPE (higher is better)
                                """)
                    
                    # Stock insights
                    st.subheader("AI Generated Summary")
                    st.write(sentiment_data["insights"])
                    
                    # News headlines
                    if "news_sentiment" in sentiment_data and "analyzed_news" in sentiment_data["news_sentiment"]:
                        st.subheader("Recent News Headlines")
                        for article in sentiment_data["news_sentiment"]["analyzed_news"]:
                            title = article.get("title", "")
                            publisher = article.get("publisher", "")
                            sentiment_score = article.get("sentiment", {}).get("vader", {}).get("compound", 0)
                            sentiment_color = "green" if sentiment_score > 0.05 else "red" if sentiment_score < -0.05 else "gray"
                            
                            st.markdown(f"**{title}** - *{publisher}*")
                            st.markdown(f"<span style='color:{sentiment_color}'>Sentiment: {sentiment_score:.2f}</span>", unsafe_allow_html=True)
                            st.markdown("---")
            else:
                st.warning("No historical data available")
        except Exception as e:
            st.error(f"Error loading historical data: {str(e)}")
    else:
        st.warning(f"Stock {symbol} not found. Please search for a valid stock symbol.")
