/*
 * WebRTC用 javascriptソース
 * ペアリングを行う
 */

var rtc_manager = function () {

  var APIKEY = "e60d120e-13a7-4050-b6d2-94616fece3d6";
  var DEBUG_MODE = 0;

  var peer = null;
  var myid = null; // 自身のPeerID
  var hostPeerId = null; // hostのPeerID
  var receive_action = null; //func
  var connect_action = null;
  var my_connections = [];
  var my_call = null;
  var client_no = 0;
  var receive_call_num = 0;
  var start_flag = false;
  var client1_pid = null;

  var close_callback;// コネクションのcloseイベントが発火した時に実行する処理

  var connect = function (c) {
    cc.log("peer.on('connection') called." + c.peer);
    c.on('data', receive);
    c.on('close', function () {
      cc.log("[Close]:プレイヤーが退出しました。ゲームを修了します。");
      close_callback();
    });
    c.on('error', function (e) {
      cc.log("[Error]:" + e);
      cc.log("エラーが発生しました。ゲームを修了します。");
    });
    c.on('open', function () {
      // 自身に接続されたDataConnectionオブジェクトを保持
      my_connections.push(c);
      console.log("connection open");
      if (connect_action) {
        connect_action();
      }
      // 最大ユーザ数に達した場合，ホストは最後に接続した端末へビデオ通話するように制御メッセージを送る
      console.log(loggerLikeMessage('rtc.js connect()', 'DEBUG: max user reached. number=', my_connections.length));
      if(my_connections.length === MAX_USERS && !hostPeerId ) {
      
        my_connections[MAX_USERS-1].send({
          msg : my_connections[MAX_USERS-2].peer,
          id : myid,
          type : 'forceCall'
        });

        my_connections.forEach(function(client, index, array) {
          console.log(loggerLikeMessage('rtc.js connect()', 'DEBUG: client user', client.peer));
        });

        start_flag = true;
      }
    });


  }

  var receive = function (data) {
    //cc.log('Received: ' + data.msg);

    if (myid === data.id) { // 自分から遅れらてきたデータは捨てる
      return;
    }

    if(hostPeerId == null) { // hostユーザはデータを受け取ったらみんなに送信する
        send_to_all(data.msg);
    }

    console.log(loggerLikeMessage('rtc.js receive()', 'DEBUG: receive data=', data.msg, data.id, data.type));
    if(data.type === "forceCall") {
        client_no = 2;
        client1_pid = data.msg;
        return;
    }
    if(data.msg === "start") {
        start_flag = true;
        return;
    }
    if (receive_action != null) {
      receive_action(this.peer, data.msg);
    }
  }

  var send_to_all = function (msg) {
    for (var i = 0; i < my_connections.length; i++) {
      my_connections[i].send({ msg: msg, id: myid });
    }
  }

  return {
    // 最初に呼ぶ
    init: function (_open_callback, _close_callback) {
      peer = new Peer(getRandomInt(1, 1000), { key: APIKEY, debug: DEBUG_MODE });
      peer.on('open', function (id) {
        myid = id;
        console.log('My peer ID is: ' + myid);
        _open_callback(id);
      });
      peer.on('connection', function (c) {
        connect(c);
      });

      close_callback = _close_callback;
    },

    // 最初に接続するときに呼ぶ
    connecting: function (to, _open_callback) {
      cc.log("connect to " + to);
      hostPeerId = to;
      var conn = peer.connect(to, { reliable: false });
      conn.on('open', function () {
        cc.log("conn.on('data') called.");
        connect(conn);
        _open_callback();
      });
    },

    send: function (msg) {
      if (hostPeerId == null) {
        // cc.log(msg + "(host)");
        send_to_all(msg);
      } else {
        // cc.log(msg + "(servant)");
        peer.connections[hostPeerId][0].send({ msg: msg, id: myid });
      }
    },

    close: function () {
      if (!!peer && !peer.destroyed) {
        peer.destroy();
      }
    },

    getmyid: function () {
      return myid;
    },

    setReceiveAction: function (_func) {
      // _funcが関数かどうか判定
      // if(){return;}
      receive_action = _func;
    },

    setConnectAction: function (_func) {
      // _funcが関数かどうか判定
      // if(){return;}
      connect_action = _func;
    },

    receive_call: function (_mediaStream, _videos) { // peerのコネクションを作ったあとに呼ぶこと
      peer.on('call', function (call) {
        // Answer the call, providing our mediaStream
        call.answer(_mediaStream);
        console.log("answer");

        call.on('stream', function (stream) {
          // `stream` is the MediaStream of the remote peer.
          // Here you'd add it to an HTML video/canvas element.
          console.log("answer stream" + _videos[receive_call_num]);
          console.log("receive_call_num: " + receive_call_num);
          _videos[receive_call_num].src = URL.createObjectURL(stream);
          receive_call_num++;
        });
      });
    },

    call: function (_to, _mediaStream, _video) {
      console.log("rtc: call" + _to);
      my_call = peer.call(_to, _mediaStream);

      my_call.on('stream', function (stream) {
        // `stream` is the MediaStream of the remote peer.
        // Here you'd add it to an HTML video/canvas element.
        console.log("stream");
        _video.src = URL.createObjectURL(stream);
      });
    },

    get_connections: function () {
       return my_connections;
    },

    get_client_no: function() {
        return client_no;
    },

    get_start_flag: function() {
        return start_flag;
    },

    get_client1_pid: function() {
        return client1_pid;
    }
  }
} ();

var open_callback_handler = function (peer_id) {
  cc.log("open_callback_handler");
}

var close_callback_handler = function () {
  cc.log("close_callback_handler");
}