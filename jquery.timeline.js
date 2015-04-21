(function(){
  // Main Proccess
  function main() {
    $.extend({ Timeline: Timeline });
  }

  var Timeline = function() {
    this.tasks = [];
    this.state = 'waiting';
    this.$nodes = {};
    this.$target = null;
    this.process = function(){
      var d = new $.Deferred;
      d.resolve();
      return d.promise();
    };
  };
  // Base
  Timeline.prototype.run = function(fn){
    var _this = this;
    var task;
    var process = _this.process();
    _this.state = 'running';
    // callback
    if (typeof fn == 'function') { _this.call(fn); }
    // task runner
    for (var i=0; i<_this.tasks.length; i++) {
      task = _this.tasks[i];
      if(task.type in _this.methods) {
        process = _this.methods[task.type](_this, process, task);
      }
    };
    return this;
  };
  Timeline.prototype.createTask = function(type, params, opt) {
    return {
      type: type,
      params: params,
      opt: opt
    }
  }
  // Task set
  Timeline.prototype.bind = function(target){
    if ( !(target in this.$nodes) ) { this.$nodes[target] = $(target); }
    var task = this.createTask('get', this.$nodes[target], null);
    this.tasks.push(task);
    return this;
  };
  Timeline.prototype.set = function(params){
    var task = this.createTask('css', params, null);
    this.tasks.push(task);
    return this;
  };
  Timeline.prototype.to = function(params, opt){
    var task = this.createTask('animate', params, opt);
    this.tasks.push(task);
    return this;
  };
  Timeline.prototype.wait = function(delay){
    var task = this.createTask('delay', delay, null);
    this.tasks.push(task);
    return this;
  };
  Timeline.prototype.remove = function(){
    var task = this.createTask('remove', null, null);
    this.tasks.push(task);
    return this;
  };
  Timeline.prototype.call = function(fn, opt){
    if (typeof opt == 'undefined') { var opt = {} }
    var task = this.createTask('callFunction', fn, opt);
    this.tasks.push(task);
    return this;
  };
  Timeline.prototype.destroy = function(){
    for(key in this.$nodes) {
      this.$nodes[key].stop();
    }
    this.tasks = [];
    this.state = 'terminating';
  };
  Timeline.prototype.include = function(tl, opt){
    if (typeof opt == 'undefined') { var opt = {} }
    var fn = function(done) { tl.run(done); }
    var task = this.createTask('callFunction', fn, opt);
    this.tasks.push(task);
    return this;
  };
  Timeline.prototype.done = function(d){
    if(this.state == 'terminating') {
      this.state == 'terminated'
      return d.reject();
    } else {
      return d.resolve();
    }
  };
  // Task process
  Timeline.prototype.methods = {
    get: function(_this, process, task){
      return process.then(function() {
        var d = new $.Deferred;
        _this.$target = task.params;
        _this.done(d);
        return d.promise();
      });
    },
    css: function(_this, process, task){
      return process.then(function() {
        var d = new $.Deferred;
        _this.$target.stop().css(task.params);
        _this.done(d);
        return d.promise();
      });
    },
    animate: function(_this, process, task){
      return process.then(function() {
        var d = new $.Deferred;
        task.opt.async = task.opt.async ? task.opt.async : false;
        if (task.opt.async){
          _this.done(d);
        } else {
          task.opt.complete = function(){ _this.done(d); };
        }
        _this.$target.stop().animate(task.params, task.opt);
        return d.promise();
      });
    },
    delay: function(_this, process, task){
      return process.then(function() {
        var d = new $.Deferred;
        setTimeout(function(){
          _this.done(d);
        }, task.params);
        return d.promise();
      });
    },
    callFunction: function(_this, process, task){
      return process.then(function() {
        var d = new $.Deferred;
        task.opt.async = task.opt.async ? task.opt.async : false;
        if(task.opt.async) { task.params( function() {} ); _this.done(d); }
        else { task.params( function(){ _this.done(d); } ); }
        return d.promise();
      });
    },
    remove: function(_this, process, task){
      return process.then(function() {
        var d = new $.Deferred;
        _this.$target.remove();
        _this.done(d);
        return d.promise();
      });
    }
  };

  $(main);
}).call(this);