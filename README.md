# BroAreYouCooked - Resume ATS Score Checker

A premium resume analysis tool that uses AI to evaluate how well your resume matches job descriptions. Features a clinical "thermal brutalist" design aesthetic with brutal honesty and zero fluff.

## 🔥 Core Features

### Resume Analysis
- **PDF & DOC Support**: Upload resumes in PDF, DOC, or DOCX format
- **AI-Powered Analysis**: Uses OpenAI GPT-5.2 via Emergent LLM integration
- **ATS Compatibility Scoring**: Get a 0-100 score indicating how "cooked" your resume is
- **Smart Fallback**: Automatically uses mock analysis if API is unavailable
- **Keyword Matching**: Identifies found and missing keywords from job descriptions

### Detailed Feedback
- **Categorized Issues**: Organized by ATS Issues, Weak Impact, Missing Skills, Generic Language, and Formatting
- **Problem-Why-Fix Format**: Each issue explained with context and actionable fixes
- **Before/After Examples**: Visual examples showing how to improve specific issues
- **Action Items**: Clear, prioritized suggestions for improvement

### Results Dashboard
- **Dramatic Score Reveal**: Netflix/Spotify Wrapped-style animated score display
- **Color-Coded Levels**:
  - 🟢 0-30: Safe (good match)
  - 🟡 31-60: Warning (needs improvement)  
  - 🔴 61-80: Cooked (significant issues)
  - 🔴 81-100: Burnt (major problems)
- **Keyword Analysis**: Shows which keywords were found and which are missing
- **Downloadable Results**: Export your results as an image

### Analysis History
- **MongoDB Storage**: All analyses saved to database
- **History Tracking**: View past analyses with timestamps
- **Retrieval by ID**: Get specific analysis results anytime

## 🎨 Design System

### The Thermal Brutalist
- **Dark Theme**: Deep black (#050505) base with high contrast
- **Signal Colors**: Red (#FF3B30) for danger, Green (#30D158) for safe
- **Typography**: Azeret Mono for headings/data, Manrope for body text
- **Sharp Edges**: Minimal border radius for technical feel
- **Noise Texture**: Subtle overlay for depth
- **Grid System**: Technical grid overlay
- **Clinical Aesthetic**: Diagnostic tool feel with precision focus

## 🚀 Technology Stack

### Backend
- **FastAPI**: High-performance Python web framework
- **MongoDB**: Document database for storing analyses
- **OpenAI GPT-5.2**: Via emergentintegrations library
- **PyPDF2**: PDF text extraction
- **python-docx**: DOC/DOCX text extraction
- **Motor**: Async MongoDB driver

### Frontend
- **React 19**: Latest React with modern hooks
- **Framer Motion**: Premium animations and transitions
- **TailwindCSS**: Utility-first styling
- **Lucide React**: Icon system
- **html2canvas**: Results export functionality
- **Axios**: HTTP client

## 📦 Installation & Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- MongoDB running locally
- Emergent LLM key (provided)

### Backend Setup
```bash
cd /app/backend
pip install -r requirements.txt
```

### Frontend Setup
```bash
cd /app/frontend
yarn install
```

### Environment Variables

**Backend (.env)**:
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=test_database
CORS_ORIGINS=*
EMERGENT_LLM_KEY=sk-emergent-9Cc2a0a9d17Ee2b8f7
```

**Frontend (.env)**:
```
REACT_APP_BACKEND_URL=<your-backend-url>
```

## 🔌 API Endpoints

### POST /api/analyze
Upload resume and job description for analysis.
- **Body**: multipart/form-data
  - `resume`: File (PDF/DOC/DOCX)
  - `job_description`: Text
- **Response**: AnalysisResult object

### GET /api/history
Get recent analysis history (last 10).
- **Response**: Array of AnalysisHistory objects

### GET /api/analysis/{id}
Retrieve specific analysis by ID.
- **Response**: AnalysisResult object

## 🎯 Usage Flow

1. **Landing Page**: User clicks "RUN DIAGNOSTIC"
2. **Upload Resume**: Drag & drop or click to upload PDF/DOC
3. **Add Job Description**: Paste the complete job description
4. **Analyze**: Click "RUN ANALYSIS" button
5. **Loading State**: Animated loading with rotating messages
6. **Results**: Dramatic score reveal with detailed feedback
7. **Download**: Export results as shareable image

## 🔧 Advanced Features

### OpenAI Integration
- Uses emergentintegrations library for unified LLM access
- Automatic retry logic with exponential backoff
- Graceful fallback to mock data if API unavailable
- Session-based chat management
- JSON response parsing with error handling

### Mock Analysis
When OpenAI is unavailable, the system generates:
- Dynamic scores based on keyword overlap
- Realistic feedback with common resume issues
- Keyword analysis using NLP techniques
- Actionable suggestions

### File Processing
- **PDF**: PyPDF2 extracts text from all pages
- **DOC/DOCX**: python-docx parses document structure
- **Validation**: File type and size checking
- **Error Handling**: Clear error messages for invalid files

## 🎨 Animation Details

### Framer Motion Animations
- **Landing Hero**: Staggered fade-in with slide-up
- **Score Counter**: Animated count from 0 to final score
- **Loading Messages**: Rotating messages with fade transitions
- **Feedback Cards**: Staggered entrance with slide effects
- **Hover States**: Scale and glow effects on interactive elements
- **Color Transitions**: Smooth animated color changes based on score

## 📊 MongoDB Schema

### analyses Collection
```javascript
{
  id: String,
  score: Number,
  level: String,
  reaction: String,
  feedback: Array<FeedbackItem>,
  suggestions: Array<String>,
  keywords_found: Array<String>,
  keywords_missing: Array<String>,
  timestamp: ISODate
}
```

### history Collection
```javascript
{
  id: String,
  filename: String,
  job_description_snippet: String,
  score: Number,
  level: String,
  timestamp: ISODate
}
```

## 🔐 Security

- No API keys stored in frontend
- Multipart form data for secure file upload
- MongoDB ObjectId exclusion in queries
- CORS configured for specific origins
- File type validation
- Size limits on uploads

## 🚀 Performance

- Async/await throughout backend
- Hot reload enabled for development
- Optimized animations for mobile
- Lazy loading of components
- Efficient MongoDB queries with projections
- Image optimization for backgrounds

## 📱 Mobile Responsive

- Mobile-first design approach
- Touch-friendly upload area
- Optimized typography scaling
- Stacked layouts for small screens
- Comfortable tap targets
- Smooth animations on mobile

## 🎓 Future Enhancements

1. **Resume Comparison**: Compare multiple versions
2. **Export as PDF**: Generate PDF reports
3. **Email Results**: Send analysis via email
4. **Template Suggestions**: Recommend resume templates
5. **Skill Gap Analysis**: Detailed skill matching
6. **Industry-Specific Analysis**: Tailored feedback by industry
7. **ATS Simulator**: Show exactly how ATS systems parse
8. **Collaborative Reviews**: Share with mentors
9. **Version History**: Track improvements over time
10. **AI Resume Builder**: Generate optimized resumes

## 🐛 Testing

Backend tests located in `/app/backend_test.py`

Run tests:
```bash
cd /app/backend
pytest backend_test.py -v
```

## 📝 License

Built with Emergent AI Platform

## 👥 Credits

- Design System: Thermal Brutalist aesthetic
- AI Integration: OpenAI GPT-5.2 via emergentintegrations
- Icons: Lucide React
- Fonts: Google Fonts (Azeret Mono, Manrope)

---

Built for the rejected. Powered by AI.
