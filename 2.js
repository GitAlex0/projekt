document.addEventListener('DOMContentLoaded', function() {
    // Create a linear progress bar inside the #progress div
    var barContainer = document.querySelector('#progress');
    const bar = new ProgressBar.Line(barContainer, {
        strokeWidth: 4,
        color: '#4caf50',
        trailColor: '#eee',
        trailWidth: 1,
        easing: 'easeOut',
        svgStyle: {width: '100%', height: '30px'},
        text: {
            style: {
                color: '#333',
                position: 'absolute',
                right: '0',
                top: '30px',
                padding: 0,
                margin: 0,
                transform: null
            },
            autoStyleContainer: false
        },
        from: {color: '#FFEA82'},
        to: {color: '#ED6A5A'},
        step: (state, bar) => {
            bar.setText(Math.round(bar.value() * 100) + ' %');
        }
    });

    // Expose setProgress globally
    window.setProgress = function(percent) {
        bar.animate(percent / 100);
    };

    // Example: Set to 75%
    setProgress(75);
});