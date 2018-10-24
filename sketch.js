let timers;
let time;
let input;
let editing = false;
const MPTIME = 900; //15 minutes
const MPAFTERMATH = 120; //2 minutes
const CANWIDTH = 640;
const CANHEIGHT = 480;

function preload(){
    soundFormats('mp3', 'ogg');
    timerSound = loadSound('assets/short_beep.mp3')
}

function setup() {
    createCanvas(CANWIDTH, CANHEIGHT);
    time = hour() * 3600 + minute() * 60 + second();
    timerSound.setVolume(0.1);
    //timerSound.play();
    timers = [];
    //newMP();
}

function draw() {
    time = hour() * 3600 + minute() * 60 + second();
    background(255);
    let i = 0;
    for(i = 0; i < timers.length; i++){
        timers[i].update(i);
    }
}

function doubleClicked() {
    if(editing) {
        editing = false;
        input.remove();
    }
    if(mouseY > timers.length * 50){
        newMP();
        popTimeout();
    }
    else{
        editing = true;
        input = createInput();
        let ttime = timers[Math.floor(mouseY / 50)].currTime;
        input.value((ttime - (ttime % 60)) / 60 + ((ttime % 60 < 10) ? ':0' : ':') + ttime % 60);
        //input.value((ttime - (ttime % 60)) / 60); 
        input.position(180, 50 * Math.floor(mouseY / 50) + 22);
        input.size(40);
        input.elt.focus();
    }
}

function popTimeout(){
    for(let i = 0; i < timers.length; i++){
        if(timers[i].timedout) timers.splice(i, 1);
    }
}

function keyPressed(){
    if(editing && keyCode == ENTER) {
        setTime(Math.floor(input.position().y / 50), input.value());
        input.remove();
    }
}

const setStartTime = function(index, time) {
    timers[index].startTime = parseTime(time);
}

const setTime = function(index, time) {
    timers[index].startTime += timers[index].currTime - parseTime(time);
}

const parseTime = function(string) {
    return parseInt(string.split(':')[0]) * 60 + parseInt(string.split(':')[1]);
}

const newMP = function() {
    timers.push(new MPTimer('test', timerSound));
}

const MPTimer = function(name, sound){
    return new BDOTimer(name, MPTIME, MPAFTERMATH, sound)
}

const BDOTimer = function(name, length, aftermath, sound) {
    this.name = name;
    this.length = length;
    this.aftermath = aftermath;
    this.currTime = 0;
    this.startTime = time;
    this.running = true;
    this.sound = sound;
    this.timedout = false;

    this.update = function(index) {  
        this.currTime = time - this.startTime;      
        if(this.running) {
            if(this.currTime >= this.length){
                this.sound.play();
                this.running = false;
            }
        }
        else if(this.currTime >= this.length + this.aftermath) this.timedout = true;
        this.show(index);
    }

    this.show = function(index) {
        push();
        fill('gray');
        rect(0, 50 * index, 300, 50);
        if(this.currTime < (this.length + this.aftermath)) {
            if(this.currTime < this.length){
                fill('red')
                rect(0, 50 * index, 300 * (this.currTime / this.length) , 50);
            }
            else{
                fill('blue')
                rect(0, 50 * index, 300 * (1 - (this.currTime % this.length) / this.aftermath) , 50);
            }
            fill('white');
            textSize(20);
            textAlign(CENTER, CENTER);
            text((this.currTime - (this.currTime % 60)) / 60 + ((this.currTime % 60 < 10) ? ':0' : ':') + this.currTime % 60 , 150, 25 + index * 50);
        }
        pop();
    }
}