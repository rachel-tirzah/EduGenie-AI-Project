import os
from google import genai


def explain_topic(topic: str) -> str:
    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        return "Gemini API key is not configured yet."

    try:
        client = genai.Client(api_key=api_key)

        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=(
                f"Explain the following topic to a student in simple language. "
                f"Give a clear explanation and a simple example:\n\n{topic}"
            )
        )

        return response.text

    except Exception as e:
        return f"Error: {str(e)}"