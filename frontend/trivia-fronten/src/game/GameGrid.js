import { useState } from 'react';


export function LobbyGrid({playerData, roomData}) {
    const playerCardList = playerData.map((player) => 
        
        <div className={`d-flex justify-content-center m-2 rounded border col-sm-2 ${player.is_host ? "bg-admin" : null}`} key={player.name}>
            <div>
                <h3 className='my-2'>{player.name}</h3>
            </div>
            <div>
                <p></p>
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

export function GameGrid({questionTitle, questionChoices, sendWebsocket}) {
    console.log(questionTitle, questionChoices);
    const choiceList = questionChoices.map((choice) => 
        <div className='col' key={choice}> 
            <button onClick={() => sendWebsocket({"type": "answer", "data": choice})}>{choice}</button>
        </div>
    );

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