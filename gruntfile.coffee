module.exports = (grunt)->

  grunt.initConfig
    distRoot: 'pravo/'
    srcRoot: 'src/'

    jade:
      options:
        pretty: true
      files:
        expand: true
        flatten: false
        cwd: "<%= srcRoot %>jade"
        src: ["pravo.jade"]
        dest: "<%= distRoot %>html/"
        ext: ".html"

    stylus:
      options:
        "compress": false
        "resolve url": true
      files:
        expand: true
        flatten: false
        cwd: "<%= srcRoot %>stylus"
        src: ["pravo.styl"]
        dest: "<%= distRoot %>css/"
        ext: ".css"

    coffee:
      files:
        expand: true
        flatten: false
        cwd: "<%= srcRoot %>coffee"
        src: ["**/*.coffee"]
        dest: "<%= distRoot %>js/"
        ext: ".js"

    watch:
      grunt:
        files: ["grunt.coffee"]
        tasks: ["dev"]
      jade:
        files: ["<%= srcRoot %>jade/**/*.jade"]
        tasks: ["jade"]
      stylus:
        files: ["<%= srcRoot %>stylus/**/*.styl"]
        tasks: ["stylus"]
      coffee:
        files: ["<%= srcRoot %>coffee/**/*.coffee"]
        tasks: ["coffee"]

  grunt.loadNpmTasks 'grunt-contrib-jade'
  grunt.loadNpmTasks 'grunt-contrib-stylus'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-copy'
  grunt.loadNpmTasks 'grunt-contrib-clean'

  grunt.registerTask 'build',['jade','stylus','coffee']
  grunt.registerTask 'dev',['build','watch']
  grunt.registerTask 'default',['dev']
