import json
import sys
import time

import numpy as np
import pandas as pd
import requests
import yfinance as yf

import warnings

warnings.simplefilter(action='ignore', category=FutureWarning)

pd.set_option('display.max_rows', 500)
pd.set_option('display.max_columns', 500)
pd.set_option('display.width', 1000)

NUMBER_OF_DAYS_AFTER_SIGNAL = 130

def get_tickers():
    data = []

    data = data + \
           requests.get(f'https://financialmodelingprep.com/api/v3/stock-screener?'
                        f'isEtf=false&'
                        f'exchange=NYSE,NASDAQ&'
                        f'marketCapMoreThan=100000000&'
                        f'limit=50000&'
                        f'apikey=b26b8a336137511e753794559f848a83').json()

    df = pd.DataFrame(data)

    return df

def get_history(symbol, period="10y", interval="1d"):
    try:
        ticker = yf.Ticker(symbol)
        return ticker.history(period=period, interval=interval)
    except Exception as e:
        print(e)
        return None

def main(mode):
    frames = []
    tickers = get_tickers()

    for index, ticker in tickers.iterrows():
        try:
            print(f"{index}/{len(tickers)} ")

            symbol = ticker['symbol']
            df = analyse_symbol(symbol, mode)

            if (len(df) > 0):
                df['symbol'] = symbol
                frames.append(df)

            time.sleep(0.1)
        except Exception as e:
            print(e)

    return pd.concat(frames).to_csv(f"./export_{mode}.csv")


def analyse_symbol(symbol):
    period = "2y"
    df = get_history(symbol, period)

    close = df['Close']
    open = df['Open']
    high = df['High']
    low = df['Low']
    volume = df['Volume']

    # Candle stats
    df['body_length'] = (close - open).abs()
    df['total_length'] = high - low
    df['body_length_sma_50'] = df['body_length'].rolling(window=50).mean()
    df['body_length_perc_from_sma'] = (df['body_length'] / df['body_length_sma_50'].shift()) * 100
    df['body_perc'] = (df['body_length'] / df['total_length']) * 100

    # True range
    df['tr0'] = abs(high - low)
    df['tr1'] = abs(high - close.shift())
    df['tr2'] = abs(low - close.shift())
    df['tr'] = df[['tr0', 'tr1', 'tr2']].max(axis=1)
    df['atr_50'] = df['tr'].rolling(window=50).mean()
    df['tr_from_atr'] = (df['tr'] / df['body_length_sma_50'].shift()) * 100

    # price moving averages
    df['SMA_150'] = close.rolling(window=150).mean()
    df['EMA_10'] = close.ewm(span=10, adjust=False).mean()
    df['EMA_20'] = close.ewm(span=20, adjust=False).mean()

    # volume moving averages
    df['V_SMA_100'] = volume.rolling(window=100).mean()
    df['volume_perc_from_sma'] = (volume / df['V_SMA_100']) * 100

    # High / Low
    df['ALL_TIME_HIGH'] = high.max()
    df['percentage_of_all_time_high'] = close / df['ALL_TIME_HIGH'] * 100
    df['highest_high_last_100_previous_days'] = high.shift().rolling(window=100).max()

    df['breakout'] = close > df['highest_high_last_100_previous_days']

    df['signal'] = (
            (close > open) &
            (close > df['EMA_10']) &
            (df['EMA_10'] > df['EMA_20']) &
            (df['EMA_20'] > df['SMA_150']) &
            (df['SMA_150'].diff() > 0) &
            (
                    ((df['body_perc'] > 60) & (df['body_length_perc_from_sma'] > 150)) |
                    (df['tr_from_atr'] > 200))
            &
            (df['breakout'] == True) &
            (df['breakout'].shift() != True) &
            (df['volume_perc_from_sma'] > 200) &
            (df['V_SMA_100'] > 300000)
    )
    signal_indices = df.index[df['signal']]

    # Additional logic to check if the signal is followed by a price increase

    # Define death cross
    df['death_cross'] = df['Close'] < df['SMA_150']

    # Find the closest death cross within the next 100 days after the signal
    def find_growth_window_closing_day(signal_idx):
        signal_pos = df.index.get_loc(signal_idx)  # Get the position of the signal date
        future_data = df.iloc[
                      signal_pos + 1:signal_pos + NUMBER_OF_DAYS_AFTER_SIGNAL + 1]  # Use position-based indexing
        death_cross_idx = future_data[future_data['death_cross']].index
        return death_cross_idx[0] if not death_cross_idx.empty else future_data.index[-1]

    df['growth_window_closing_day'] = np.nan
    df.loc[df['signal'], 'growth_window_closing_day'] = signal_indices.map(find_growth_window_closing_day)

    # Calculate the highest high between signal day and closest death cross day
    def highest_high(signal_idx):
        death_cross_day = df.loc[signal_idx, 'growth_window_closing_day']
        if not pd.isna(death_cross_day):
            return df.loc[signal_idx:death_cross_day, 'High'].max()
        return np.nan

    df['highest_high_after_signal'] = np.nan
    df.loc[df['signal'], 'highest_high_after_signal'] = signal_indices.map(highest_high)

    final_df = df.tail(15)

    return final_df[['body_length_perc_from_sma', 'body_perc', 'tr_from_atr', 'volume_perc_from_sma', 'breakout']]


if __name__ == '__main__':
    symbol = sys.argv[1]

    df = analyse_symbol(symbol)

    print(df.to_json(orient='table', index=True))


