# BroAreYouCooked - Resume ATS Score Checker

Your resume is probably mid. Let's check the damage. No cap, this AI will roast you harder than ATS will.

## 🔥 What This Does

### Resume Analysis (But Make It Brutal)
- **PDF & DOC Support**: Upload whatever format, we'll read it
- **AI That Doesn't Lie**: OpenAI GPT-5.2 via Emergent LLM key gives you the harsh truth
- **The Cooked Score**: 0-100 score that tells you how screwed you are
- **Smart Fallback**: Even works when the API is down (with mock roasts)
- **Keyword Reality Check**: Shows what ATS will actually see vs what you wrote

### The Damage Report
- **Brutally Honest Feedback**: Organized by how badly you messed up (ATS Issues, Weak Impact, Missing Skills, etc.)
- **Problem-Why-Fix Format**: Each roast comes with context and how to actually fix it
- **Before/After Examples**: Shows your cringe vs what it should be
- **Action Items**: Clear steps to stop getting ghosted

### Results That Slap Different
- **Dramatic Score Reveal**: Netflix-style animation that builds suspense before crushing your dreams
- **Color-Coded Reality**:
  - 🟢 0-30: Actually not bad (rare)
  - 🟡 31-60: Lowkey needs work
  - 🔴 61-80: You're cooked fr
  - 🔴 81-100: Delete and start over
- **Keyword Analysis**: Exactly what you're missing vs what you have
- **Share Your L**: Download and share your cooked score

### Extra Features
- **Your Past L's**: History of all the times we roasted your resume
- **Stop Getting Rejected**: Actual tips on how to not get ghosted by ATS
- **Real Stats**: Like how recruiters spend 6 seconds on your resume (yes really)

## 🎨 The Vibe

### Thermal Brutalist Design
- **Dark Mode Only**: Deep black (#050505) because light mode is for résumés
- **Signal Colors**: Red (#FF3B30) when you're cooked, Green (#30D158) when you're not
- **Typography**: Azeret Mono for the brutal truth, Manrope for explanations
- **Sharp Edges**: No rounded corners, this isn't Instagram
- **Noise Texture**: Subtle grunge for that authentic feel
- **Clinical Aesthetic**: Looks like a medical diagnosis (because it basically is)

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
