class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        this.initialState = config.initial;
        this.states = config.states;
        this.statesDone = new Stack();
        this.statesDone.push(this.initialState);
        this.statesUndone = new Stack();
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.statesDone.peek();
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if (!this.states[state]) {
            throw new Error("This state doesn't exist.");
        }
        this.statesDone.push(state);
        this.statesUndone.clear();
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        var currentState = this.getState();
        var newState = this.states[currentState].transitions[event];
        if (newState) {
            this.changeState(newState);
            this.statesUndone.clear();
        }
        else throw new Error("This event can't be triggered.");
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.statesDone.clear();
        this.statesDone.push(this.initialState);
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        var specifiedStates = [];
        if(!event) {
            for (var key in this.states) {
              specifiedStates.push(key);  
          }
        }
        else {
            for (var key in this.states) {
                if (this.states[key].transitions[event]) {
                    specifiedStates.push(key)
                }
            }
        }
        return specifiedStates;
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if (this.statesDone.length()  > 1) {
            this.statesUndone.push(this.statesDone.pop());
            return true;
        }
        return false;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if (this.statesUndone.length() > 0) {
            this.statesDone.push(this.statesUndone.pop());
            return true;
        }
        return false;
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.statesDone.clear();
        this.statesUndone.clear();
        this.statesDone.push(this.initialState);
    }
}

class Stack {
    constructor () {
        this.data = [];
        this.top = 0;
    }

    push(element) {
        this.data[this.top++] = element;
    }

    pop() {
        if (this.length() > 0) {
            return this.data[--this.top];
        }
        else throw new Error("No elements to pop");
    }

    peek() {
        return this.data[this.top-1];
    }

    length() {
        return this.top;
    }

    clear() {
        this.top = 0;
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
