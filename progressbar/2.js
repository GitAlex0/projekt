document.addEventListener('DOMContentLoaded', function() {
    var bar = new ProgressBar.Line('#progress-bar', {
        strokeWidth: 8,
        color: '#96BE93',
        trailColor: '#e3e3e3',
        trailWidth: 8,
        easing: 'easeInOut',
        svgStyle: {width: '100%', height: '100%', borderRadius: '2vh', display: 'block'},
        text: { autoStyleContainer: false },
        from: { color: '#96BE93' },
        to: { color: '#96BE93' },
        step: (state, bar) => {
            let percent = Math.round(bar.value() * 100);
            document.getElementById('pLabel').textContent = percent + ' %';
        }
    });


    // bar.path.setAttribute('stroke-linecap', 'round');

    window.setProgress = function(percent) {
        bar.animate(percent / 100);
    };

    setProgress(0);
});