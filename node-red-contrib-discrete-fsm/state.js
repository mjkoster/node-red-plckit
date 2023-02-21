module.exports = function(RED) {

  function StateNode(config) {        
    RED.nodes.createNode(this,config);

    var node = this;
    
    node.name = config.name;
    node.isinitialstate = config.isinitialstate;
    node.outputvector = config.outputvector;
    node.transitions = config.transitions;
    node.context().set('isCurrentState', node.isinitialstate?true:false);

    node.on('input', function(msg) {
      var condition = msg.payload;
      if(msg.topic == 'condition' && node.context().get(isCurrentState) && condition in node.transitions) {
        msg.topic = 'transition';
        msg.payload = node.transitions[condition];
        node.send(msg);
      }
      if(msg.topic == 'transition' &&  msg.payload == node.name) {
        node.context().set('isCurrentState',true);
        msg.topic = 'output';
        msg.payload = node.outputvector;
        node.send(msg);
      }
    });
  }
  RED.nodes.registerType("state",StateNode);
}
