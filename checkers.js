var Checkers = function(){

  // new checkers game
  this.newCheckers = function(){
    this.white = new Player('white');
    this.black = new Player('black');
    this.turn = this.white;
    this.board = new Board(this);
  };
};

var Board = function(game){

  // setting atual game
  this.game = game;
  this.turn = game.turn;

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

    // check move rules
    if(this.checkMove(e)){
      // move the piece
      this.movePiece(e);
    }
  }

  this.checkMove = function(e){

    // get move map
    this.moveMap();

    // set rows coords
    var startRow =  this.startRow;
    var endRow =  this.endRow;

    // invert white rows
    if(this.turn == game.white){
      startRow =  7 - this.startRow;
      endRow =  7 - this.endRow;
    }

    // check turn
    if(this.turn.color != this.currentPiece.color){
      return false;
    }

    // empty container
    if (this.endContainer.empty != 'true') {
      return false;
    };

    // diagonal moves
    if(this.rowsBetween.length != this.colsBetween.length){
      return false;
    };

    // move again if same piece
    if(this.again && this.again != this.currentPiece.id){
      return false;
    }

    // move again if capture
    if(this.again && this.piecesBetween.length != 1){
      return false
    }

    // piece moves
    if (this.currentPiece.king == "false") {

      // back moves if not move again
      if(startRow > endRow && !this.again){
        return false;
      }

      // back moves if not capture
      if(startRow > endRow && this.piecesBetween.length != 1) {
        return false
      };

      // only one container if not capture
      if(this.rowsBetween.length != 0 && this.piecesBetween.length != 1){
        return false;
      }

      // if capture only move two rows
      if(this.piecesBetween.length == 1 && this.rowsBetween.length != 1){
        return false;
      };

    };

    // king moves
    if(this.currentPiece.king == "true"){

      // over more than one piece
      if (this.piecesBetween.length > 1){
        return false;
      };

      // over same pieces
      if (this.blockPiecesBetween.length != 0){
        return false;
      };

    } 

    return true;

  }

  this.moveMap = function(){

    // rows and columns coords
    this.rowsBetween = [];
    this.colsBetween = [];

    if (this.startRow > this.endRow) { // bottom to top
      for (var i = this.startRow - 1; i > this.endRow; i-- ) {
        this.rowsBetween.push(i);
      };
    } else if (this.startRow < this.endRow) { // top to top
      for (var i = this.startRow + 1; i < this.endRow; i++ ) {
        this.rowsBetween.push(i);
      };
    };

    if (this.startCol < this.endCol) { // left to right
      for (var j = this.startCol + 1; j < this.endCol; j++) {
        this.colsBetween.push(j);
      };
    } else if(this.startCol > this.endCol){ // right to left
      for (var j = this.startCol - 1; j > this.endCol; j--) {
        this.colsBetween.push(j);
      };
    };

    // set pieces between
    this.piecesBetween = [];
    this.blockPiecesBetween = [];

    if (this.rowsBetween.length > 0) {


      for (var i = this.rowsBetween.length - 1; i >= 0; i--) {
        
        // set container bettwen
        var containerBetween = document.querySelector('div[row="' + this.rowsBetween[i] + '"][col="' + this.colsBetween[i] + '"]');
        
        if (containerBetween && containerBetween.firstChild) {
          
          // set piece between
          var pieceBetween = containerBetween.firstChild;
          var pieceBetweenColor = pieceBetween.getAttribute('color');
          
          // only if opposite color
          if (pieceBetweenColor != this.currentPiece.color){
            this.piecesBetween.push(pieceBetween)
          } else if (pieceBetweenColor == this.currentPiece.color) {
            this.blockPiecesBetween.push(pieceBetween);
          };

        };        

      };

    };

  };

  this.nextMoves = function(){

    // set pieces around
    this.piecesAround = [];

    if (this.rowsBetween.length > 0 &&
        this.piecesBetween.length == 1) {

      var rowsAround = [this.endRow - 1, this.endRow + 1];
      var colsAround = [this.endCol - 1, this.endCol + 1];

      for (var i = rowsAround.length - 1; i >= 0; i--) {
        for (var j = colsAround.length - 1; j >= 0; j--) {
          
          var cellAround = document.querySelector('div[row="' + rowsAround[i] + '"][col="' + colsAround[j] + '"]');

          if (cellAround && cellAround.firstChild){

            // set piece around
            var pieceAround = cellAround.firstChild;
            var piecesAroundColor = pieceAround.getAttribute('color');

            // only if opposite color
            if(piecesAroundColor != this.pieceColor &&
               this.piecesBetween.indexOf(pieceAround) < 0){
                // append piece around
                this.piecesAround.push(pieceAround);
            };

          };

        };
      };
    };

    // set empty containers for next moves
    this.containersAround = [];

    if (this.piecesAround.length > 0) {

      for (var i = this.piecesAround.length - 1; i >= 0; i--) {

        var pieceAroundRow = parseInt(this.piecesAround[i].parentNode.getAttribute('row'));
        var pieceAroundCol = parseInt(this.piecesAround[i].parentNode.getAttribute('col'));

        var rowsAround = [pieceAroundRow-1,pieceAroundRow+1];
        var colsAround = [pieceAroundCol-1,pieceAroundCol+1];
        
        for (var j = rowsAround.length - 1; j >= 0; j--) {
          for (var k = colsAround.length - 1; k >= 0; k--) {
            
            var containerAround = document.querySelector('div[row="' + rowsAround[j] + '"][col="' + colsAround[k] + '"]');
            if (containerAround &&
                containerAround.getAttribute('empty') == 'true' &&
                rowsAround[j] != this.endRow &&
                colsAround[k] != this.endCol) {
                  // append container around
                  this.containersAround.push(containerAround);
            };
    
          };
    
        };
    
      };
    
    };

  };

    // capture the piece
  this.capturePiece = function(){
    if (this.piecesBetween.length == 1) {
      this.removePiece(this.piecesBetween[0]);
    };
  }

  // remove the piece
  this.removePiece = function(e){
    e.parentNode.setAttribute('empty', true);
    e.remove();
  }

  // move the piece
  this.movePiece = function(e){

    var data = e.dataTransfer.getData("text/plain");

    if(e.target.id != data){

      this.pieceMoved = document.getElementById(data);
      e.target.appendChild(this.pieceMoved);
      e.target.setAttribute('empty', false);

      // empty parent container
      this.currentPiece.parent.setAttribute('empty', true);

      // capture piece
      this.capturePiece();

    };

    // get next moves
    this.nextMoves();

    if (this.containersAround.length == 0) {
      // change turn
      this.again = false
      this.turn = (this.turn == game.black) ? this.game.white : this.game.black;
    } else {
      // move again
      this.again = this.pieceMoved.getAttribute('id');
    }
    
    // set bottom and top king row
    this.kingRow = (this.currentPiece.color == 'white') ? 0 : 7;

    // turn king
    if (this.endRow == this.kingRow){
      this.turnKing(this.pieceMoved);
    };
    
  };

  this.turnKing = function(e){
    e.setAttribute('king', true);
    e.innerHTML = '=]';
  };

  function renderBoard(){

    // get body element
    var body = document.getElementsByTagName('body')[0];

    // create title
    var title = document.createElement('h1');
    title.innerHTML = 'checkers.js';
    
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
    body.insertBefore(title, body.firstChild);

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