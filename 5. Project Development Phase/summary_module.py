import os
from google import genai


def summarize_text(text: str) -> str:
    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        return "Gemini API key is not configured yet."

    try:
        client = genai.Client(api_key=api_key)

        prompt = f"""
Summarize the following educational text in simple language.
Keep the important points and make the summary easy for a student to understand.

Text:
{text}
"""

        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt
        )

        return response.text

    except Exception as e:
        return f"Error: {str(e)}"