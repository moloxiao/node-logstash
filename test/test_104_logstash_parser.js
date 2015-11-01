var vows = require('vows'),
  assert = require('assert'),
  logstash_config = require('logstash_config');

vows.describe('Logstash parser config').addBatch({
  'simple': {
    topic: function() {
      return logstash_config.parse('input {stdin {}}');
    },

    check: function(result) {
      assert.deepEqual(result, {input: [{stdin: {}}]});
    }
  },
  'simple with comment': {
    topic: function() {
      return logstash_config.parse('# this is a comment\ninput {stdin {}}');
    },

    check: function(result) {
      assert.deepEqual(result, {input: [{stdin: {}}]});
    }
  },
  'simple multi line': {
    topic: function() {
      return logstash_config.parse('input {\nstdin      {\n\n}}');
    },

    check: function(result) {
      assert.deepEqual(result, {input: [{stdin: {}}]});
    }
  },
  'simple multi line with comment': {
    topic: function() {
      return logstash_config.parse('# this is a comment\ninput { #this is a comment\nstdin {}}');
    },

    check: function(result) {
      assert.deepEqual(result, {input: [{stdin: {}}]});
    }
  },
  'two lines': {
    topic: function() {
      return logstash_config.parse('output {\nelasticsearch {}\nstdout {}\n}');
    },

    check: function(result) {
      assert.deepEqual(result, {output: [{elasticsearch: {}}, {stdout: {}}]});
    }
  },
  'input and output': {
    topic: function() {
      return logstash_config.parse('input {stdin {}}\noutput { stdout {}}');
    },

    check: function(result) {
      assert.deepEqual(result, {input: [{stdin: {}}], output: [{stdout: {}}]});
    }
  },
  'plugin config id value': {
    topic: function() {
      return logstash_config.parse('output {\nelasticsearch { host => localhost }\nstdout { }\n}');
    },

    check: function(result) {
      assert.deepEqual(result, {output: [{elasticsearch: {host: 'localhost'}}, {stdout: {}}]});
    }
  },
  'plugin config id string': {
    topic: function() {
      return logstash_config.parse('output {\nelasticsearch { host => "localhost" }\nstdout { }\n}');
    },

    check: function(result) {
      assert.deepEqual(result, {output: [{elasticsearch: {host: 'localhost'}}, {stdout: {}}]});
    }
  },
  'plugin config id number': {
    topic: function() {
      return logstash_config.parse('output {\nelasticsearch { host => 12 }\nstdout { host => 3.4 }\n}');
    },

    check: function(result) {
      assert.deepEqual(result, {output: [{elasticsearch: {host: 12}}, {stdout: { host: 3.4 }}]});
    }
  },
  'plugin config bool': {
    topic: function() {
      return logstash_config.parse('output {\nelasticsearch { host => true }\nstdout { host => false}\n}');
    },

    check: function(result) {
      assert.deepEqual(result, {output: [{elasticsearch: {host: true}}, {stdout: {host: false}}]});
    }
  },
  'plugin config array': {
    topic: function() {
      return logstash_config.parse('output {\nelasticsearch { match => [ "timestamp" , "dd/MMM/yyyy:HH:mm:ss Z" ] }\nstdout {}\n}');
    },

    check: function(result) {
      assert.deepEqual(result, {output: [{elasticsearch: {match: ['timestamp', 'dd/MMM/yyyy:HH:mm:ss Z' ]}}, {stdout: {}}]});
    }
  },
  'plugin multiple params, same line': {
    topic: function() {
      return logstash_config.parse('output {\nelasticsearch { host => localhost, port => 354 }\nstdout {}\n}');
    },

    check: function(result) {
      assert.deepEqual(result, {output: [{elasticsearch: {host: 'localhost', port: 354}}, {stdout: {}}]});
    }
  },
  'plugin multiple params, multi lines': {
    topic: function() {
      return logstash_config.parse('output {\nelasticsearch { host => localhost\nport => 354 }\nstdout {}\n}');
    },

    check: function(result) {
      assert.deepEqual(result, {output: [{elasticsearch: {host: 'localhost', port: 354}}, {stdout: {}}]});
    }
  },
}).export(module);