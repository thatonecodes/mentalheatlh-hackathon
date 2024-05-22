import pygame
pygame.init()

# Screen dimensions
SCREEN_WIDTH = 1280
SCREEN_HEIGHT = 720

# Create screen
screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
BG = pygame.image.load("assets/background.jpg")

# Font for text
font = pygame.font.SysFont('sans-serif', 80)
big_font = pygame.font.SysFont('sans-serif', 150)

# Default countdown for the exercise
countdown = 180

# Clock to control frame rate
clock = pygame.time.Clock()
fps = 60
          
# Load background music
pygame.mixer.music.load("assets/calming_music.mp3")
pygame.mixer.music.set_volume(0.25)
pygame.mixer.music.play(-1) 

class Button():
	def __init__(self, x, y, image, scale):
        # Initialize button properties
		width = image.get_width()
		height = image.get_height()
		self.image = pygame.transform.scale(image, (int(width * scale), int(height * scale)))
		self.rect = self.image.get_rect()
		self.rect.topleft = (x, y)
		self.clicked = False

	def draw(self, surface):
		action = False
		# Get mouse position
		pos = pygame.mouse.get_pos()

		# Check mouseover and clicked conditions
		if self.rect.collidepoint(pos):
			if pygame.mouse.get_pressed()[0] == 1 and self.clicked == False:
				self.clicked = True
				action = True

		if pygame.mouse.get_pressed()[0] == 0:
			self.clicked = False

		# Draw button on screen
		surface.blit(self.image, (self.rect.x, self.rect.y))
		return action

def main_menu():
    pygame.display.set_caption('Menu')
    run = True
    
    while run:
        screen.blit(BG, (0, 0))
        
        # Load in title
        TITLE_IMAGE = pygame.image.load("assets/title.png").convert_alpha()
        screen.blit(TITLE_IMAGE, (SCREEN_WIDTH // 2 - 320, 100))

        # Load in and create the play and timer buttons
        PLAY_IMAGE = pygame.image.load("assets/play.png").convert_alpha()
        PLAY_BUTTON = Button(280, 225, PLAY_IMAGE, 0.5)

        TIMER_IMAGE = pygame.image.load("assets/timer.png").convert_alpha()
        TIMER_BUTTON = Button(720, 225, TIMER_IMAGE, 0.5)

        if PLAY_BUTTON.draw(screen):
            play()
        if TIMER_BUTTON.draw(screen):
            timer()

        # Event handling
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                run = False

        pygame.display.flip()
        clock.tick(fps)

def play():
    global countdown

    pygame.display.set_caption('Play')
    run = True
    radius = 100 # Initial radius of the circle
    radius_change = 1.5 # How fast the radius changes
    colour = (214, 153, 255)
    delay = 2500  # Delay in milliseconds
    hold_time = 0  # Time when the radius reaches its limit
    holding = False  # Whether the circle is in holding state
    when_clicked = pygame.time.get_ticks()
    text = 'Inhale'
    inhale = pygame.mixer.Sound("assets/inhale.mp3")
    exhale = pygame.mixer.Sound("assets/exhale.mp3")

    pygame.mixer.Sound.play(inhale)

    # Create a surface for the outer circle
    circle_surface = pygame.Surface((1280, 720), pygame.SRCALPHA)
    
    while run:
        screen.blit(BG, (0, 0))

        # Clear the circle surface
        circle_surface.fill((0, 0, 0, 0))
        outer_circle = pygame.draw.circle(circle_surface, (255, 255, 255, 128), (640, 360), 300) # The outer, translucent circle
        circle = pygame.draw.circle(screen, colour, (640, 360), radius) # The growing/shrinking circle
        screen.blit(circle_surface, (0, 0))

        # Event handling
        for event in pygame.event.get():
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_ESCAPE:
                    main_menu()
            if event.type == pygame.QUIT:
                run = False   

        # Handle radius change with delay
        current_time = pygame.time.get_ticks()
        if not holding:
            radius += radius_change
            if radius <= 99 or radius >= 301:
                radius_change = -radius_change # Switches between growing and shrinking
                if radius_change < 0:
                    radius_change = -1 # Goes slower when it shrinks
                else:
                    radius_change = 1.5 # Goes faster when it grows
                if colour == (214, 153, 255): 
                    colour = (124, 168, 255) # Changes to the exhale colour
                else:
                    colour = (214, 153, 255) # Changes to the inhale colour
                hold_time = current_time
                holding = True
        else:
            if current_time - hold_time >= delay:
                holding = False
        
        if holding:
            text = "Rest"
        else:
            if radius >= 301:
                text = "Exhale"
                pygame.mixer.Sound.play(exhale)

            elif radius <= 99:
                text = "Inhale"
                pygame.mixer.Sound.play(inhale)

        # Calculates the remaining time
        elapsed_time = current_time - when_clicked
        remaining_time = countdown - elapsed_time // 1000
        if remaining_time <= 0:
            if radius >= 100:
                pass
            else:
                main_menu()

        # Convert remaining time to minutes and seconds
        minutes = remaining_time // 60
        seconds = remaining_time % 60
        if remaining_time > 0:
            time_text = f"{minutes:02}:{seconds:02}"
        else:
            time_text = "0:00"

        # Renders the remaining time at the top right of the screen
        time_render = font.render(time_text, True, (255, 255, 255))
        time_rect = time_render.get_rect(topright=(SCREEN_WIDTH - 10, 10))  
        screen.blit(time_render, time_rect)

        # Renders the text inside the circle, showing when to inhale, rest, or exhale
        text_render = font.render(text, True, (255, 255, 255))
        text_rect = text_render.get_rect(center=(640, 360))
        screen.blit(text_render, text_rect)

        pygame.display.flip()
        clock.tick(fps)

def timer():
    global countdown

    pygame.display.set_caption('Timer')
    run = True
    
    # Load button images and create buttons
    INCREASE_IMAGE = pygame.image.load("assets/increase.png").convert_alpha()
    INCREASE_BUTTON = Button(SCREEN_WIDTH // 2 - 50, SCREEN_HEIGHT // 2 - 175, INCREASE_IMAGE, 1)

    DECREASE_IMAGE = pygame.image.load("assets/decrease.png").convert_alpha()
    DECREASE_BUTTON = Button(SCREEN_WIDTH // 2 - 50, SCREEN_HEIGHT // 2 + 75, DECREASE_IMAGE, 1)
    
    EXIT_IMAGE = pygame.image.load("assets/x.png").convert_alpha()
    EXIT_BUTTON = Button(1110, 60, EXIT_IMAGE, 1)

    while run:
        screen.blit(BG, (0, 0))

        # Background of the GUI
        pygame.draw.rect(screen, (125, 90, 150), (40, 40, 1200, 640))
        pygame.draw.rect(screen, (214, 153, 255), (50, 50, 1180, 620))

        # Handle button presses
        if INCREASE_BUTTON.draw(screen) and countdown < 1800:
            countdown += 60  # Increase by 1 minute
        if DECREASE_BUTTON.draw(screen) and countdown > 60:
            countdown -= 60  # Decrease by 1 minute
        if EXIT_BUTTON.draw(screen):
            main_menu()

        # Display current countdown value
        minutes = countdown // 60
        seconds = countdown % 60
        time_text = f"{minutes:02}:{seconds:02}"
        time_render = big_font.render(time_text, True, (255, 255, 255))
        time_rect = time_render.get_rect(center=(SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2))
        screen.blit(time_render, time_rect)

        # Display title text
        title_text = "Timer"
        title_render = font.render(title_text, True, (255, 255, 255))
        title_rect = title_render.get_rect(center=(SCREEN_WIDTH // 2, 115))
        screen.blit(title_render, title_rect)

        # Event handling
        for event in pygame.event.get():
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_ESCAPE:
                    main_menu()
            if event.type == pygame.QUIT:
                run = False   

        pygame.display.flip()
        clock.tick(fps)

main_menu()

pygame.quit()
