
import subprocess
import webbrowser
import time
import os

def main():
    print("Starting Stock Market Tracker...")
    print("Checking dependencies...")
    
    try:
        # Check if requirements are installed
        subprocess.run(["pip", "install", "-r", "requirements.txt"], check=True)
        print("Dependencies installed successfully.")
    except subprocess.CalledProcessError:
        print("Error installing dependencies. Please check requirements.txt")
        return
    
    print("Starting Streamlit application...")
    
    # Start Streamlit in a separate process
    streamlit_process = subprocess.Popen(["streamlit", "run", "app.py"])
    
    # Wait a moment for Streamlit to start
    time.sleep(3)
    
    # Open browser
    print("Opening application in web browser...")
    webbrowser.open("http://localhost:8501")
    
    print("Application running!")
    print("Press Ctrl+C to stop the application")
    
    try:
        # Keep the script running until interrupted
        streamlit_process.wait()
    except KeyboardInterrupt:
        print("Stopping application...")
        streamlit_process.terminate()
        print("Application stopped.")

if __name__ == "__main__":
    main()
