if (localStorage.getItem('showDebugButtons') === 'true') {
    document.querySelectorAll('.debug-buttons').forEach(btn => btn.classList.add('show-debug'));
}
if (window.location.search.includes('d=1')) {
    localStorage.setItem('showDebugButtons', 'true');
    document.querySelectorAll('.debug-buttons').forEach(btn => btn.classList.add('show-debug'));
}
if (window.location.search.includes('d=0')) {
    localStorage.removeItem('showDebugButtons');
    document.querySelectorAll('.debug-buttons').forEach(btn => btn.classList.remove('show-debug'));
}