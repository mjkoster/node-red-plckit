module.exports = function(RED) {

  function StateNode(config) {        
    RED.nodes.createNode(this,config);

    var node = this;
    
    node.name = config.name;
    node.isinitialstate = config.isinitialstate;
    node.outputlist = config.outputlist
    node.transitionlist = config.transitionlist

    var outputs = {};
    node.outputlist.forEach( function(output) {
      outputs[output.name] = output.value;
    });

    var transitions = {};
    node.transitionlist.forEach( function(transition) {
      transitions[transition.condition] = transition.state;
    });

    RED.log.debug("Node Init");
    RED.log.debug(outputs);
    RED.log.debug(transitions);

    node.context().set('isCurrentState', ( node.isinitialstate ? true : false) );

    if (node.isinitialstate) {
      setTimeout( function() {
        var msg = {};
        msg['topic'] = 'init';
        msg.payload = outputs;
        node.send(msg);
      }, 100 );
    }

    node.on('input', function(msg) {
      var condition = msg.payload;
      if(msg.topic == 'condition' && node.context().get('isCurrentState') && condition in transitions) {
        msg.topic = 'transition';
        msg.payload = transitions[condition];
        node.send(msg);
      }
      if(msg.topic == 'transition' &&  msg.payload == node.name) {
        node.context().set('isCurrentState',true);
        msg.topic = 'output';
        msg.payload = outputs;
        node.send(msg);
      }
    });
  }
  RED.nodes.registerType("state",StateNode);
}
