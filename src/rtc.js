/*
 * WebRTC用 javascriptソース
 * ペアリングを行う
 */

var rtc_manager = function() {

	var APIKEY = "e60d120e-13a7-4050-b6d2-94616fece3d6";
	var DEBUG_MODE = 0;

	var peer = null;
	var myid = null; // 自身のPeerID
	var hostPeerId = null; // hostのPeerID
	var receive_action = null; //func
    var connect_action = null;
	var my_connections = [];

	var close_callback;// コネクションのcloseイベントが発火した時に実行する処理

	var connect = function(c) {
		cc.log("peer.on('connection') called." + c.peer);
		c.on('data', receive);
		c.on('close', function(){
			cc.log("[Close]:プレイヤーが退出しました。ゲームを修了します。");
			close_callback();
		});
		c.on('error', function(e){
			cc.log("[Error]:" + e);
			cc.log("エラーが発生しました。ゲームを修了します。");
		});
        c.on('open', function(){
            if( connect_action ){
                connect_action();
            }
        });

		// 自身に接続されたDataConnectionオブジェクトを保持
		my_connections.push(c);
	}

	var receive = function(data) {
		cc.log('Received: ' + data.msg);

		if(myid === data.id) { // 自分から遅れらてきたデータは捨てる
			return;
		}
        /*
		if(hostPeerId == null) { // hostユーザはデータを受け取ったらみんなに送信する
			send_to_all(data.msg);
		}
        */
		if(receive_action != null) {
			receive_action(this.peer, data.msg);
		}
	}

	var send_to_all = function(msg) {
		for(var i = 0; i < my_connections.length; i++){
			my_connections[i].send({msg:msg, id:myid});
		}
	}

	return {
		// 最初に呼ぶ
		init : function(_open_callback, _close_callback) {
			peer = new Peer({key : APIKEY, debug : DEBUG_MODE});
			peer.on('open', function(id) {
				myid = id;
				console.log('My peer ID is: ' + myid);
				_open_callback(id);
			});
			peer.on('connection', function(c){
                connect(c);
            } );
			close_callback = _close_callback;
		},

		// 最初に接続するときに呼ぶ
		connecting : function(to, _open_callback) {
			cc.log("connect to " + to);
			hostPeerId = to;
			var conn = peer.connect(to, { reliable : false } );
			conn.on('open', function(){
				cc.log("conn.on('data') called.");
				connect(conn);
				_open_callback();
			});
		},

		send : function(msg) {
			if(hostPeerId == null) {
				// cc.log(msg + "(host)");
				send_to_all(msg);
			}else {
				// cc.log(msg + "(servant)");
				peer.connections[hostPeerId][0].send({msg:msg, id:myid});
			}
		},

		close : function() {
			if (!!peer && !peer.destroyed) {
				peer.destroy();
			}
		},

		getmyid : function() {
			return myid;
		},

		setReceiveAction : function(_func) {
			// _funcが関数かどうか判定
			// if(){return;}
			receive_action = _func;
		},
        
        setConnectAction : function(_func) {
            // _funcが関数かどうか判定
			// if(){return;}
			connect_action = _func;
        }
	}
}();

var open_callback_handler = function(peer_id) {
    cc.log("open_callback_handler");
}

var close_callback_handler = function(){
	cc.log("close_callback_handler");
}