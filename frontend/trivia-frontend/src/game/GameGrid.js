import { useState } from 'react';
import { useEffect } from 'react';

export function LobbyGrid({playerData, roomData}) {
    console.log(playerData);
    const playerCardList = playerData.map((player) => 
        
        <div className={`d-flex flex-column justify-content-center m-2 rounded border col ${player.has_answered ? "answered-bg text-white" : null}`} key={player.name}>
            <div>
                <h3 className="my-2" >{player.name}</h3>
            </div>
            <div >
                <p className='mb-2 fs-5'>{player.points} pts</p>
            </div>
        </div>
    );  

    return (
        <>
            <div>
                <div>
                    <div className='row'>{playerCardList}</div>
                </div>
            </div>
        </>
    );
}

export function GameGrid({answerData,questionTitle, questionChoices, sendWebsocket}) {
    var nth = 0;
    let choiceList = null;

    var colors = ["blue", "red", "green", "yellow"]
    if (!questionChoices.includes(answerData)) {
        console.log("No choice list");
        choiceList = questionChoices.map((choice) => 
            <div className="col-6 col-md-6 g-3" key={choice} onClick={() => sendWebsocket({"type": "answer", "data": choice})}> 
                <div className={`p-5 fs-4 h-100 text-light bg-${colors[nth++]} rounded d-flex align-items-center justify-content-center`}>
                    <p className='m-0'>{choice}</p>
                </div>
            </div>
        );
    }
    else {
        console.log(answerData, questionChoices.map((choice) => choice==answerData));
        choiceList = questionChoices.map((choice) => 
            <div className="col-6 col-md-6 g-3" key={choice}> 
                <div className={`p-5 fs-4 h-100 text-light bg-${choice==answerData ?"green" : "red"} rounded d-flex align-items-center justify-content-center`}>
                <p className='m-0'>{choice}</p>
                </div>
            </div>
        );  
    }


    return (
        <>
            <div>
                <div>
                    <h3>{questionTitle}</h3>
                </div>
                <div className='row'>
                    {choiceList}
                </div>
            </div>
        </>
    );

}

export function EndGameGrid({playerData}) {
    var winnersList = [...playerData]
    winnersList.sort((a, b) => b.points - a.points);
    const playerCardList = playerData.map((player) => 
        <div className='d-flex flex-column justify-content-center m-2 rounded border col' key={player.name}>
            <div>
                <h3 className="my-2" >{player.name}</h3>
            </div>
            <div >
                <p className='mb-2 fs-5'>{player.points} pts</p>
            </div>
        </div>
    );  

    return (
        <>
            <div>
                <div>
                    <div className='row'>{playerCardList}</div>
                </div>
            </div>
        </>
    );
}