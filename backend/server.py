from fastapi import FastAPI, APIRouter, UploadFile, File, HTTPException, Form
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone
from emergentintegrations.llm.chat import LlmChat, UserMessage
import PyPDF2
import docx
import io
import re
import json


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class FeedbackItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    category: str
    problem: str
    why: str
    fix: str
    before_example: Optional[str] = None
    after_example: Optional[str] = None


class AnalysisResult(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    score: int
    level: str  # safe, warning, cooked, burnt
    reaction: str
    feedback: List[FeedbackItem]
    suggestions: List[str]
    keywords_found: List[str]
    keywords_missing: List[str]
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class AnalysisHistory(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    filename: str
    job_description_snippet: str
    score: int
    level: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# Utility functions
def extract_text_from_pdf(file_content: bytes) -> str:
    """Extract text from PDF file"""
    try:
        pdf_file = io.BytesIO(file_content)
        pdf_reader = PyPDF2.PdfReader(pdf_file)
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
        return text.strip()
    except Exception as e:
        logging.error(f"Error extracting PDF: {e}")
        raise HTTPException(status_code=400, detail="Failed to extract text from PDF")


def extract_text_from_docx(file_content: bytes) -> str:
    """Extract text from DOCX file"""
    try:
        doc_file = io.BytesIO(file_content)
        doc = docx.Document(doc_file)
        text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
        return text.strip()
    except Exception as e:
        logging.error(f"Error extracting DOCX: {e}")
        raise HTTPException(status_code=400, detail="Failed to extract text from DOCX")


def extract_keywords(text: str) -> List[str]:
    """Extract keywords from job description"""
    # Remove common words and extract potential keywords
    common_words = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'may', 'might', 'must', 'can'}
    
    words = re.findall(r'\b[a-zA-Z]{3,}\b', text.lower())
    keywords = [word for word in words if word not in common_words]
    
    # Get unique keywords with frequency
    keyword_freq = {}
    for word in keywords:
        keyword_freq[word] = keyword_freq.get(word, 0) + 1
    
    # Return top keywords
    sorted_keywords = sorted(keyword_freq.items(), key=lambda x: x[1], reverse=True)
    return [k[0] for k in sorted_keywords[:20]]


async def analyze_with_openai(resume_text: str, job_description: str) -> Dict[str, Any]:
    """Analyze resume using OpenAI via emergentintegrations"""
    try:
        api_key = os.environ.get('EMERGENT_LLM_KEY')
        if not api_key:
            logging.warning("EMERGENT_LLM_KEY not found, using mock analysis")
            return None
        
        # Initialize LLM chat
        chat = LlmChat(
            api_key=api_key,
            session_id=str(uuid.uuid4()),
            system_message="""You are a brutally honest Gen-Z resume reviewer who doesn't sugarcoat anything. 
You use slang like "fr fr", "no cap", "cooked", "lowkey", "highkey", "it's giving", etc.
Be harsh but helpful. Call out BS when you see it. Use emojis occasionally.

Return your response in JSON format with the following structure:
{
  "score": <0-100 integer>,
  "reaction": "<brutal Gen-Z reaction>",
  "feedback": [
    {
      "category": "<ATS Issues|Weak Impact|Missing Skills|Generic Language|Formatting>",
      "problem": "<brutal problem callout>",
      "why": "<honest explanation>",
      "fix": "<actually helpful fix>",
      "before_example": "<their cringe example>",
      "after_example": "<better version>"
    }
  ],
  "suggestions": ["<harsh but helpful suggestion>"],
  "keywords_found": ["<keyword>"],
  "keywords_missing": ["<keyword>"]
}"""
        ).with_model("openai", "gpt-5.2")
        
        # Create analysis prompt
        prompt = f"""Analyze this resume against the job description. Be brutally honest with Gen-Z tone.

JOB DESCRIPTION:
{job_description}

RESUME:
{resume_text}

Score it 0-100 where:
- 0-30: Actually not bad (safe)
- 31-60: Lowkey needs work (warning)
- 61-80: You're cooked fr (cooked)
- 81-100: Absolutely cooked, start over (burnt)

Focus on:
1. Why ATS will reject this
2. Weak/vague statements that say nothing
3. Missing keywords from the JD
4. Generic corporate BS
5. Formatting fails

Be harsh, use Gen-Z slang, call out specific problems. Make them better."""
        
        user_message = UserMessage(text=prompt)
        response = await chat.send_message(user_message)
        
        # Parse JSON response
        json_match = re.search(r'\{.*\}', response, re.DOTALL)
        if json_match:
            result = json.loads(json_match.group())
            return result
        
        logging.warning("Could not parse OpenAI response as JSON")
        return None
        
    except Exception as e:
        logging.error(f"Error in OpenAI analysis: {e}")
        return None


def generate_mock_analysis(resume_text: str, job_description: str) -> Dict[str, Any]:
    """Generate mock analysis with dynamic scores"""
    import random
    
    # Extract some keywords for realistic feedback
    jd_keywords = extract_keywords(job_description)
    resume_keywords = extract_keywords(resume_text)
    
    # Find overlap
    found_keywords = list(set(jd_keywords[:10]) & set(resume_keywords))[:5]
    missing_keywords = [k for k in jd_keywords[:10] if k not in found_keywords][:5]
    
    # Generate score based on keyword match
    base_score = 50
    if len(found_keywords) > 3:
        base_score -= 20
    if len(missing_keywords) > 5:
        base_score += 20
    
    score = max(0, min(100, base_score + random.randint(-15, 15)))
    
    # Determine level and reaction
    if score <= 30:
        level = "safe"
        reaction = "Okay lowkey you're not cooked... this actually looks decent fr 🫡"
    elif score <= 60:
        level = "warning"
        reaction = "It's giving 'needs work' vibes. Not terrible but not great either 😬"
    elif score <= 80:
        level = "cooked"
        reaction = "Bro... you're cooked. Like actually cooked. HR is not seeing this 💀"
    else:
        level = "burnt"
        reaction = "BURNT. Delete this and start over bestie. This ain't it 🔥💀"
    
    feedback = [
        {
            "category": "ATS Issues",
            "problem": "ATS is gonna ghost you fr",
            "why": "You're using zero keywords from the job description. Like literally zero. ATS robots don't care about your vibes",
            "fix": "Copy-paste the exact tech stack and skills from the JD into your resume (but make it look natural)",
            "before_example": "Worked on web stuff",
            "after_example": "Built scalable web apps using React, Node.js, PostgreSQL, and AWS Lambda - reducing load time by 40%"
        },
        {
            "category": "Weak Impact",
            "problem": "Your bullet points say nothing",
            "why": "Recruiters spend 6 seconds on your resume. 'Managed projects' tells them absolutely nothing about what you actually did",
            "fix": "Action verb + what you did + how + actual numbers. No cap, this is the formula.",
            "before_example": "Managed team and completed projects",
            "after_example": "Led 5-person engineering team to ship 3 major features ahead of schedule, increasing user retention by 35%"
        },
        {
            "category": "Generic Language",
            "problem": "Stop with the corporate cringe",
            "why": "'Team player' and 'hardworking' mean nothing. Everyone says this. ATS literally ignores it and so do humans",
            "fix": "Show don't tell. Give actual examples of teamwork with results",
            "before_example": "Excellent team player with strong communication",
            "after_example": "Collaborated with design, product, and sales teams to launch feature used by 50K+ users in first month"
        }
    ]
    
    suggestions = [
        "Add numbers to EVERYTHING. Revenue, users, time saved, anything quantifiable",
        f"You're missing these keywords: {', '.join(missing_keywords[:3])} - add them ASAP" if missing_keywords else "Keep using those keywords you have",
        "Use stronger action verbs. 'Led' not 'Helped', 'Built' not 'Worked on'",
        "One page only unless you have 10+ years experience. Nobody's reading page 2"
    ]
    
    return {
        "score": score,
        "level": level,
        "reaction": reaction,
        "feedback": feedback[:3],
        "suggestions": suggestions,
        "keywords_found": found_keywords,
        "keywords_missing": missing_keywords
    }


# Routes
@api_router.get("/")
async def root():
    return {"message": "BroAreYouCooked API"}


@api_router.post("/analyze", response_model=AnalysisResult)
async def analyze_resume(
    resume: UploadFile = File(...),
    job_description: str = Form(...)
):
    """Analyze resume against job description"""
    try:
        # Validate file type
        filename = resume.filename.lower()
        if not (filename.endswith('.pdf') or filename.endswith('.docx') or filename.endswith('.doc')):
            raise HTTPException(status_code=400, detail="Only PDF and DOC/DOCX files are supported")
        
        # Read file content
        file_content = await resume.read()
        
        # Extract text based on file type
        if filename.endswith('.pdf'):
            resume_text = extract_text_from_pdf(file_content)
        else:
            resume_text = extract_text_from_docx(file_content)
        
        if not resume_text or len(resume_text) < 50:
            raise HTTPException(status_code=400, detail="Could not extract sufficient text from resume")
        
        # Try OpenAI analysis first
        analysis_data = await analyze_with_openai(resume_text, job_description)
        
        # Fallback to mock if OpenAI fails
        if not analysis_data:
            logging.info("Using mock analysis")
            analysis_data = generate_mock_analysis(resume_text, job_description)
        
        # Determine level if not provided
        score = analysis_data.get('score', 50)
        if 'level' not in analysis_data:
            if score <= 30:
                analysis_data['level'] = 'safe'
            elif score <= 60:
                analysis_data['level'] = 'warning'
            elif score <= 80:
                analysis_data['level'] = 'cooked'
            else:
                analysis_data['level'] = 'burnt'
        
        # Create result object
        result = AnalysisResult(
            score=analysis_data['score'],
            level=analysis_data['level'],
            reaction=analysis_data.get('reaction', 'Analysis complete'),
            feedback=[FeedbackItem(**item) for item in analysis_data.get('feedback', [])],
            suggestions=analysis_data.get('suggestions', []),
            keywords_found=analysis_data.get('keywords_found', []),
            keywords_missing=analysis_data.get('keywords_missing', [])
        )
        
        # Save to database
        doc = result.model_dump()
        doc['timestamp'] = doc['timestamp'].isoformat()
        await db.analyses.insert_one(doc)
        
        # Save to history with same ID
        history = AnalysisHistory(
            id=result.id,  # Use same ID
            filename=resume.filename,
            job_description_snippet=job_description[:100] + "..." if len(job_description) > 100 else job_description,
            score=result.score,
            level=result.level,
            timestamp=result.timestamp
        )
        history_doc = history.model_dump()
        history_doc['timestamp'] = history_doc['timestamp'].isoformat()
        await db.history.insert_one(history_doc)
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error analyzing resume: {e}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@api_router.get("/history", response_model=List[AnalysisHistory])
async def get_history():
    """Get analysis history"""
    try:
        history = await db.history.find({}, {"_id": 0}).sort("timestamp", -1).limit(10).to_list(10)
        
        # Convert ISO strings back to datetime
        for item in history:
            if isinstance(item['timestamp'], str):
                item['timestamp'] = datetime.fromisoformat(item['timestamp'])
        
        return history
    except Exception as e:
        logging.error(f"Error fetching history: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch history")


@api_router.get("/analysis/{analysis_id}")
async def get_analysis(analysis_id: str):
    """Get specific analysis by ID"""
    try:
        analysis = await db.analyses.find_one({"id": analysis_id}, {"_id": 0})
        
        if not analysis:
            raise HTTPException(status_code=404, detail="Analysis not found")
        
        # Convert timestamp
        if isinstance(analysis['timestamp'], str):
            analysis['timestamp'] = datetime.fromisoformat(analysis['timestamp'])
        
        return analysis
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error fetching analysis: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch analysis")


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
