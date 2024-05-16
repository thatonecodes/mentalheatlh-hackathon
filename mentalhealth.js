// List of mental health tips
const mentalHealthTips = [
    "Practice deep breathing exercises.",
    "Take regular breaks to relax and recharge.",
    "Stay hydrated and eat nutritious meals.",
    "Get regular exercise to boost your mood.",
    "Connect with friends and family for support.",
    "Limit your screen time and take time away from technology.",
    "Practice mindfulness or meditation daily.",
    "Seek professional help if you're struggling.",
    "Express gratitude for the positive things in your life.",
    "Engage in activities you enjoy regularly."
];

function generateMentalHealthTip() {
    /**
     * Function to generate a random mental health tip.
     */
    return mentalHealthTips[Math.floor(Math.random() * mentalHealthTips.length)];
}

function main() {
    /**
     * Main function to display random mental health tips.
     */
    console.log("Welcome to the Mental Health Tip Generator!");

    while (true) {
        prompt("Press Enter to get a random tip or 'q' to quit: ");

        const tip = generateMentalHealthTip();
        console.log("\nRandom Mental Health Tip:");
        console.log(tip);

        const user_input = prompt("\nWould you like another tip? (yes/no): ").toLowerCase();
        if (user_input !== 'yes') {
            console.log("Thank you for using the Mental Health Tip Generator!");
            break;
        }
    }
}

main()
