document.addEventListener('DOMContentLoaded', function() {
    // Add click sound effect to buttons
    const buttons = document.querySelectorAll('a');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const audio = new Audio('click-sound.mp3'); // Replace with the correct path to your click sound file
            audio.play();
        });
    });
});
