/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { EventEmitter } from "events";
import { DataObject, DataObjectFactory } from "@fluidframework/aqueduct";
import { IValueChanged } from "@fluidframework/map";

/**
 * IDiceRoller describes the public API surface for our dice roller data object.
 */
export interface IDiceRoller extends EventEmitter {
    /**
     * Get the dice value as a number.
     */
    readonly value: number;
    
     /**
     * Get the dice value as a number.
     */
    readonly coordinates: any;

    /**
     * Roll the dice.  Will cause a "diceRolled" event to be emitted.
     */
    roll: () => void;
    move: (x:Number , y:Number , roomId?:string) => void;

    /**
     * The diceRolled event will fire whenever someone rolls the device, either locally or remotely.
     */
    on(event: "diceRolled", listener: () => void): this;
    on(event: "newCords", listener: () => void): this;
}

// The root is map-like, so we'll use this key for storing the value.
const diceValueKey = "diceValue";
const coordinates = "coordinates";

/**
 * The DiceRoller is our data object that implements the IDiceRoller interface.
 */
export class DiceRoller extends DataObject implements IDiceRoller {
    
    /**
     * initializingFirstTime is run only once by the first client to create the DataObject.  Here we use it to
     * initialize the state of the DataObject.
     */
     name : string  ='';
     color : string = '';
     roomId: string = '';
    protected async initializingFirstTime() {
        // this.root.set(diceValueKey, 2);
       
    }

    getRandomString = (length) => {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
           result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
     getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      }
    getRandomX= () => {
       return  Math.floor( Math.random() * 900)
    }
    getRandomY= () => {
        return  Math.floor( Math.random() * 600)
     }
    /**
     * hasInitialized is run by each client as they load the DataObject.  Here we use it to set up usage of the
     * DataObject, by registering an event listener for dice rolls.
     */
    protected async hasInitialized() {
        let key = this.getRandomString(5);
        this.name = key;
        this.roomId = key;
        this.color = this.getRandomColor();
        let obj = {};
        obj =  {
            x: this.getRandomX(),
            y : this.getRandomY(),
            color: this.color
        }

        this.root.set(key, 
            obj
        );
        this.root.on("valueChanged", (changed: IValueChanged) => {
                console.log('coordinates changed');
                for(let item of this.root.keys()) {
                    console.log('########')
                    console.log(item );
                    console.log(this.root.get(item)['x']);
                    console.log(this.root.get(item)['y']);
                    console.log('########');
                }
        });
    }
    public getName() {
        return this.name;
    }
    public getColor() {
        return this.color;
    }
    public get value() {
        return this.root.get(diceValueKey);
    }
    public get coordinates(){
        return this.root.get(coordinates);
    }

    public readonly roll = () => {
        // const rollValue = Math.floor(Math.random() * 6) + 1;
        // this.root.set(diceValueKey, rollValue);
    };
    public readonly move = (xCor,yCor,roomId = this.roomId) => {
        if(xCor > 0 && yCor >0)
        this.root.set(this.name , {
            x: xCor,
            y: yCor,
            color: this.color,
            roomId : roomId
        })
    }
}

/**
 * The DataObjectFactory is used by Fluid Framework to instantiate our DataObject.  We provide it with a unique name
 * and the constructor it will call.  In this scenario, the third and fourth arguments are not used.
 */
export const DiceRollerInstantiationFactory = new DataObjectFactory(
    "dice-roller",
    DiceRoller,
    [],
    {},
);
