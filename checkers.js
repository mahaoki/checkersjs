var Checkers = function(){

  // new checkers game
  this.newCheckers = function(){
    this.board = new Board(this);
  };
};

var Board = function(game){

  // setting atual game
  this.game = game;

  // render board on start
  renderBoard.apply(this);

  function renderBoard(){

    // get body element
    var body = document.getElementsByTagName('body')[0];

    // create table element for board
    var board = document.createElement('table');

    for (var i = 0; i < 8; i++) {
       
      // create board rows
      var boardRow = document.createElement('tr');

      for (var j = 0; j < 8; j++){

        // create board columns
        var boardCol = document.createElement('td');

        if (i%2 == j%2) {          
          
          // create containers 
          var container = document.createElement('div');
          
          container.className = 'container';
          container.setAttribute('row', i);
          container.setAttribute('col', j);
          container.setAttribute('empty', true);
          container.addEventListener('dragover', this, false);
          container.addEventListener('drop', this, false);
          
          boardCol.appendChild(container);
          
        };

        boardRow.appendChild(boardCol);

      };

      board.appendChild(boardRow);
    };

    body.insertBefore(board, body.firstChild);

  };

};

var checkers = new Checkers();
checkers.newCheckers();