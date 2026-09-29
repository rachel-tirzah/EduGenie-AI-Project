import os
from google import genai


def recommend_learning_path(topic: str) -> str:
    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        return "Gemini API key is not configured yet."

    try:
        client = genai.Client(api_key=api_key)

        prompt = f"""
Create a simple personalized learning path for a student who wants to learn:

{topic}

Give:
1. Beginner topics
2. Intermediate topics
3. Advanced topics
4. Practice suggestions

Keep it simple and student-friendly.
"""

        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt
        )

        return response.text

    except Exception as e:
        return f"Error: {str(e)}"