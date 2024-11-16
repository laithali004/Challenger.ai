from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()
api_key_openai = os.getenv("OPEN_AI_KEY")

game = input()
client = OpenAI(api_key=api_key_openai)
completion = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {
            "role": "user",
            "content": 
            f"""
                I am someone who is WAYYY too good at {game}. I want a challenging way to play the game so that I can have fun again.
                What are some challenges I could do? Pick ONE that you think would be really hard. Keep it to 10 words.
                If it is a game that involves shooting, do not suggest not using a weapon.
            """
        }
    ]
)

print(completion.choices[0].message.content)
