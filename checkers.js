var Checkers = function(){

  // new checkers game
  this.newCheckers = function(){
    this.white = new Player('white');
    this.black = new Player('black');
    this.board = new Board(this);
  };
};

var Board = function(game){

  // setting atual game
  this.game = game;

  // render board on start
  renderBoard.apply(this);

  // event handler
  this.handleEvent = function(event){
    var el = event.target;
    
    switch (event.type) {
      case 'dragstart':
        this.dragPiece(event);
        break
      case 'dragover':
        event.preventDefault();
        break
      case 'drop':
        event.preventDefault();
        this.dropPiece(event);
        break  
    }
  }

  // drag piece
  this.dragPiece = function(e){
    this.setDragPiece(e);
  }

  // drop piece
  this.dropPiece = function(e){
    this.setDropPiece(e);
  }

  this.setDragPiece = function(e){

    // set data transfer
    e.dataTransfer.setData("text/plain", e.target.id);

    // set start coords
    this.startRow = parseInt(e.target.parentNode.getAttribute('row'));
    this.startCol = parseInt(e.target.parentNode.getAttribute('col'));
    
    // get current piece attributes
    this.currentPiece = {
      'parent': e.target.parentNode,
      'id': e.target.getAttribute('id'),
      'color': e.target.getAttribute('color'),
      'king': e.target.getAttribute('king')
    };
    
  }

  this.setDropPiece = function(e){
    
    // set end coords
    this.endRow = parseInt(e.target.getAttribute('row'));
    this.endCol = parseInt(e.target.getAttribute('col'));

    // get end container attributes
    this.endContainer = {
      'element': e.target,
      'empty': e.target.getAttribute('empty')
    }

    this.movePiece(e);
    
  }

  // move the piece
  this.movePiece = function(e){

    var data = e.dataTransfer.getData("text/plain");

    if(e.target.id != data){

      this.pieceMoved = document.getElementById(data);
      e.target.appendChild(this.pieceMoved);
      e.target.setAttribute('empty', false);

    };
    
  }

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

          // new piece
          piece = new Piece();
          var pieceId = 'piece-r'+i+'c'+j;
          var player;

          if (i < 3) {
            // render black pieces
            player = this.game.black;
            piece.render(pieceId, container, player.color, this);
          } else if (i > 4){
            // render black pieces
            player = this.game.white
            piece.render(pieceId, container, player.color, this);
          };
          
          boardCol.appendChild(container);
          
        };

        boardRow.appendChild(boardCol);

      };

      board.appendChild(boardRow);
    };

    body.insertBefore(board, body.firstChild);

  };

};

var Player = function(color){
  // set player color
  this.color = color;
};


var Piece = function(){

  // rende the piece
  this.render = function(id, parent, color, handler){
    
    // create piece element
    var piece = document.createElement('div');
    piece.className = 'piece ' + color;
    piece.setAttribute('id', id);
    piece.setAttribute('color', color);
    piece.setAttribute('king', false);
    piece.setAttribute('draggable', true);
    
    piece.addEventListener('dragstart', handler, false);
    piece.addEventListener('dragend', handler, false);
    
    parent.appendChild(piece);
    parent.setAttribute('empty', false);

  };

};

var checkers = new Checkers();
checkers.newCheckers();