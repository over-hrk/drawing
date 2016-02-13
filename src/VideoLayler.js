var VideoLayer = cc.Layer.extend({
  sprite: null,
  /**
   * Constructor
   * Initialize mallet, and start listening touch event.
   */
  ctor: function () {
    this._super();
    var self = this;
    var intervalID = window.setInterval(function(){
        console.log("start flag is " + rtc_manager.get_start_flag());
        if(rtc_manager.get_start_flag()) {
           self.init();
           window.clearInterval(intervalID);
        }
    }, 1000);
  },

  init: function () {

    var video = new ccui.VideoPlayer("http://benchmark.cocos2d-x.org/cocosvideo.mp4");
    video.setContentSize(320, 240);
    video.setPosition(320 / 2, 240 / 2);
    video.setScale(0.5);
    window.video = video;
    this.addChild(video);
    video.play();

    var video2 = new ccui.VideoPlayer("http://benchmark.cocos2d-x.org/cocosvideo.mp4");
    video2.setContentSize(320, 240);
    video2.setPosition(320, 240 / 2);
    video2.setScale(0.5);
    window.video2 = video2;
    this.addChild(video2);
    video2.play();

    var video3 = new ccui.VideoPlayer("http://benchmark.cocos2d-x.org/cocosvideo.mp4");
    video3.setContentSize(320, 240);
    video3.setPosition(320 * 1.5, 240 / 2);
    video3.setScale(0.5);
    window.video3 = video3;
    this.addChild(video3);
    video3.play();

    var video_doms = document.querySelectorAll("video");
    for(var i=0; i<video_doms.length; i++) {
        video_doms[i].id = i+1;
    }

    navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia;

    navigator.getUserMedia(
      { video: {
          mandatory: {
            maxWidth:     320,
            maxHeight:    240,
            maxFrameRate: 10
          }
        }
      },
      function (stream) {
        if (mkmk.frameByFrameSyncManager.isHost) {
            video_doms[0].src = URL.createObjectURL(stream);
            rtc_manager.receive_call(stream, [video_doms[1], video_doms[2]]);
            rtc_manager.send("start");
        } else {
          var client_no = rtc_manager.get_client_no();
          if(client_no == 2) {
              rtc_manager.call(mkmk.frameByFrameSyncManager.hostPeerID, stream, video_doms[0]);
              rtc_manager.call(rtc_manager.get_client1_pid(), stream, video_doms[1]);
              video_doms[2].src = URL.createObjectURL(stream);
          }else {
              rtc_manager.call(mkmk.frameByFrameSyncManager.hostPeerID, stream, video_doms[0]);
              video_doms[1].src = URL.createObjectURL(stream);
              rtc_manager.receive_call(stream, [video_doms[2]]);
          }

          cc.log("call")
        }
      },
      function (error) {
        console.error(error);
      }
      );
  }
});