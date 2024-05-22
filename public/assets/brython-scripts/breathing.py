from browser import document, html, timer
import javascript
from math import sin, pi

canvas = document["myCanvas"]
context = canvas.getContext("2d")

SCREEN_WIDTH = 1280
SCREEN_HEIGHT = 720
BG_IMAGE = "../../assets/background.jpg"
TITLE_IMAGE = "../../assets/title.png"
PLAY_IMAGE = "../../assets/play.png"
TIMER_IMAGE = "../../assets/timer.png"
INHALE_SOUND = "../../assets/inhale.mp3"
EXHALE_SOUND = "../../assets/exhale.mp3"

countdown = 180  # Default countdown for the exercise
fps = 60
is_animating = False

# Cache for loaded images
image_cache = {}

class Button:
    def __init__(self, x, y, image_path, scale):
        self.image_path = image_path
        self.image = load_image(image_path)
        self.scale = scale
        self.x = x
        self.y = y
        self.width = self.image.width * scale
        self.height = self.image.height * scale
        self.clicked = False
        self.image.bind("load", self.set_dimensions)

    def set_dimensions(self, event):
        self.width = self.image.width * self.scale
        self.height = self.image.height * self.scale

    def click(self, event):
        self.clicked = True

def load_image(path):
    if path not in image_cache:
        img = html.IMG(src=path)
        img.style.display = "none"
        img.bind("load", lambda e: img.loaded(True))
        img.loaded = lambda: False
        image_cache[path] = img
    return image_cache[path]

def draw_image(context, img, x, y, width, height):
    if img.loaded():
        context.drawImage(img, x, y, width, height)

def main_menu():
    document["myCanvas"].clear()
    context.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)
    bg_img = load_image(BG_IMAGE)
    title_img = load_image(TITLE_IMAGE)
    draw_image(context, bg_img, 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)
    draw_image(context, title_img, SCREEN_WIDTH // 2 - 320, 100, 640, 200)

    play_button = Button(280, 225, PLAY_IMAGE, 0.5)
    timer_button = Button(720, 225, TIMER_IMAGE, 0.5)

    def check_buttons():
        if play_button.clicked:
            if not is_animating:
                play()
                
        elif timer_button.clicked:
            timer_menu()

    timer.set_interval(check_buttons, 1000 // fps)

def play():
    global countdown
    global is_animating
    if is_animating:
        return
    is_animating = True
    document["myCanvas"].clear()
    context.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)
    radius = 100
    radius_change = 1.5
    colour = "#D699FF"
    delay = 2500
    hold_time = javascript.Date.new().getTime()  # current time in milliseconds
    holding = False
    text = "Inhale"
    inhale = html.AUDIO(src=INHALE_SOUND)
    exhale = html.AUDIO(src=EXHALE_SOUND)
    inhale.play()

    def animate():
        nonlocal radius, radius_change, colour, holding, hold_time, text
        context.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)
        bg_img = load_image(BG_IMAGE)
        draw_image(context, bg_img, 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)

        context.beginPath()
        context.arc(SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2, radius, 0, 2 * pi)
        context.fillStyle = colour
        context.fill()

        current_time = javascript.Date.new().getTime()

        if not holding:
            radius += radius_change
            if radius <= 99 or radius >= 301:
                radius_change = -radius_change
                if radius_change < 0:
                    radius_change = -1
                else:
                    radius_change = 1.5
                if colour == "#D699FF":
                    colour = "#7CA8FF"
                else:
                    colour = "#D699FF"
                hold_time = javascript.Date.new().getTime()
                holding = True
        else:
            if current_time - hold_time >= delay:
                holding = False

        if holding:
            text = "Rest"
        else:
            if radius >= 301:
                text = "Exhale"
                exhale.play()
            elif radius <= 99:
                text = "Inhale"
                inhale.play()

        context.fillStyle = "#FFFFFF"
        context.font = "80px sans-serif"
        context.fillText(text, SCREEN_WIDTH // 2 - 100, SCREEN_HEIGHT // 2 + 20)

    timer.set_interval(animate, 1000 // fps)

def timer_menu():
    global countdown
    document["myCanvas"].clear()
    context.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)
    context.fillStyle = "#D699FF"
    context.fillRect(50, 50, 1180, 620)
    context.strokeStyle = "#7C00FF"
    context.lineWidth = 10
    context.strokeRect(40, 40, 1200, 640)

    increase_button = Button(SCREEN_WIDTH // 2 - 50, SCREEN_HEIGHT // 2 - 175, "../../public/assets/increase.png", 1)
    decrease_button = Button(SCREEN_WIDTH // 2 - 50, SCREEN_HEIGHT // 2 + 75, "../../public/assets/decrease.png", 1)
    exit_button = Button(1110, 60, "../../public/assets/x.png", 1)

    def update_timer():
        global countdown
        if increase_button.clicked and countdown < 1800:
            countdown += 60
        if decrease_button.clicked and countdown > 60:
            countdown -= 60
        if exit_button.clicked:
            main_menu()

        context.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)
        context.fillStyle = "#D699FF"
        context.fillRect(50, 50, 1180, 620)
        context.strokeStyle = "#7C00FF"
        context.lineWidth = 10
        context.strokeRect(40, 40, 1200, 640)

        minutes = countdown // 60
        seconds = countdown % 60
        time_text = f"{minutes:02}:{seconds:02}"
        context.fillStyle = "#FFFFFF"
        context.font = "150px sans-serif"
        context.fillText(time_text, SCREEN_WIDTH // 2 - 150, SCREEN_HEIGHT // 2 + 50)

        context.font = "80px sans-serif"
        context.fillText("Timer", SCREEN_WIDTH // 2 - 100, 115)

    timer.set_interval(update_timer, 1000 // fps)

main_menu()

