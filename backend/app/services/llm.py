import time
from groq import Groq
from app.config import settings

client = Groq(api_key=settings.GROQ_API_KEY)


def stream_response(prompt: str):

    stream = client.chat.completions.create(
        model=settings.MODEL_NAME,
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        stream=True
    )

    for chunk in stream:

        content = chunk.choices[0].delta.content

        if content:
            yield content
            time.sleep(0.02)