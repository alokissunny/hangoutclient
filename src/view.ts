/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {  IDiceRoller } from "./dataObject";

var canvas = document.getElementById('the-canvas') as any;
var infoPanel = document.getElementById('info') as any;

window.addEventListener('keydown',check,false);
window.addEventListener('keyup',reset,false);
var deltaX = 0;
var deltaY = 0;
function reset(e){
    deltaX = 0;
    deltaY = 0; 
}
function check(e) {
    console.log(e.keyCode);
    switch(e.keyCode) {
        case 37: 
            deltaX = -2;
            deltaY = 0;
            break;
            case 38: 
            deltaX = 0;
            deltaY = -2;
            break;
            case 39: 
            deltaX = 2;
            deltaY = 0;
            break;
            case 40: 
            deltaX = 0;
            deltaY = 2;
            break;


    }
}

var ctx = canvas.getContext('2d') as any;
canvas.width = 900;
canvas.height = 600;
// just a basic display object
var avtars = [];
var obj = {
    x: 100,
    y: 100,
    me:''
};

var cords = [];

function myProxity(meObj, limit =10) {
let nearMe = [];
cords.forEach(cord => {
    let dist = Math.sqrt(Math.pow(cord.x-meObj.x,2) + Math.pow(cord.y-meObj.y,2));
    if(dist < limit && cord.avtar !== meObj.me)
        nearMe.push(cord.avtar);
});
return nearMe;
}
var draw = function (ctx, avtars , diceRoller , meObj) {
    // draw background
    let me = diceRoller.getName();
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // draw the object
    cords = [];
    avtars.forEach(avtar => {
        let clr = (diceRoller as any).root.get(avtar).color;
    ctx.fillStyle = clr;
    let x1 = avtar === me ? meObj.x : (diceRoller as any).root.get(avtar).x;
    let y1 = avtar === me ? meObj.y :(diceRoller as any).root.get(avtar).y;
    ctx.fillRect(x1, y1, 10, 10);
    ctx.fill();
    cords.push({
        avtar : avtar,
        x: x1,
        y:y1
    });
});
// console.log('Near me '+ myProxity(meObj));
infoPanel.innerText = ('Near '+ myProxity(meObj))};

/**
 * Render an IDiceRoller into a given div as a text character, with a button to roll it.
 * @param diceRoller - The Data Object to be rendered
 * @param div - The div to render into
 */
export function renderDiceRoller(diceRoller: IDiceRoller, div: HTMLDivElement) {
    // const wrapperDiv = document.createElement("div");
    // wrapperDiv.style.textAlign = "center";
    // div.append(wrapperDiv);
    // draw()
    obj.x = (diceRoller as any).root.get((diceRoller as any).getName()).x;
    obj.y = (diceRoller as any).root.get((diceRoller as any).getName()).y;
    obj.me = (diceRoller as any).getName();
    const loop = () => {
        let dir = (diceRoller as any).root;
        avtars = [];
        for (let items of dir.keys()) {
            if(items) {
            console.log(items);
            avtars.push(items);
            }
        }
        requestAnimationFrame(loop);
        // just stepping the object
        
        obj.x += deltaX;
        obj.y += deltaY;
      obj.x = Math.min(canvas.width -20, obj.x);
      obj.y = Math.min(canvas.height -20, obj.y);
      obj.x = Math.max(10 , obj.x);
      obj.y = Math.max(10 , obj.y); 
    //   (diceRoller as any).root.set((diceRoller as any).getName(), obj);
        // draw object
        draw(ctx, avtars, diceRoller , obj);
         diceRoller.move(obj.x,obj.y);
    }
    loop();
    // const diceCharDiv = document.createElement("div");
    // diceCharDiv.style.fontSize = "200px";

    // const rollButton = document.createElement("button");
    // rollButton.style.fontSize = "50px";
    // rollButton.textContent = "Roll";
    // // Call the roll method to modify the shared data when the button is clicked.
    // rollButton.addEventListener("click", diceRoller.roll);

    // wrapperDiv.append(diceCharDiv, rollButton);

    // Get the current value of the shared data to update the view whenever it changes.
    // const updateDiceChar = () => {
    //     // Unicode 0x2680-0x2685 are the sides of a dice (⚀⚁⚂⚃⚄⚅)
    //     diceCharDiv.textContent = String.fromCodePoint(0x267F + diceRoller.value);
    //     diceCharDiv.style.color = `hsl(${diceRoller.value * 60}, 70%, 50%)`;
    // };
    const updateCords = () => {
        obj.x = (diceRoller as any).getName().x;
        obj.y = diceRoller.coordinates.y;
    }
    // updateDiceChar();

    // Use the diceRolled event to trigger the rerender whenever the value changes.
    // diceRoller.on("diceRolled", updateDiceChar);
    diceRoller.on("newCords", updateCords);
}
