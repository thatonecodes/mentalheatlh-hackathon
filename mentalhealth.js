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

export function generateMentalHealthTip() {
    /**
     * Function to generate a random mental health tip.
     */
    return mentalHealthTips[Math.floor(Math.random() * mentalHealthTips.length)];
}

