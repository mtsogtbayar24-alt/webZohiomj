var leftArea = document.getElementById('left');
var leftCircle = leftArea.children[0];
var rightArea = document.getElementById('right');
var rightCircle = rightArea.children[0];
var vs = document.getElementById('vs');

leftArea.addEventListener('click', function () {
    var i = (parseInt(leftCircle.innerText) || 0) + 1;
    var l = i + 1;
    leftCircle.innerText = i;
    leftArea.style.flex = l;
    var r = parseInt(rightArea.style.flex) || 1;
    vs.style.left = (100 * l / (l + r)) + '%';
});

rightArea.addEventListener('click', function () {
    var n = (parseInt(rightCircle.innerText) || 0) + 1;
    var m = n + 1;
    rightCircle.innerText = n;
    rightArea.style.flex = m;
    var p = parseInt(leftArea.style.flex) || 1;
    vs.style.left = (100 * p / (p + m)) + '%';
});