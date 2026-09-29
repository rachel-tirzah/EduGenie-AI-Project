import os
from google import genai


def answer_question(question: str) -> str:
    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        return "Gemini API key is not configured yet."

    try:
        client = genai.Client(api_key=api_key)

        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=f"Answer this educational question clearly and simply:\n\n{question}"
        )

        return response.text

    except Exception as e:
        return f"Error: {str(e)}"