'use strict';

var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var npm = require('npm');

var NodeCoffeeGenerator = module.exports = function NodeCoffeeGenerator(args, options) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
    this.installDependencies({
      bower: false,
      skipInstall: options['skip-install']
    });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};
util.inherits(NodeCoffeeGenerator, yeoman.generators.NamedBase);

NodeCoffeeGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  console.log(
    this.yeoman +
    '\nThe name of your project shouldn\'t contain "node" or "js" or' +
    ' "coffee" and' +
    '\nshould be a unique ID not already in use at search.npmjs.org.');

  npm.load(function(err, npm){
    var prompts = [{
      name: 'name',
      message: 'Module Name',
      default: path.basename(process.cwd())
    }, {
      name: 'description',
      message: 'Description',
      default: 'The best module ever.'
    }, {
      name: 'homepage',
      message: 'Homepage'
    }, {
      name: 'license',
      message: 'License',
      default: 'MIT'
    }, {
      name: 'githubUsername',
      message: 'GitHub username',
      default: npm.config.get('username')
    }, {
      name: 'authorName',
      message: 'Author\'s Name',
      default: npm.config.get('init.author.name')
    }, {
      name: 'authorEmail',
      message: 'Author\'s Email',
      default: npm.config.get('init.author.email')
    }, {
      name: 'authorUrl',
      message: 'Author\'s Homepage',
      default: npm.config.get('init.author.url')
    }];

    this.currentYear = (new Date()).getFullYear();

    this.prompt(prompts, function (props) {
      this.slugname = this._.slugify(props.name);

      this.repoUrl = 'https://github.com/' + props.githubUsername + '/' + this.slugname;

      if (!props.homepage) {
        props.homepage = this.repoUrl;
      }

      this.props = props;

      cb();
    }.bind(this));
  }.bind(this));
};

NodeCoffeeGenerator.prototype.lib = function lib() {
  this.mkdir('src/lib');
  this.template('src/lib/name.coffee',
                'src/lib/' + this.slugname + '.coffee');
};

NodeCoffeeGenerator.prototype.test = function test() {
  this.mkdir('src/test');
  this.template('src/test/name_test.coffee',
                'src/test/' + this.slugname + '_test.coffee');
  this.template('src/test/name_spec.coffee',
                'src/test/' + this.slugname + '_spec.coffee');
};

NodeCoffeeGenerator.prototype.projectfiles = function projectfiles() {
  this.copy('npmignore', '.npmignore');
  this.copy('gitignore', '.gitignore');
  this.copy('travis.yml', '.travis.yml');

  this.template('README.md');
  this.template('Gruntfile.coffee');
  this.template('_package.json', 'package.json');
};

