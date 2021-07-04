var Generator = require('yeoman-generator');

module.exports = class extends Generator {
  // The name `constructor` is important here
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);
  }
  async prompting() {
    this.answers = await this.prompt([
      {
        type: "input",
        name: "name",
        message: "Your project name",
        default: this.appname // Default to current folder name
      }
    ])
    this.log("app name", this.answers.name);
  }

  async initPackages() {
    const pkgJson = {
      "name": this.answers.name,
      "version": "1.0.0",
      "description": "",
      "main": "generators/app/index.js",
      "scripts": {
        "build": "webpack",
        "test": "mocha --requrie @babel/register",
        "coverage": "nyc mocha --requrie @babel/register"
      },
      "author": "",
      "license": "ISC",
      "dependencies": {
        "yeoman-generator": "^4.11.0",
      },
    }
    // Extend or create package.json file in destination path
    this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
    this.npmInstall(["vue@next"], {"save-dev": false}); // 安装vue2会报错export 'openBlock' (imported as '_openBlock') was not found in 'vue'
    this.npmInstall([
      "webpack", 
      "webpack-cli", 
      "vue-loader",
      "vue-style-loader",
      "vue-template-compiler", 
      "@vue/compiler-sfc",
      "css-loader", 
      "copy-webpack-plugin",
      "@babel/core", 
      "@babel/preset-env", 
      "@babel/register", 
      "@istanbuljs/nyc-config-babel",
      "babel-loader", 
      "babel-plugin-istanbul", 
      "mocha", 
      "nyc"
    ],  
    {"save-dev": true})
  }
  
  copyFiles() {
    this.fs.copyTpl(
      this.templatePath('HelloVue.vue'),
      this.destinationPath('src/HelloVue.vue'),
      {}
    );
    this.fs.copyTpl(
      this.templatePath('main.js'),
      this.destinationPath('src/main.js'),
      {}
    );
    this.fs.copyTpl(
      this.templatePath('webpack.config.js'),
      this.destinationPath('webpack.config.js'),
      {}
    );
    this.fs.copyTpl(
      this.templatePath('index.html'),
      this.destinationPath('src/index.html'),
      {title: this.answers.name}
    );
    this.fs.copyTpl(
      this.templatePath('.babelrc'),
      this.destinationPath(".babelrc"),
      {}
    );
    this.fs.copyTpl(
      this.templatePath('.nycrc'),
      this.destinationPath(".nycrc"),
      {}
    );
    this.fs.copyTpl(
      this.templatePath('test.js'),
      this.destinationPath("test/test.js"),
      {}
    );
  }

};

