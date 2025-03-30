
import pandas as pd
import numpy as np

def calculate_technical_indicators(data):
    """Calculate various technical indicators from stock price data."""
    if data.empty:
        return {
            "RSI": 0,
            "MACD": 0,
            "SMA_20": 0,
            "SMA_50": 0,
            "SMA_200": 0,
            "BB_middle": 0,
            "BB_width": 0
        }
    
    # Make a copy to avoid SettingWithCopyWarning
    df = data.copy()
    
    # Calculate RSI (14-period)
    delta = df['Close'].diff()
    gain = delta.where(delta > 0, 0)
    loss = -delta.where(delta < 0, 0)
    
    avg_gain = gain.rolling(window=14).mean()
    avg_loss = loss.rolling(window=14).mean()
    
    rs = avg_gain / avg_loss
    rsi = 100 - (100 / (1 + rs))
    
    # Calculate MACD
    exp1 = df['Close'].ewm(span=12, adjust=False).mean()
    exp2 = df['Close'].ewm(span=26, adjust=False).mean()
    macd = exp1 - exp2
    signal = macd.ewm(span=9, adjust=False).mean()
    macd_hist = macd - signal
    
    # Calculate Simple Moving Averages
    sma_20 = df['Close'].rolling(window=20).mean()
    sma_50 = df['Close'].rolling(window=50).mean()
    sma_200 = df['Close'].rolling(window=200).mean()
    
    # Calculate Bollinger Bands
    bb_middle = sma_20
    bb_std = df['Close'].rolling(window=20).std()
    bb_upper = bb_middle + (bb_std * 2)
    bb_lower = bb_middle - (bb_std * 2)
    bb_width = (bb_upper - bb_lower) / bb_middle
    
    # Return the most recent values
    return {
        "RSI": rsi.iloc[-1] if not pd.isna(rsi.iloc[-1]) else 0,
        "MACD": macd.iloc[-1] if not pd.isna(macd.iloc[-1]) else 0,
        "SMA_20": sma_20.iloc[-1] if not pd.isna(sma_20.iloc[-1]) else 0,
        "SMA_50": sma_50.iloc[-1] if not pd.isna(sma_50.iloc[-1]) else 0,
        "SMA_200": sma_200.iloc[-1] if not pd.isna(sma_200.iloc[-1]) else 0,
        "BB_middle": bb_middle.iloc[-1] if not pd.isna(bb_middle.iloc[-1]) else 0,
        "BB_width": bb_width.iloc[-1] if not pd.isna(bb_width.iloc[-1]) else 0
    }
