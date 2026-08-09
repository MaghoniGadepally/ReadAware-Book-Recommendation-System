# ReadAware: A Smart AI-Based Platform for Personalized Book Recommendations

ReadAware is an advanced, AI-driven digital platform designed to resolve information overload and legacy keyword search inefficiencies in book discovery. Moving beyond standard database queries, the system deploys a unique 4-layer hybrid recommendation engine that synchronizes custom content-based filtering, user-to-user collaborative similarity matrices, crowd popularity metrics, and an NLP-powered mood questionnaire.

## 🚀 Key Features
- **4-Layer Hybrid Engine**: Blends content, collaborative, trending popularity, and emotional context (mood analysis) parameters.
- **Smart User Interaction**: Integrated voice-activated search input parsing for hands-free navigation.
- **Robust System Security**: Automated email-based One-Time Password (OTP) validation tokens alongside strict cryptographic login management.
- **Administrative Control**: Real-time content moderation, feedback handling, and user database control via a centralized dashboard.

## 🛠️ Technical Architecture
- **Frontend Layer**: React JS (Dynamic, responsive user interface)
- **Backend Service**: FastAPI, Python (Asynchronous, high-performance data processing)
- **Data Persistence**: MySQL (Relational schema optimization)

## 🧠 Machine Learning Model Generation (.pkl)
To keep this repository lightweight and optimized, heavy pre-trained binary pickle (`.pkl`) files are omitted from version control. You can generate them effortlessly locally using our provided notebooks:
1. Navigate to the `/ml_models` directory.
2. Open the `.ipynb` notebook files using Google Colab or Jupyter Notebooks.
3. Execute all code cells sequentially; the notebooks are configured to automatically process the book datasets, train the recommendation layers, and export the fresh working `.pkl` model files.
4. Move the newly generated `.pkl` files directly into your local `/backend` environment to enable real-time prediction inference.

## 📦 Installation & Setup

### ⚙️ Step 1: Backend Setup (FastAPI)

1. **Clone the repository**:
   ```bash
   git clone https://github.com
   ```

2. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
   *(Note: This automatically configures optimized versions of `passlib` and `bcrypt` to prevent dependency conflicts).*

3. **Configure Environment Variables**:
   Create a local `.env` file and replace the credentials with your actual system connection strings:
   Database password in the file `config.py` and API key in `auth.py`
   ```python
   MYSQL_PASSWORD = "Your_SQL_Password"
   EMAIL_SECRET_KEY = "YOUR_API_KEY_HERE"
   ```
4. Navigate into the backend environment:
   ```bash
   cd backend
   ```
   
5. **Launch the backend server**:
   ```bash
   uvicorn main:app --reload
   ```
   
### 🖥️ Step 2: Frontend Setup (React JS)
1. Navigate into the frontend environment:
   ```bash
   cd ../frontend
   ```
2. Install node dependencies and packages:
   ```bash
   npm install react-router-dom
   npm install -D tailwindcss@3 postcss autoprefixer
   ```
3. Launch the development server:
   ```bash
   npm start
   ```
   
## 📊 Performance & Research Outcomes
Backed by formal peer-reviewed academic publication (Journal of Computer and Electrical Sciences), the system architecture has been thoroughly optimized and validated:
- **Accuracy Metric**: Achieved a verified **88% recommendation accuracy score**, completely outperforming standalone models.
- **System Latency**: Live query evaluations run with an optimized, real-time response latency of **under 10 milliseconds**.

## 🔒 Security Policy
All proprietary environment tokens, private database strings, and structural API gateway keys have been safely omitted from public version control.
