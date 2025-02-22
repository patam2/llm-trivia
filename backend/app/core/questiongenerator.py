from anthropic import AsyncAnthropic
from ..core.settings import get_settings
import json


settings = get_settings()

class ClaudeGenerator:
    def __init__(self):
        self.client = AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)

    async def generate_question(self, topic: str, n: int, difficulty: str, past_questions: list) -> str:
        prompt = f"""Generate {n} different trivia questions about {topic} with {difficulty} difficulty. 
        Return them in this exact JSON format:
        {{"questions": [
            {{
                "question": "the question text",
                "options": ["option1", "option2", "option3", "option4"],
                "correct_answer": "the correct option",
                "difficulty": "{difficulty}",
                "explanation": "brief explanation of the answer"
            }},
            // ... more questions up to n
        ]}}

        Past questions that should not be repeated:
        {'\n'.join(past_questions)}

        Requirements:
        - Questions should be engaging and clear
        - All options should be plausible
        - Correct answers should be placed randomly among options
        - Explanations should be concise but informative
        - Each question should be unique and not repeated
        - Questions should cover different aspects of {topic}
        - Avoid using same keywords or themes from previous questions
        - Make sure the JSON array is properly formatted with commas between objects"""

        response = await self.client.messages.create(
            model="claude-3-haiku-20240307",
            max_tokens=1000,  # Adjust based on number of questions
            temperature=0.7,
            system="You are a trivia question generator focused on accuracy and engagement. Return your answer only in resolvable JSON, do not provide any other messages",
            messages=[{
                "role": "user",
                "content": prompt
            }]
        )

        try:
            questions = response.content
            print(questions[0].text)
            json_content = json.loads(questions[0].text)
            return json_content
        except json.JSONDecodeError:
            return []

