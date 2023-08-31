function PushAudioNode(context, start_callback, end_callback, buffer_size) {
  this.context = context;
  this.start_callback = start_callback;
  this.end_callback = end_callback;
  this.buffer_size = buffer_size || 4096;
  this.samples_queue = [];
  this.scriptNode = context.createScriptProcessor(this.buffer_size, 1, 1);
  this.connected = false;
  this.sinks = [];
  this.startTime = 0;
  this.closed = false;
  this.track_callbacks = new Map();
}

PushAudioNode.prototype.push = function (chunk) {
  if (this.closed) {
    throw "Cannot push more chunks after node was closed";
  }
  this.samples_queue.push(chunk);
  if (!this.connected) {
    if (!this.sinks.length) {
      throw "No destination set for PushAudioNode";
    }
    this._do_connect();
  }
};

PushAudioNode.prototype.close = function () {
  this.closed = true;
};

PushAudioNode.prototype.connect = function (dest) {
  this.sinks.push(dest);
  if (this.samples_queue.length) {
    this._do_connect();
  }
};

PushAudioNode.prototype._do_connect = function () {
  if (this.connected) return;
  this.connected = true;
  for (var dest of this.sinks) {
    this.scriptNode.connect(dest);
  }
  this.scriptNode.onaudioprocess = this.handleEvent.bind(this);
};

PushAudioNode.prototype.disconnect = function () {
  this.scriptNode.onaudioprocess = null;
  this.scriptNode.disconnect();
  this.connected = false;
};

PushAudioNode.prototype.addTrackCallback = function (aTimestamp, aCallback) {
  var callbacks = this.track_callbacks.get(aTimestamp) || [];
  callbacks.push(aCallback);
  this.track_callbacks.set(aTimestamp, callbacks);
};

PushAudioNode.prototype.handleEvent = function (evt) {
  if (!this.startTime) {
    this.startTime = evt.playbackTime;
    if (this.start_callback) {
      this.start_callback();
    }
  }

  var currentTime = evt.playbackTime - this.startTime;
  var playbackDuration = this.scriptNode.bufferSize / this.context.sampleRate;
  for (var entry of this.track_callbacks) {
    var timestamp = entry[0];
    var callbacks = entry[1];
    if (timestamp < currentTime) {
      this.track_callbacks.delete(timestamp);
    } else if (timestamp < currentTime + playbackDuration) {
      for (var cb of callbacks) {
        cb();
      }
      this.track_callbacks.delete(timestamp);
    }
  }

  var offset = 0;
  while (this.samples_queue.length && offset < evt.target.bufferSize) {
    var chunk = this.samples_queue[0];
    var to_copy = chunk.subarray(0, evt.target.bufferSize - offset);
    if (evt.outputBuffer.copyToChannel) {
      evt.outputBuffer.copyToChannel(to_copy, 0, offset);
    } else {
      evt.outputBuffer.getChannelData(0).set(to_copy, offset);
    }
    offset += to_copy.length;
    chunk = chunk.subarray(to_copy.length);
    if (chunk.length) this.samples_queue[0] = chunk;
    else this.samples_queue.shift();
  }

  if (!this.samples_queue.length && this.closed) {
    if (this.end_callback) {
      this.end_callback(evt.playbackTime - this.startTime);
    }
    this.disconnect();
  }
};

var ctx = new (window.AudioContext || window.webkitAudioContext)();
var tts;
var pusher;
var pusher_buffer_size = 4096;

// Function to get query parameters
function getQueryParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// Initialize eSpeakNG
tts = new eSpeakNG("js/espeakng.worker.js", function () {
  var text = decodeURIComponent(getQueryParam("text"));
  var rate = getQueryParam("rate") || 175;
  var pitch = getQueryParam("pitch") || 50;
  var voice = getQueryParam("voice") || "en";

  tts.set_rate(parseInt(rate));
  tts.set_pitch(parseInt(pitch));
  tts.set_voice(voice);

  pusher = new PushAudioNode(
    ctx,
    function () {
      /* start callback */
    },
    function () {
      /* end callback */
    },
    pusher_buffer_size
  );
  pusher.connect(ctx.destination);

  if (text) {
    tts.synthesize(text, function (samples, events) {
      if (!samples) {
        if (pusher) {
          pusher.close();
        }
        return;
      }
      if (pusher) {
        pusher.push(new Float32Array(samples));
      }
    });
  }
});
