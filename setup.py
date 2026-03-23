#!/usr/bin/env python3
"""
Setup script for Social Media Sentiment Dashboard
Automates the installation and configuration process
"""

import os
import subprocess
import sys
from pathlib import Path

def run_command(command, cwd=None, shell=True):
    """Run a shell command and return the result."""
    try:
        result = subprocess.run(
            command, 
            shell=shell, 
            cwd=cwd, 
            capture_output=True, 
            text=True, 
            check=True
        )
        return result.stdout, result.stderr
    except subprocess.CalledProcessError as e:
        print(f"Error running command: {command}")
        print(f"Error: {e.stderr}")
        return None, e.stderr

def check_python_version():
    """Check if Python version is 3.8 or higher."""
    if sys.version_info < (3, 8):
        print("❌ Python 3.8 or higher is required.")
        print(f"Current version: {sys.version}")
        return False
    print(f"✅ Python {sys.version.split()[0]} detected")
    return True

def check_node_version():
    """Check if Node.js is installed."""
    stdout, stderr = run_command("node --version")
    if stdout:
        print(f"✅ Node.js {stdout.strip()} detected")
        return True
    else:
        print("❌ Node.js not found. Please install Node.js 14 or higher.")
        return False

def setup_python_environment():
    """Set up Python virtual environment and install dependencies."""
    print("\n🐍 Setting up Python environment...")

    # Create virtual environment
    print("Creating virtual environment...")
    stdout, stderr = run_command("python -m venv venv")
    if stderr:
        print(f"Warning: {stderr}")

    # Activate virtual environment and install dependencies
    if os.name == 'nt':  # Windows
        pip_path = "venv\\Scripts\\pip.exe"
    else:  # Unix/Linux/Mac
        pip_path = "venv/bin/pip"

    print("Installing Python dependencies...")
    stdout, stderr = run_command(f"{pip_path} install -r requirements.txt")
    if stderr and "error" in stderr.lower():
        print(f"Error installing dependencies: {stderr}")
        return False

    print("✅ Python environment setup complete")
    return True

def setup_react_environment():
    """Set up React environment and install dependencies."""
    print("\n⚛️  Setting up React environment...")

    react_dir = "react_app"
    if not os.path.exists(react_dir):
        print(f"❌ React directory '{react_dir}' not found")
        return False

    print("Installing Node.js dependencies...")
    stdout, stderr = run_command("npm install", cwd=react_dir)
    if stderr and "error" in stderr.lower():
        print(f"Error installing Node dependencies: {stderr}")
        return False

    print("✅ React environment setup complete")
    return True

def create_env_file():
    """Create .env file from template if it doesn't exist."""
    print("\n🔧 Setting up environment configuration...")

    env_file = ".env"
    env_example = ".env.example"

    if os.path.exists(env_file):
        print("✅ .env file already exists")
        return True

    if os.path.exists(env_example):
        with open(env_example, 'r') as src, open(env_file, 'w') as dst:
            dst.write(src.read())
        print("✅ Created .env file from template")
        print("⚠️  Please edit .env file and add your Twitter API credentials")
        return True
    else:
        print("❌ .env.example file not found")
        return False

def create_directories():
    """Create necessary directories."""
    print("\n📁 Creating directories...")

    directories = ["data", "logs"]
    for directory in directories:
        os.makedirs(directory, exist_ok=True)
        print(f"✅ Created/verified directory: {directory}")

def print_usage_instructions():
    """Print usage instructions."""
    print("\n" + "="*60)
    print("🎉 SETUP COMPLETE!")
    print("="*60)
    print("\n📋 Next Steps:")
    print("\n1. Configure Twitter API:")
    print("   - Edit .env file")
    print("   - Add your TWITTER_BEARER_TOKEN")
    print("\n2. Run the Streamlit Dashboard:")
    if os.name == 'nt':  # Windows
        print("   venv\\Scripts\\activate")
    else:  # Unix/Linux/Mac
        print("   source venv/bin/activate")
    print("   cd streamlit_app")
    print("   streamlit run app.py")
    print("\n3. Run the React Dashboard (in a new terminal):")
    print("   cd react_app")
    print("   npm start")
    print("\n4. Use Python backend directly:")
    print("   python -c "from backend.tweet_sentiment_analyzer import TwitterSentimentAnalyzer; print('Backend ready!')"")
    print("\n📚 For detailed instructions, see README.md")
    print("\n" + "="*60)

def main():
    """Main setup function."""
    print("🚀 Social Media Sentiment Dashboard Setup")
    print("="*50)

    # Check prerequisites
    if not check_python_version():
        sys.exit(1)

    if not check_node_version():
        print("⚠️  Continuing without Node.js (React dashboard will not work)")

    # Setup environments
    create_directories()
    create_env_file()

    if not setup_python_environment():
        print("❌ Python setup failed")
        sys.exit(1)

    if check_node_version():
        if not setup_react_environment():
            print("❌ React setup failed")
            # Don't exit, Python components can still work

    print_usage_instructions()

if __name__ == "__main__":
    main()