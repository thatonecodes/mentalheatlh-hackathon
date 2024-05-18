from browser import document, html, alert
import random

class StressQuestionnaireApp:
    def __init__(self):
        self.questions = [
            "How frequently do you feel overwhelmed by your responsibilities?",
            "How often do you have trouble relaxing or calming your mind?",
            "On average, how irritable or easily frustrated do you feel?",
            "How often do you have difficulty sleeping or feel tired even after a full night's sleep?",
            "How challenging is it for you to concentrate or focus on tasks?",
            "How frequently do you experience physical symptoms like headaches or muscle tension?",
            "On average, how anxious or worried do you feel?",
            "How often do you find yourself procrastinating or avoiding tasks?",
            "To what extent do you feel a lack of control over your life or circumstances?",
            "How frequently do you feel isolated or disconnected from others?",
            "How often do you have difficulty making decisions or feel indecisive?",
            "How much do you experience a sense of dread or fear about the future?",
            "How often do you experience changes in appetite or eating habits?",
            "To what extent do you feel unmotivated or have a lack of interest in activities you used to enjoy?",
            "How frequently do you find yourself rushing or feeling pressed for time?"
        ]
        self.responses = []
        self.stress_tips = [
            {
                "tip": "Practice Mindfulness and Meditation",
                "example": "Spend a few minutes each day practicing mindfulness or meditation. Focus on your breathing, observe your thoughts without judgment, and bring your attention back to the present moment. Try guided meditation apps like Headspace or Calm."
            },
            {
                "tip": "Exercise Regularly",
                "example": "Engage in regular physical activity, such as walking, running, yoga, or any form of exercise you enjoy. Aim for at least 30 minutes of moderate exercise most days of the week."
            },
            {
                "tip": "Prioritize Sleep",
                "example": "Establish a regular sleep schedule and aim for 7-9 hours of sleep per night. Create a relaxing bedtime routine to improve sleep quality. Avoid screens an hour before bed and try reading a book instead."
            },
            {
                "tip": "Healthy Eating",
                "example": "Maintain a balanced diet rich in fruits, vegetables, whole grains, and lean proteins. Avoid excessive caffeine and sugar. Prepare healthy snacks like nuts, fruits, or yogurt to keep your energy levels stable."
            },
            {
                "tip": "Stay Connected",
                "example": "Maintain social connections with friends and family. Talk to someone you trust about your feelings and concerns. Schedule regular catch-ups with loved ones, even if it’s just a quick phone call."
            },
            {
                "tip": "Manage Time Effectively",
                "example": "Prioritize tasks and break them down into manageable steps. Use tools like to-do lists, planners, or digital apps to stay organized. Try the Pomodoro Technique—work for 25 minutes, then take a 5-minute break."
            },
            {
                "tip": "Relaxation Techniques",
                "example": "Practice relaxation techniques such as deep breathing exercises, progressive muscle relaxation, or aromatherapy. Inhale deeply for four counts, hold for four counts, and exhale for four counts. Repeat this cycle several times."
            },
            {
                "tip": "Set Boundaries",
                "example": "Learn to say no to additional responsibilities that may overwhelm you. Set clear boundaries to protect your time and energy. Politely decline extra work tasks when your plate is already full."
            },
            {
                "tip": "Engage in Hobbies",
                "example": "Spend time on activities and hobbies you enjoy. Engaging in creative or recreational activities can be a great stress reliever. Take up a new hobby like painting, gardening, or playing a musical instrument."
            },
            {
                "tip": "Seek Professional Help",
                "example": "If stress becomes overwhelming, consider seeking help from a mental health professional, such as a therapist or counselor. Look for licensed professionals through resources like Psychology Today or local mental health clinics."
            },
            {
                "tip": "Stay Hydrated",
                "example": "Drink plenty of water throughout the day to stay hydrated and support overall health. Carry a water bottle with you and set reminders to drink water."
            },
            {
                "tip": "Limit Alcohol and Tobacco",
                "example": "Reduce or eliminate the use of alcohol and tobacco, as they can increase stress levels and negatively impact health. Find healthier ways to cope with stress, such as exercise or meditation."
            },
            {
                "tip": "Laugh and Have Fun",
                "example": "Find time for laughter and fun. Watch a comedy show, play a fun game, or engage in activities that make you laugh. Join a laughter yoga class or watch funny videos online."
            },
            {
                "tip": "Practice Gratitude",
                "example": "Focus on positive aspects of your life and practice gratitude. Keep a journal where you write down things you are thankful for. Each night, write down three things you are grateful for that day."
            },
            {
                "tip": "Take Breaks",
                "example": "Take regular breaks during work or study to rest and recharge. Avoid long periods of continuous work. Stand up, stretch, and walk around for a few minutes every hour."
            }
        ]
        self.question_index = 0

        self.label = document["question"]
        self.radio_buttons_container = document["radio-buttons"]
        self.next_button = document["next-button"]

        self.update_question()

    def update_question(self):
        self.label.text = self.questions[self.question_index]
        self.radio_buttons_container.clear()
        for i in range(1, 6):
            radio_button = html.INPUT(type="radio", name="response", value=i)
            radio_button.bind("change", self.enable_next_button)
            label = html.LABEL(f"{i}")
            self.radio_buttons_container <= radio_button
            self.radio_buttons_container <= label
            self.radio_buttons_container <= html.BR()
        self.next_button.disabled = True

    def enable_next_button(self, event):
        self.next_button.disabled = False

    def next_question(self):
        response = int(document.querySelector('input[name="response"]:checked').value)
        self.responses.append(response)
        self.question_index += 1
        if self.question_index < len(self.questions):
            self.update_question()
            if self.question_index == len(self.questions) - 1:
                self.next_button.text = "Submit"
        else:
            self.submit_responses()

    def submit_responses(self):
        stress_level = self.calculate_stress_level(self.responses)
        alert(f"Your stress level is: {stress_level}")

        if stress_level != "Low stress":
            tip = random.choice(self.stress_tips)
            alert(f"Tip: {tip['tip']}\n\nTo do this: {tip['example']}")
        else:
            alert("Congratulations, Keep up the good work!")

    def calculate_stress_level(self, responses):
        total_score = sum(responses)
        if total_score <= 15:
            return "Low stress"
        elif 16 <= total_score <= 30:
            return "Moderate stress"
        elif 31 <= total_score <= 45:
            return "High stress"
        else:
            return "Very high stress"


app = StressQuestionnaireApp()

def next_question():
    app.next_question()
# Bind the function to the button
document["next-button"].bind("click", lambda evt: next_question())
