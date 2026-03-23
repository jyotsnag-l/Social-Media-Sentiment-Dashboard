#!/usr/bin/env python3
"""
Quick launcher for the Streamlit dashboard
"""

import os
import sys
import subprocess

def main():
    """Launch the Streamlit app."""
    print("🚀 Starting Streamlit Dashboard...")

    # Change to streamlit app directory
    streamlit_dir = os.path.join(os.path.dirname(__file__), 'streamlit_app')

    if not os.path.exists(streamlit_dir):
        print("❌ Streamlit app directory not found")
        sys.exit(1)

    # Check if virtual environment exists
    venv_dir = os.path.join(os.path.dirname(__file__), 'venv')
    if os.path.exists(venv_dir):
        if os.name == 'nt':  # Windows
            python_path = os.path.join(venv_dir, 'Scripts', 'python.exe')
        else:  # Unix/Linux/Mac
            python_path = os.path.join(venv_dir, 'bin', 'python')
    else:
        python_path = sys.executable

    # Run streamlit
    try:
        subprocess.run([python_path, '-m', 'streamlit', 'run', 'app.py'], 
                      cwd=streamlit_dir, check=True)
    except subprocess.CalledProcessError as e:
        print(f"❌ Error running Streamlit: {e}")
        sys.exit(1)
    except KeyboardInterrupt:
        print("\n👋 Streamlit dashboard stopped")

if __name__ == "__main__":
    main()