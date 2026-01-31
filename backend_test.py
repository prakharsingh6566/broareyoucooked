import requests
import sys
import os
from datetime import datetime
import json

class ResumeATSAPITester:
    def __init__(self, base_url="https://cooked-ats.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED")
        else:
            print(f"❌ {name} - FAILED: {details}")
        
        self.test_results.append({
            "test": name,
            "success": success,
            "details": details
        })

    def run_test(self, name, method, endpoint, expected_status, data=None, files=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {}
        
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=30)
            elif method == 'POST':
                if files:
                    response = requests.post(url, data=data, files=files, timeout=60)
                else:
                    headers['Content-Type'] = 'application/json'
                    response = requests.post(url, json=data, headers=headers, timeout=60)

            print(f"   Status: {response.status_code}")
            
            success = response.status_code == expected_status
            
            if success:
                self.log_test(name, True)
                try:
                    return True, response.json()
                except:
                    return True, response.text
            else:
                error_detail = f"Expected {expected_status}, got {response.status_code}"
                try:
                    error_detail += f" - {response.json()}"
                except:
                    error_detail += f" - {response.text[:200]}"
                self.log_test(name, False, error_detail)
                return False, {}

        except Exception as e:
            self.log_test(name, False, f"Request failed: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test root API endpoint"""
        return self.run_test(
            "Root API Endpoint",
            "GET",
            "api/",
            200
        )

    def test_analyze_endpoint_validation(self):
        """Test analyze endpoint validation (missing data)"""
        # Test missing file
        success, response = self.run_test(
            "Analyze Validation - Missing File",
            "POST",
            "api/analyze",
            422,  # FastAPI validation error
            data={"job_description": "Test job description"}
        )
        return success

    def test_analyze_endpoint_with_sample_data(self):
        """Test analyze endpoint with sample resume and job description"""
        # Create a sample text file to simulate resume
        sample_resume_content = """
John Doe
Software Engineer

EXPERIENCE:
- Developed web applications using React and Node.js
- Worked with databases and APIs
- Collaborated with cross-functional teams

SKILLS:
- JavaScript, Python, React, Node.js
- MongoDB, PostgreSQL
- Git, Docker, AWS

EDUCATION:
Bachelor of Computer Science
University of Technology
"""
        
        # Create a temporary file-like object
        files = {
            'resume': ('sample_resume.txt', sample_resume_content, 'text/plain')
        }
        
        data = {
            'job_description': """
We are looking for a Senior Software Engineer with experience in:
- React and modern JavaScript frameworks
- Node.js and backend development
- Database design and optimization
- Cloud platforms (AWS preferred)
- Agile development methodologies

Requirements:
- 3+ years of experience
- Strong problem-solving skills
- Experience with microservices
- Knowledge of DevOps practices
"""
        }

        success, response = self.run_test(
            "Analyze Resume with Sample Data",
            "POST",
            "api/analyze",
            200,
            data=data,
            files=files
        )
        
        if success and isinstance(response, dict):
            # Validate response structure
            required_fields = ['id', 'score', 'level', 'reaction', 'feedback', 'suggestions', 'keywords_found', 'keywords_missing']
            missing_fields = [field for field in required_fields if field not in response]
            
            if missing_fields:
                self.log_test("Analyze Response Structure", False, f"Missing fields: {missing_fields}")
                return False
            else:
                self.log_test("Analyze Response Structure", True)
                print(f"   Score: {response.get('score')}")
                print(f"   Level: {response.get('level')}")
                print(f"   Keywords Found: {len(response.get('keywords_found', []))}")
                print(f"   Keywords Missing: {len(response.get('keywords_missing', []))}")
                print(f"   Feedback Items: {len(response.get('feedback', []))}")
                return True, response
        
        return success, response

    def test_history_endpoint(self):
        """Test history endpoint"""
        return self.run_test(
            "Get Analysis History",
            "GET",
            "api/history",
            200
        )

    def test_specific_analysis_endpoint(self, analysis_id=None):
        """Test getting specific analysis by ID"""
        if not analysis_id:
            # Use a dummy ID to test 404 response
            analysis_id = "non-existent-id"
            expected_status = 404
            test_name = "Get Analysis - Not Found"
        else:
            expected_status = 200
            test_name = "Get Analysis - Valid ID"
            
        return self.run_test(
            test_name,
            "GET",
            f"api/analysis/{analysis_id}",
            expected_status
        )

    def test_file_type_validation(self):
        """Test file type validation with invalid file"""
        # Test with invalid file type
        files = {
            'resume': ('invalid.txt', 'This is not a valid resume file', 'text/plain')
        }
        
        data = {
            'job_description': 'Test job description'
        }

        return self.run_test(
            "File Type Validation - Invalid File",
            "POST",
            "api/analyze",
            400,
            data=data,
            files=files
        )

    def run_all_tests(self):
        """Run all backend tests"""
        print("=" * 60)
        print("🚀 STARTING RESUME ATS BACKEND API TESTS")
        print("=" * 60)
        
        # Test 1: Root endpoint
        self.test_root_endpoint()
        
        # Test 2: Validation tests
        self.test_analyze_endpoint_validation()
        
        # Test 3: File type validation
        self.test_file_type_validation()
        
        # Test 4: Full analysis test
        success, analysis_data = self.test_analyze_endpoint_with_sample_data()
        analysis_id = None
        if success and isinstance(analysis_data, dict):
            analysis_id = analysis_data.get('id')
        
        # Test 5: History endpoint
        self.test_history_endpoint()
        
        # Test 6: Specific analysis endpoint
        self.test_specific_analysis_endpoint()  # Test 404 case
        if analysis_id:
            self.test_specific_analysis_endpoint(analysis_id)  # Test valid case
        
        # Print summary
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        print(f"Tests Run: {self.tests_run}")
        print(f"Tests Passed: {self.tests_passed}")
        print(f"Tests Failed: {self.tests_run - self.tests_passed}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run)*100:.1f}%")
        
        # Print failed tests
        failed_tests = [test for test in self.test_results if not test['success']]
        if failed_tests:
            print("\n❌ FAILED TESTS:")
            for test in failed_tests:
                print(f"   - {test['test']}: {test['details']}")
        
        return self.tests_passed == self.tests_run

def main():
    """Main test execution"""
    tester = ResumeATSAPITester()
    
    try:
        success = tester.run_all_tests()
        return 0 if success else 1
    except Exception as e:
        print(f"\n💥 CRITICAL ERROR: {str(e)}")
        return 1

if __name__ == "__main__":
    sys.exit(main())