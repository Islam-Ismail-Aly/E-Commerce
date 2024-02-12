const container = document.getElementById('lottie-container');

if (container && typeof lottie !== 'undefined') {
  fetch('AnimationLaptop.json')
    .then(response => response.json())
    .then(animationData => {
      const anim = lottie.loadAnimation({
        container: container,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: animationData,
      });
    })
    .catch(error => {
      console.error('Error loading animation data:', error);
    });
} 
else {
  console.error("Container element not found or Lottie library not loaded.");
}