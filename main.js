document.addEventListener("DOMContentLoaded", function() { 
    const screenStartGame = document.querySelector('#startGame');
    const screenGame = document.querySelector('#game');
    const screenStopGame = document.querySelector('#stopGame'); 

    const inputName = document.querySelector('#name');
    const selecSize = document.querySelector('#size');

    const history = document.querySelector('#history');

    const top = document.querySelector('#top');

    const gameField = document.querySelector('.game-field');

    const buttonStartGame = document.querySelector('#startGame button');
    const buttonRestartGame = document.querySelector('#stopGame button');

    let time = document.querySelector('#timer');

    let result = 0;
    let timer;

    let nextNumber = 1;

    initialGame();

    buttonStartGame.addEventListener('click', function (event) {
        event.preventDefault();
        if (!inputName.value) {
            inputName.focus();
            return;
        }

        let body = {
            size: selecSize.value
        };
        
        fetch("https://example.shaklein.dev/game/get-field/", {
          method: "POST",
          body: JSON.stringify(body) 
        }).then(function (result) {
            return result.json();
        }).then(function (data) {
            drawGameField(data.field);
            startGame();
        });

    });

    function drawGameField(field) {
        gameField.innerHTML = "";
        gameField.className = "game-field game-field-" + selecSize.value;
        
        field.forEach(function (row) {
            row.forEach(function (cell) {
                let element = document.createElement('div');
                element.textContent = cell;
                element.classList.add('game-sell')
                gameField.append(element)
            })
        });
    }

    buttonRestartGame.addEventListener('click', function (event) {
        event.preventDefault();
        initialGame();
    });
    
    function initialGame() {


        screenStartGame.style.display = "flex";
        screenGame.style.display = "none";
        screenStopGame.style.display = "none";
        
        
        result = 0;

        nextNumber = 1;
    }

    function startGame() {
        screenGame.style.display = 'flex';
        screenStartGame.style.display = 'none';
        screenStopGame.style.display = 'none';
         let seconds = 0;
         let minutes = 0;
         
        timer = setInterval(function() {
            result++;
            
        }, 1000);

        loadHistory();
        loadTop();
    }

    function loadHistory() {
        fetch ('https://example.shaklein.dev/game/get-all-results/').then(function (result) {
            return result.json();
        }).then(function (data) {
            
            let html = "";
            data.results.reverse().forEach(function (game) {
                html += `
                <li class="list-group-item d-flex justify-content-between align-items-start">
                    <div class="ms-2 me-auto">
                        <div class="fw-bold">${game.name} (${game.size} x ${game.size}) </div>
                        ${game.datetime}
                    </div>
                    <span class="badge text-bg-primary rounded-pill">${game.result}</span>
                </li>`;
            })
            history.innerHTML = html;
        });
    }

    function loadTop() {
        fetch ('https://example.shaklein.dev/game/get-top-results/?size=' + selecSize.value).then(function (result) {
            return result.json();
        }).then(function (data) {
            
            let html = "";
            data.results.forEach(function (game) {
                html += `
                <li class="list-group-item d-flex justify-content-between align-items-start">
                    <div class="ms-2 me-auto">
                        <div class="fw-bold">${game.name} (${game.size} x ${game.size}) </div>
                        ${game.datetime}
                    </div>
                    <span class="badge text-bg-primary rounded-pill">${game.result}</span>
                </li>`;
            })
            top.innerHTML = html;
        });
    }

    function stopGame() {
        screenGame.style.display = 'none';
        screenStartGame.style.display = 'none';
        screenStopGame.style.display = 'flex';

        clearInterval(timer);
        document.querySelector('#result_name strong').textContent = inputName.value
        document.querySelector('#result_size strong').textContent = selecSize.value + " x " + selecSize.value
        document.querySelector('#result_time strong').textContent = result;
         
        sendResult();
    }

    function sendResult() {
        fetch("https://example.shaklein.dev/game/send-result/", {
            method: "POST",
            body: JSON.stringify({
                name: inputName.value,
                size: selecSize.value,
                result: result, 
            })
        }).then(function (result) {
            return result.json()
        }).then(function (data) {
            
        });     
    }


    gameField.addEventListener('click', function (event) {
        if (event.target.classList.contains("game-sell")) {
            if (event.target.textContent == nextNumber) {
                event.target.classList.add("game-sell-green");
                let incorrectSells = document.querySelectorAll(".game-sell-red");
                if (incorrectSells.length) {
                    incorrectSells.forEach(function (incorrectSell){
                        incorrectSell.classList.remove('game-sell-red');
                    });
                }
                
                if (nextNumber == selecSize.value**2) {
                    stopGame();
                } else {
                    nextNumber++
                } 
            } else {
                event.target.classList.add("game-sell-red");
            } 
        }
    })
}
);

