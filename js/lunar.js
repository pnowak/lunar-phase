var now = new Date();
var date = formatDate(now);

var canvas = {
    screen : get("screen").getContext('2d'),
    fracillum : get('fracillum'),
    precent : function () {
        var percentTxt = this.fracillum.textContent,
            part = percentTxt.split(':');
        return part[1];
    },
    moon : function () {
        var context = this.screen;

        context.fillStyle = '#fbf9f9';

        context.beginPath();
        context.arc(100, 100, 100, 0, Math.PI*2, true);
        context.fill();
    },
    phase : function () {
        var context = this.screen,
            part = 100 - this.precent();

        context.fillStyle = '#012825';

        context.beginPath();
        context.arc(part, part, 100, 0, Math.PI*2, false);
        context.fill();
    }
};

var count = {
    age : get('age'),
    countAge : function () {
        var txt = this.age.textContent,
            parts = txt.split(' ');

        parts[3] = moonAge(now);
        this.age.textContent = parts[0] + ' ' + parts[1] + ' ' + parts[2] + ' ' + + parts[3];
    }
};

function formatDate (now) {
    return now.toLocaleDateString();
} 

// Algorithm for calculating a day of the Moon
// http://www.astronomyforum.net/astronomy-beginners-forum/134711-moon-phase-calculation.html
function moonAge (now) {
    var year = now.getFullYear(),
        month = now.getMonth() + 1,
        day = now.getDate(),
        moonDay;

    moonDay = ((((year % 100) % 19) * 11) % 30) + month + day - 8.3;

    return moonDay < 0 ? Math.floor(moonDay + 30) : Math.floor(moonDay);
}

function get (id) { 
    return document.getElementById(id);
}

function getJSON (url) {
    var request = new XMLHttpRequest(),
        phase = get('curphase'),
        percent = get('fracillum'),
        percentTxt = percent.textContent,
        parts = percentTxt.split(':'),
        parse, fracillum;
    request.onreadystatechange = function () {
        if (request.readyState !== 4) {
            return false;
        }
        if (request.status !== 200) {
            console.log("Error, status code: " + request.status);
            return false;
        }
        parse = JSON.parse(request.responseText);
        fracillum = parse.fracillum;

        phase.textContent = parse.curphase || parse.closestphase.phase;

        parts[1] = fracillum.length > 2 ? fracillum.slice(0, 2) : fracillum.slice(0, 1) || [100, 0][parse.closestphase.phase === 'Full Moon' ? 0 : 1];
        percent.textContent = parts[0] + ': ' + parts[1];
    };
    request.open('GET', url, false);
    request.send('');
};

//init
getJSON('http://api.usno.navy.mil/rstt/oneday?date=' + date + '&coords=41.89N,12.48E&tz=1')
window.onload = canvas.moon();
window.onload = canvas.phase();
window.onload = count.countAge();