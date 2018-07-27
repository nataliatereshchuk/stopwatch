import React from 'react';
import ReactDOM from 'react-dom';
import * as Redux from 'redux';
import * as ReactRedux from 'react-redux';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

let intents = {
    TICK: 'TICK',
    START: 'START',
    STOP: 'STOP',
    RESET: 'RESET'
};

function mapStateToProps(state) {
    return state;
}

function mapDispatchToProps(dispatch) {
    return {
        onStart: () => {dispatch({type: intents.START})},
        onStop: () => {dispatch({type: intents.STOP})},
    };
}

let Stopwatch = ReactRedux.connect(mapStateToProps, mapDispatchToProps)((props) => {
    debugger;
    let minutes = Math.floor(props.time / 60);
    let seconds = props.time - (minutes * 60);
    let secondsFormatted = `${seconds < 10 ? '0' : ''}${seconds}`;

    return (
        <div>
            <div>{minutes}:{secondsFormatted}</div>
            <button onClick={() => {props.running ? props.onStop : props.onStart}}>{props.running ? intents.STOP : intents.START}</button>
        </div>);
});

let container = Redux.createStore((model = {running: false, time: 0}, action) => {
    const updates = {
        'TICK': (model) => Object.assign({}, model, {time: (model.running ? model.time + 1 : model.time)}),
        'STOP': (model) => Object.assign({}, model, {running: false}),
        'START': (model) => Object.assign({}, model, {running: true})
    };

    return (updates[action.type] || (() => model))(model);
});

setInterval(() => {
    container.dispatch({type: intents.TICK});
}, 1000);

ReactDOM.render(
    <ReactRedux.Provider store={container}>
        <Stopwatch/>
    </ReactRedux.Provider>,
    document.getElementById('root'));


registerServiceWorker();
