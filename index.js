"use strict";
class Player {
    constructor(name, id = Date.now() * Math.random(), point = 0) {
        this.name = name;
        this.id = id;
        this.point = point;
    }
}
class PlayerManager {
    constructor() {
        var _a;
        this.players = [];
        let playersLocal = JSON.parse((_a = (localStorage.getItem("players"))) !== null && _a !== void 0 ? _a : "[]");
        let playersTemp = [];
        for (let i in playersLocal) {
            playersTemp.push(new Player(playersLocal[i].name, playersLocal[i].id, playersLocal[i].point));
        }
        this.players = playersTemp;
        this.render();
        this.caculateTotalPoints();
        this.caculateTotalPlayers();
    }
    createPlayer(newPlayer) {
        this.players.push(newPlayer);
        localStorage.setItem("players", JSON.stringify(this.players));
        this.render();
        this.caculateTotalPlayers();
    }
    deletePlayer(id) {
        this.players = this.players.filter(player => player.id != id);
        localStorage.setItem("players", JSON.stringify(this.players));
        this.render();
        this.caculateTotalPlayers();
        this.caculateTotalPoints();
    }
    increasePoint(id) {
        this.players = this.players.map((player) => {
            if (player.id === id) {
                player.point += 1;
            }
            return player;
        });
        localStorage.setItem("players", JSON.stringify(this.players));
        this.caculateTotalPoints();
        this.render();
    }
    decreasePoint(id) {
        this.players = this.players.map((player) => {
            if (player.id === id) {
                if (player.point > 0) {
                    player.point -= 1;
                }
            }
            return player;
        });
        localStorage.setItem("players", JSON.stringify(this.players));
        this.caculateTotalPoints();
        this.render();
    }
    caculateTotalPoints() {
        const totalPointsElement = document.getElementById("total-points");
        let totalPoints = this.players.reduce((total, player) => {
            return total + player.point;
        }, 0);
        totalPointsElement.innerText = totalPoints.toString();
        return totalPoints;
    }
    caculateTotalPlayers() {
        const totalPlayersElement = document.getElementById("total-players");
        totalPlayersElement.innerHTML = this.players.length.toString();
    }
    findMaxPointPlayers() {
        let maxPointPlayers = [];
        let maxPoint = 0;
        for (const player of this.players) {
            if (player.point > maxPoint) {
                maxPoint = player.point;
                maxPointPlayers = [player.id];
            }
            else if (player.point === maxPoint) {
                maxPointPlayers.push(player.id);
            }
        }
        return maxPointPlayers;
    }
    render() {
        const maxPointPlayerIds = this.findMaxPointPlayers();
        let renderEl = document.getElementById("list-players");
        let playerString = ``;
        this.players.length > 0 ? this.players.map((player, index) => {
            const isMaxPointPlayer = maxPointPlayerIds.includes(player.id);
            playerString += `
                <div class="player">
                    <div class="player-left">
                        <div class="icon">
                            <button class="delete-btn">
                                <span class="material-symbols-outlined delete-btn" onclick="handleDeletePlayer(${player.id})">
                                    close
                                </span>
                            </button>
                            <span class="fa-regular fa-chess-queen ${isMaxPointPlayer ? "crown" : ''}"></span>
                        </div>
                        
                        <p class="name">${player.name}</p>
                    </div>
                    
                    <div class="point">
                        <button class="decrease-btn">
                            <span class="material-symbols-outlined" onclick="handleDecreasePoint(${player.id})">
                                remove
                            </span>
                        </button>
                        
                        ${player.point}
                        <button class="increase-btn">
                            <span class="material-symbols-outlined" onclick="handleIncreasePoint(${player.id})">
                                add
                            </span>
                        </button>
                    </div>
                </div>
            `;
        }) : playerString += `<div class="no-player">No Player</div>`;
        renderEl.innerHTML = playerString;
    }
}
const players = new PlayerManager();
function addNewPlayer() {
    if (document.getElementById("player").value != "") {
        let playerValue = document.getElementById("player").value;
        let newPlayer = new Player(playerValue);
        players.createPlayer(newPlayer);
        document.getElementById("player").value = "";
    }
    else {
        alert("Please enter player name!");
    }
}
function handleDeletePlayer(id) {
    if (confirm("Do you want to delete player?")) {
        players.deletePlayer(id);
    }
}
function handleIncreasePoint(id) {
    players.increasePoint(id);
}
function handleDecreasePoint(id) {
    players.decreasePoint(id);
}
