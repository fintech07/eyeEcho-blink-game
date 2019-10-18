// eyeEcho elements
const eyeEchoResultImageEl = document.getElementById('eyeEcho_result_image_element');
const eyeEchoResultBlinkCountEl = document.getElementById('eyeEcho_result_info_blink_count');
const eyeEchoResultBlinkPeriodEl = document.getElementById('eyeEcho_result_info_blink_period');

function setResultImageSrc(imgUrl) {
    eyeEchoResultImageEl.src = imgUrl;
}

function setResultBlinkCount() {
    eyeEchoResultBlinkCountEl.innerHTML = eyeEcho_result_info.count;
    eyeEchoResultBlinkPeriodEl.innerHTML = eyeEcho_result_info.period;
}

function loadJSON(path, success, error) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                if (success)
                    success(JSON.parse(xhr.responseText));
            } else {
                if (error)
                    error(xhr);
            }
        }
    };
    xhr.open("GET", path, true);
    xhr.send();
}

function eyeEcho_load_menu_data(callback) {
    loadJSON(
        './lang/' + eyeEcho_game_config.lang + '.json',
        (data) => {
            eyeEcho_game_config.text = data;
            eyeEcho_game_config.isLoading = false;
            callback();
        },
        (error) => {
            console.log("menu loading error: ", error);
        }
    );
}

const o = Math.round;
const f = Math.floor;
const r = Math.random;

const BIG_INT = 100000000;
const SHAPE_SIZE_MIN = 100;
const CHOR_MIN = 100;
const ALPHA_MIN = 0.6;

const GRADIENT_TYPE = {
    SOLID: 'SOLID',
    LINEAR: 'LINEAR',
    RADIAL: 'RADIAL',
}

const SHAPE_TYPE = {
    CIRCLE: {
        name: 'CIRCLE',
        r: SHAPE_SIZE_MIN / 2
    },
    SQUARE: {
        name: 'SQUARE',
        x: SHAPE_SIZE_MIN,
        y: SHAPE_SIZE_MIN
    },
    THIN_RECTANGLE: {
        name: 'THIN_RECTANGLE',
        x: SHAPE_SIZE_MIN * 2,
        y: SHAPE_SIZE_MIN / 5
    },
    LARGE_RECTANGLE: {
        name: 'LARGE_RECTANGLE',
        x: SHAPE_SIZE_MIN * 2,
        y: SHAPE_SIZE_MIN / 3
    },
    TRIANGLE: {
        name: 'TRIANGLE',
        r: SHAPE_SIZE_MIN / Math.SQRT2
    },
}

const BREAK_POINT = {
    DESKTOP: 1280, // 1280 * 800
    iPAD_PRO: 1024, //1024 * 1366
    iPAD: 768, // 768 * 1024
    iPhone6: 414, // 414 * 736
    iPhoneX: 375, // 375 * 812
    iPhone5: 320, // 320 * 568
}

/**
 * functions to set game config
 */
//set language
function setLanguage(lang) {
    eyeEcho_game_config.lang = lang
}

/**
 * utils to draw shape on canvas
 */
// check a is between b and c
function isWithin(a, b, c) {
    return a >= b && a <= c
};

// get randomized integer
function getRandomInt(range = BIG_INT) {
    return o(r() * range);
}

// get statistic option
function getStc(a = 2, b = 1) {
    return getRandomInt() % a < b ? true : false;
}

// interval just few times
function setIntervalX(callback, delay = 1000, repetitions = 0) {
    let x = 0;
    let intervalId = setInterval(() => {
        callback();
        if (++x === repetitions) {
            clearInterval(intervalId);
        }
    }, delay);
}

// convert hex to rgb
function hexToR(h) {
    return parseInt((cutHex(h)).substring(0, 2), 16)
}

function hexToG(h) {
    return parseInt((cutHex(h)).substring(2, 4), 16)
}

function hexToB(h) {
    return parseInt((cutHex(h)).substring(4, 6), 16)
}

function cutHex(h) {
    return (h.charAt(0) == "#") ? h.substring(1, 7) : h
}

function hexToRgb(_hex) {
    return [hexToR(_hex), hexToG(_hex), hexToB(_hex), 1.0];
}

function ColorLuminance(hex, lum) {
    // validate hex string
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    lum = lum || 0;

    // convert to decimal and change luminosity
    var rgb = "#",
        c, i;
    for (i = 0; i < 3; i++) {
        c = parseInt(hex.substr(i * 2, 2), 16);
        c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
        rgb += ("00" + c).substr(c.length);
    }

    return rgb;
}

function getThemeColors(theme = 'grey') {
    theme = eyeEcho_game_config.theme;
    return eyeEcho_game_config.text.theme[theme];
}

// get rgba style
function getRgbaColor(rgba) {
    return `rgba(${o(rgba[0]) % 256}, ${o(rgba[1]) % 256}, ${o(rgba[2]) % 256}, ${rgba[3] < 1 ? rgba[3] < ALPHA_MIN ? 1 : rgba[3] : 1})`;
}


// unify vector
function unifyVector(_vec) {
    const _l = Math.sqrt(_vec.x * _vec.x + _vec.y * _vec.y);
    return {
        x: _vec.x / _l,
        y: _vec.y / _l
    };
}

animate = ({
    duration,
    draw,
    timing
}) => {
    let start = performance.now();
    requestAnimationFrame(animateFrame = (time) => {
        let timeFraction = (time - start) / duration;
        dropingProgress = timeFraction;
        if (timeFraction > 1) {
            timeFraction = 1;
        }
        let progress = timing(timeFraction)
        draw(progress);
        if (timeFraction && timeFraction < 1) {
            window.requestAnimationFrame(animateFrame);
        }
    });
}


// defind Shape class
class Shape {
    constructor(ctx, width, height, zIndex=0) {

        this.box = {
            width: width,
            height: height,
            area: width * height
        };

        // z-index
        this.z = zIndex;

        /** set the canvas context 2d */
        this.ctx = ctx;

        /** set the shape type randomly */
        this.setType();

        /** set shape's velocity */
        this.setVelociy();

        /** set gradient property */
        this.setGradient();

        /** set color */
        this.setColor();
    }

    /** set the shape's type and width, height, radius */
    setType() {
        this.scale = r() * (this.box.width / SHAPE_SIZE_MIN - 2) + 1;
        const _t = getRandomInt() % 14;
        if (_t < 2) {
            this.type = SHAPE_TYPE.THIN_RECTANGLE;
            this.width = this.type.x * this.scale;
            this.height = this.type.y * this.scale;
            this.r = Math.sqrt(this.width * this.width + this.height * this.height) / 2;
        } else if (_t < 6) {
            this.type = SHAPE_TYPE.LARGE_RECTANGLE;
            this.width = this.type.x * this.scale;
            this.height = this.type.y * this.scale;
            this.r = Math.sqrt(this.width * this.width + this.height * this.height) / 2;
        } else if (_t < 9) {
            this.type = SHAPE_TYPE.CIRCLE;
            this.r = this.type.r * this.scale;
            this.width = this.r * 2;
            this.height = this.r * 2;
        } else if (_t < 11) {
            this.type = SHAPE_TYPE.TRIANGLE;
            this.r = this.type.r * this.scale;
            this.width = this.r * 2;
            this.height = this.r * 2;
        } else {
            this.type = SHAPE_TYPE.SQUARE;
            this.width = this.type.x * this.scale;
            this.height = this.type.y * this.scale;
        }
    }

    /** set shape's velocity with speed and direction */
    setVelociy() {
        let _start_p = {
                x: 0,
                y: 0
            },
            _end_p = {
                x: 0,
                y: 0
            };
        const _o = [this.width / 2, this.height / 2];
        const box = {
            width: this.box.width,
            height: this.box.height,
        };

        let direction = getRandomInt() % 4;

        switch (direction) {
            case 0: // right
                _start_p.x = -_o[0] / 2;
                _start_p.y = r() * box.height;
                _end_p.x = box.width + _o[0] / 2;
                _end_p.y = r() * box.height;
                if (this.width < this.height) {
                    const _t = this.height;
                    this.height = this.width;
                    this.width = _t;
                    _start_p.x = this.width / 2;
                }
                break;
            case 1: // down
                _start_p.x = r() * box.width;
                _start_p.y = -_o[1] / 2;
                _end_p.x = r() * box.width;
                _end_p.y = box.height + _o[1];
                if (this.width > this.height) {
                    const _t = this.height;
                    this.height = this.width;
                    this.width = _t;
                    _start_p.y = -this.height / 2;
                }
                break;
            case 2: // left
                _start_p.x = box.width + _o[0] / 2;
                _start_p.y = r() * box.height;
                _end_p.x = -_o[0];
                _end_p.y = r() * box.height;
                if (this.width < this.height) {
                    const _t = this.height;
                    this.height = this.width;
                    this.width = _t;
                    _start_p.x = box.width + this.width / 2;
                }
                break;
            case 3: // up
                _start_p.x = r() * box.width;
                _start_p.y = box.height + _o[1] / 2;
                _end_p.x = r() * box.width;
                _end_p.y = -_o[1];
                if (this.width > this.height) {
                    const _t = this.height;
                    this.height = this.width;
                    this.width = _t;
                    _start_p.y = box.height + this.height / 2;
                }
                break;
            default:
                _end_p.x = -_o[0];
                _end_p.y = r() * box.height;
                _start_p.x = box.width + _o[0] / 2;
                _start_p.y = r() * box.height;
                break;
        }

        this.start_p = _start_p;
        this.end_p = _end_p;

        this.x = this.start_p.x;
        this.y = this.start_p.y;

        let _a = {
            x: _end_p.x - _start_p.x,
            y: _end_p.y - _start_p.y
        };

        if (this.width > this.height) {
            if (getRandomInt() % 3 == 0) {
                _a.y = _a.y < 0 ? -Math.abs(_a.x) : Math.abs(_a.x);
            } else {
                _a.y = 0;
            }
        }

        if (this.width < this.height) {
            if (getRandomInt() % 4 == 0) {
                _a.x = _a.x < 0 ? -Math.abs(_a.y) : Math.abs(_a.y);
            } else {
                _a.x = 0;
            }
        }

        if (_a.x == 0) {
            this.start_angle = Math.PI / 2;
        } else {
            this.start_angle = Math.atan2(_a.y, _a.x);
        }

        this.direction = _a;
        this.speed = r() * box.width / 200 + box.width / 300;
    }

    setGradient = () => {
        const _t = getRandomInt() % 7;

        if (_t < 1) {
            this.grd_type = GRADIENT_TYPE.SOLID;
        } else if (_t < 4) {
            this.grd_type = GRADIENT_TYPE.LINEAR;
        } else {
            this.grd_type = GRADIENT_TYPE.RADIAL;
        }

        this.grd_center = getRandomInt() % 5;

    }

    setColor = () => {
        const themeColors = getThemeColors();
        this.color = [
            themeColors.value1,
            themeColors.value2,
            themeColors.value3,
        ];

        let colorPrx = this.z % 2 == 0 ? f(this.z / 2 + 2) : -f(this.z / 2);
        let color_step = 0.01;
        const theme = eyeEcho_game_config.theme;
        let color_offset = 0;
        if (colorPrx > 0) {
            if (theme == 'red') {
                color_step = 0.01;
                color_offset = 0.3;
            }

            if (theme == 'light-blue') {
                color_step = 0.02;
                color_offset = 0.2;
            }
        }

        const colors = [
            ColorLuminance(themeColors.value2, colorPrx * color_step + r() * color_step - color_offset),
            ColorLuminance(themeColors.value1, colorPrx * color_step + r() * 0.8 - 0.1),
            ColorLuminance(themeColors.value3, colorPrx * color_step + r() * 0.8 - 0.1),
            ColorLuminance(themeColors.value2, colorPrx * color_step - color_offset),
            ColorLuminance(themeColors.value2, colorPrx * color_step - color_offset),
            ColorLuminance(themeColors.value2, colorPrx * color_step - color_offset),
            ColorLuminance(themeColors.value2, colorPrx * color_step - color_offset),
        ];

        const _t = getRandomInt();
        const area = this.width * this.height;
        if (area > this.box.area / 8) {
            this.color[0] = ColorLuminance(themeColors.value2, colorPrx * color_step - color_offset);
            this.color[1] = ColorLuminance(themeColors.value2, colorPrx * color_step + r() * color_step - color_offset);
        } else {
            this.color[0] = colors[getRandomInt() % 7];
            this.color[1] = colors[getRandomInt() % 5];
            this.color[2] = colors[getRandomInt() % 4];
        }

        if (this.grd_type !== GRADIENT_TYPE.SOLID && area < this.box.area / 6) {
            this.color[1] = colors[getRandomInt() % 4];
            this.color[2] = colors[getRandomInt() % 4];
        }
    }

    move = () => {
        if (this.direction.x == 0) {
            this.y += this.direction.y > 0 ? this.speed : -this.speed;
        } else if (this.direction.y == 0) {
            this.x += this.direction.x > 0 ? this.speed : -this.speed;
        } else {
            const direction = unifyVector(this.direction);
            this.x += this.speed * direction.x;
            this.y += this.speed * direction.y;
        }
    }

    // define draw functions
    drawRect = () => {
        const grd_len = this.r ? this.r * 2 : this.width * 2;
        this.ctx.save();
        let x = this.x;
        let y = this.y;

        if (this.width !== this.height && this.start_angle != Math.PI / 2) {
            this.ctx.translate(this.x, this.y);
            this.ctx.rotate(this.start_angle);
            x = 0;
            y = 0;
        }

        this.ctx.beginPath();
        this.ctx.rect(x - this.width / 2, y - this.height / 2, this.width, this.height);
        let grd;
        switch(this.grd_type) {
            case GRADIENT_TYPE.SOLID:
                grd = this.ctx.createLinearGradient(x - this.width / 2, y - this.height / 2, x + this.width / 2, y + this.height / 2);
                grd.addColorStop(0, this.color[0]);
                break;
            case GRADIENT_TYPE.LINEAR:
                grd = this.ctx.createLinearGradient(x - this.width / 2, y - this.height / 2, x + this.width / 2, y + this.height / 2);
                grd.addColorStop(0, this.color[0]);
                grd.addColorStop(1, this.color[1]);
                break;
            case GRADIENT_TYPE.RADIAL:
                switch(this.grd_center) {
                    case 0:
                        x = x + this.width / 2;
                        y = y + this.height / 2;
                        break;
                    case 1:
                        x = x - this.width / 2;
                        y = y + this.height / 2;
                        break;
                    case 2:
                        x = x + this.width / 2;
                        y = y - this.height / 2;
                        break;
                    case 3:
                        x = x - this.width / 2;
                        y = y - this.height / 2;
                        break;
                }

                grd = this.ctx.createRadialGradient(x, y, 0, x, y, grd_len);

                grd.addColorStop(1, this.color[0]);
                grd.addColorStop(0, this.color[1]);
                break;
        }

        this.ctx.fillStyle = grd;
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.restore();
    }

    drawCircle = () => {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);

        let grd;
        switch(this.grd_type) {
            case GRADIENT_TYPE.SOLID:
                grd = this.ctx.createLinearGradient(this.x - this.r, this.y - this.r, this.x + this.r, this.y + this.r);
                grd.addColorStop(0, this.color[0]);
                grd.addColorStop(1, this.color[1]);
                break;
            case GRADIENT_TYPE.LINEAR:
                grd = this.ctx.createLinearGradient(this.x - this.r, this.y - this.r, this.x + this.r, this.y + this.r);
                grd.addColorStop(0, this.color[0]);
                grd.addColorStop(1, this.color[1]);
                break;
            case GRADIENT_TYPE.RADIAL:
                grd = this.ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r * 2);
                grd.addColorStop(0, this.color[0]);
                grd.addColorStop(1, this.color[1]);
                break;
        }

        this.ctx.fillStyle = grd;
        this.ctx.fill();
        this.ctx.closePath();
    }

    drawTriangle = () => {
        const ang_step = 120 / 180 * Math.PI;
        const p1 = [this.x + this.r * Math.cos(this.start_angle), this.y + this.r * Math.sin(this.start_angle)];
        const p2 = [this.x + this.r * Math.cos(this.start_angle + ang_step), this.y + this.r * Math.sin(this.start_angle + ang_step)];
        const p3 = [this.x + this.r * Math.cos(this.start_angle + 2 * ang_step), this.y + this.r * Math.sin(this.start_angle + 2 * ang_step)];

        this.ctx.beginPath();
        this.ctx.moveTo(p1[0], p1[1]);
        this.ctx.lineTo(p2[0], p2[1]);
        this.ctx.lineTo(p3[0], p3[1]);

        let grd;
        switch(this.grd_type) {
            case GRADIENT_TYPE.SOLID:
                grd = this.ctx.createLinearGradient(this.x - this.r, this.y - this.r, this.x + this.r, this.y + this.r);
                grd.addColorStop(0, this.color[0]);
                break;
            case GRADIENT_TYPE.LINEAR:
                grd = this.ctx.createLinearGradient(this.x - this.r, this.y - this.r, this.x + this.r, this.y + this.r * 2);
                grd.addColorStop(0, this.color[0]);
                grd.addColorStop(1, this.color[1]);
                break;
            case GRADIENT_TYPE.RADIAL:
                switch(this.grd_center) {
                    case 0:
                        grd = this.ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r * 2);
                        break;
                    case 1:
                        grd = this.ctx.createRadialGradient(p1[0], p1[1], 0, p1[0], p1[1], this.r * 2);
                        break;
                    case 1:
                        grd = this.ctx.createRadialGradient(p2[0], p2[1], 0, p2[0], p2[1], this.r * 2);
                        break;
                    default:
                        grd = this.ctx.createRadialGradient(p3[0], p3[1], 0, p3[0], p3[1], this.r * 2);
                        break;

                }
                grd.addColorStop(0, this.color[0]);
                grd.addColorStop(1, this.color[1]);
                break;
        }

        this.ctx.fillStyle = grd;
        this.ctx.fill();
        this.ctx.closePath();
    }

    draw = () => {
        switch (this.type) {
            case SHAPE_TYPE.SQUARE:
                this.drawRect();
                break;
            case SHAPE_TYPE.THIN_RECTANGLE:
                this.drawRect();
                break;
            case SHAPE_TYPE.LARGE_RECTANGLE:
                this.drawRect();
                break;
            case SHAPE_TYPE.CIRCLE:
                this.drawCircle();
                break;
            case SHAPE_TYPE.TRIANGLE:
                this.drawTriangle();
                break;
        }
    }
};


class GameBoard {
    constructor(canvas) {
        this.setCanvas(canvas);
    }

    setCanvas = (canvas) => {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.theme = eyeEcho_game_config.theme;
        this.bg_color = eyeEcho_game_config.text.theme[this.theme];
        this.init();
    }

    init = (countdown = eyeEcho_game_config.countdown) => {
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.lr_p = 0;
        this.t_p = this.height / 5;
        this.countdown = countdown;
        this.activeShape = null;
        this.staticShapes = [];
        this.touchedHeight = this.height;
        this.isStarted = false;
        this.isUploading = false;
        this.isReady = 4;
        this.countdownTimer = null;
        this.backgroundTimer = null;
        this.moveTimer = null;
        this.setActiveShape();
        this.isEnableEye = false;
        this.blinkIcon = new Image();
        this.blinkIcon.setAttribute("crossOrigin", "Anonymous");
        this.blinkIcon.src = eyeEcho_game_config.eye_url;
        this.drawMenu();

        //init global info values
        eyeEcho_result_info.count = 0;
        eyeEcho_result_info.period = 0;
    }

    setActiveShape = () => {
        this.activeShape = new Shape(this.ctx, this.width, this.height, this.staticShapes.length);
    }

    readyToStart = () => {
        this.drawReadyToStart();
        setIntervalX(() => {
            this.isReady--;
            this.drawReadyToStart();
        }, 1000, 4);
    }

    startGame = () => {
        if (this.isStarted || this.isUploading)
            return;

        this.init();

        this.isStarted = true;

        this.countdownTimer = setInterval(() => {
            this.countdown--;
            eyeEcho_result_info.period++;
        }, 1000);

        this.moveTimer = setInterval(() => {
            this.moveShape();
        }, 1);

        this.draw();
    }

    uploadImage = () => {
        try {
            this.isUploading = true;
            this.isEnableEye = false;
            const pngUrl = this.canvas.toDataURL("image/png", 1);
            setResultImageSrc(pngUrl);
            setResultBlinkCount();
            this.drawMenu();

            const url = 'https://imb-staging.herokuapp.com/eye-echo/upload';
            fetch(url, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json;charset=UTF-8'
                    },
                    body: JSON.stringify({
                        "image": pngUrl
                    })
                })
                .then(resp => resp.json())
                .then(data => {
                    this.isUploading = false;
                    if (data.status === 'error') {
                        alert('error: ', data.message);
                    } else {
                        //alert(data.message + '\n' + eyeEcho_menu[eyeEcho_game_config.lang].uploading.success + '\n' + data.image_url);
                        eyeEchoPage('eyeEcho_results_page', 'eyeEcho_result_created_image');
                    }
                    this.drawMenu();
                });
        } catch (err) {
            console.log(err);
            this.isUploading = false;
            this.drawMenu();
        }
    }

    endGame = () => {
        if (!this.isStarted) return;
        clearInterval(this.countdownTimer);
        clearInterval(this.moveTimer);
        this.isStarted = false;
        this.uploadImage();
    }

    addStaticShape = () => {
        this.staticShapes.push(this.activeShape);
    }

    // check the active shape is out of board and set top height
    checkShape = () => {
        const x = this.activeShape.x;
        const y = this.activeShape.y;
        const width = this.activeShape.width;
        const height = this.activeShape.height;
        const r = Math.sqrt(width * width + height * height) / 2;

        if (x + r < 0 || x - r > this.width || y + r < 0 || y - r> this.height) {
            this.setActiveShape();
        }
    }

    // check if end condition
    checkEndCondition = () => {
        return this.countdown < 1;
    }

    // drop shape
    dropShape = () => {
        eyeEcho_result_info.count++;
        if (!this.isStarted) return;
        this.isEnableEye = true;

        setTimeout(() => {
            this.isEnableEye = false;
        }, 300);

        this.addStaticShape();
        this.setActiveShape();
    }

    // move shape left or right
    moveShape = () => {
        this.activeShape.move();
        this.checkShape();
    }

    // define draw functions
    erase = () => {
        this.ctx.restore();
        this.ctx.save();
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    // draw ready to start
    drawReadyToStart = () => {
        if (this.isReady < 1) {
            animate({
                duration: 1000,
                draw: (progress) => {
                    if (progress >= 1) {
                        this.startGame();
                        return;
                    }
                    if (progress < 0) return;
                    const _r = 1000 * progress + this.width / 5;
                    this.erase();
                    this.ctx.beginPath();
                    this.ctx.arc(this.width / 2, this.height / 2, Math.abs(_r), 0, Math.PI * 2);
                    this.ctx.clip();
                    this.drawBackground(_r, _r);
                    this.ctx.fillStyle = "rgba(255, 255, 255, " + (0.6 - progress > 0 ? 0.6 - progress : 0.0) + ")";
                    this.ctx.font = 'bold ' + (20 + 20 * progress) + 'vw Arial';
                    this.ctx.textAlign = 'center';
                    this.ctx.textBaseline = 'middle';
                    const txtHeight = this.ctx.measureText('3').width;
                    this.ctx.fillText(1, this.width / 2, this.height / 2 + txtHeight / 6);
                },
                timing: (timeFraction) => {
                    return timeFraction;
                }
            });
        } else if (this.isReady > 3) {
            animate({
                duration: 1000,
                draw: (progress) => {
                    if (progress < 0) return;
                    this.erase();
                    this.ctx.beginPath();
                    this.ctx.arc(this.width / 2, this.height / 2, this.width / 5, 0, Math.PI * 2);
                    this.ctx.closePath();
                    this.ctx.clip();
                    this.ctx.globalAlpha = progress;
                    this.drawBackground(this.width / 5, this.width / 5);
                    this.ctx.fillStyle = "rgba(255, 255, 255, " + progress + ")";
                    this.ctx.font = 'bold 20vw Arial';
                    this.ctx.textAlign = 'center';
                    this.ctx.textBaseline = 'middle';
                    const txtHeight = this.ctx.measureText('3').width;
                    this.ctx.fillText(3, this.width / 2, this.height / 2 + txtHeight / 6);
                },
                timing: (timeFraction) => {
                    return timeFraction;
                }
            });
        } else {
            this.erase();
            this.ctx.beginPath();
            this.ctx.arc(this.width / 2, this.height / 2, this.width / 5, 0, Math.PI * 2);
            this.ctx.clip();
            this.drawBackground(this.width / 5, this.width / 5);
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.font = 'bold 20vw Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            const txtHeight = this.ctx.measureText('3').width;
            this.ctx.fillText(this.isReady, this.width / 2, this.height / 2 + txtHeight / 6);
        }
    }

    // draw menu to show how to play game
    drawMenu = () => {
        if (this.isUploading) {
            this.ctx.fillStyle = '#000000';
            this.ctx.font = '6vw Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(eyeEcho_game_config.text.game.uploading.title, this.width / 2, this.height / 2);
            this.ctx.font = '4vw Arial'
            this.ctx.fillText(eyeEcho_game_config.text.game.uploading.description, this.width / 2, (this.height / 4) * 3);
            return;
        }
    }

    // draw time remaining
    drawCountdown = () => {
        if (this.countdown < 1) return;

        this.ctx.fillStyle = '#FFF';
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'middle';
        this.ctx.font = '8vw Arial Black';

        const txtHeight = this.ctx.measureText('M').width;
        const countdownTextWidth = this.ctx.measureText(this.countdown);

        this.ctx.fillText(this.countdown, txtHeight / 2, txtHeight);
        this.ctx.font = '4vw Arial';
        this.ctx.fillText(' sec', txtHeight / 2 + countdownTextWidth.width, txtHeight);

        this.ctx.textAlign = 'right';
        this.ctx.font = '4vw Arial';
        const blinksTextWidth = this.ctx.measureText(' blinks');
        this.ctx.fillText(' blinks', this.width - txtHeight / 2, txtHeight);
        this.ctx.font = '8vw Arial Black';
        this.ctx.fillText(eyeEcho_result_info.count, this.width - txtHeight / 2 - blinksTextWidth.width, txtHeight);

    }

    // draw shapes
    drawShapes = () => {
        this.staticShapes.forEach(function (shape) {
            shape.draw();
        })
    }

    // draw blink icon when the shape start to drop
    drawBlinkIcon = () => {
        if (this.isEnableEye && !this.isUploading) {
            this.ctx.drawImage(this.blinkIcon, this.width / 2 - this.width / 10, this.height / 2 - this.width / 10, this.width / 5, this.width / 5);
        }
    }

    // draw gradient background.
    drawBackground = (offset_x = this.width / 2, offset_y = this.height / 2) => {

        if (offset_x == 0 || offset_x > this.width / 2) {
            offset_x = this.width / 2, offset_y = this.height / 2;
        }

        let grd = this.ctx.createLinearGradient(
            this.width / 2 - offset_x,
            this.height / 2 - offset_y,
            this.width / 2 + offset_x,
            this.height / 2 + offset_y);
        grd.addColorStop(0, this.bg_color.value1 + "99");
        grd.addColorStop(0.4, this.bg_color.value2);
        //grd.addColorStop(0.7, this.bg_color.value2);
        grd.addColorStop(1, this.bg_color.value3 + "99");
        this.ctx.fillStyle = grd;
        this.ctx.fillRect(this.width / 2 - offset_x, this.height / 2 - offset_y, this.width / 2 + offset_x, this.height / 2 + offset_y);
    }

    // draw by time
    draw = (time) => {
        this.erase();
        this.drawBackground(this.width / 2, this.height / 2);
        this.drawShapes();
        if (this.checkEndCondition()) {
            this.endGame();
        } else {
            this.activeShape.draw();
            this.drawCountdown();
            this.drawBlinkIcon();
            window.requestAnimationFrame(this.draw);
        }
    }
};

/**
 *  get elements
 */

const eyeEcho_blink_game_container = document.getElementById('eyeEcho_blink_game_container');
const eyeEcho_blink_game_canvas = document.getElementById("eyeEcho_blink_game_board");
const eyeEcho_blink_game_ctx = eyeEcho_blink_game_canvas.getContext("2d");

/**
 * set class name to change eyeEcho_blink_game_canvas game board width dynamically by eyeEcho_blink_game_container's boundbox size
 */

chageWidthClass = () => {
    if (!gameboard) return;
    eyeEcho_blink_game_canvas.width = eyeEcho_blink_game_container.offsetWidth;
    eyeEcho_blink_game_canvas.height = eyeEcho_blink_game_container.offsetHeight;

    gameboard.setCanvas(eyeEcho_blink_game_canvas);
}

function eyeEcho_translate() {
    const allDom = document.getElementsByTagName("*");
    for (let i = 0; i < allDom.length; i++) {
        const elem = allDom[i];
        const key = elem.getAttribute("eyeEcho-data-tag");
        if (key != null) {
            elem.innerHTML = eyeEcho_game_config.text.page[key];
        }
    }
}

createGameBoard = () => {
    console.log('creating game board');
    eyeEcho_translate();

    gameboard = new GameBoard(eyeEcho_blink_game_canvas);

    chageWidthClass();

    //window.addEventListener('resize', chageWidthClass);

    //eyeEcho_blink_game_canvas.addEventListener('click', gameboard.startGame);

    document.addEventListener('mousedown', function (event) {
        lastDownTarget = event.target;
    }, false);

    document.addEventListener('keydown', function (e) {
        if (lastDownTarget == eyeEcho_blink_game_canvas) {
            e.preventDefault();
            if (e.keyCode === 40) {
                gameboard.dropShape();
            }
        }
    }, false);
}

eyeEcho_load_menu_data(createGameBoard);