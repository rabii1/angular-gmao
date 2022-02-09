pipeline {
  agent any
 
  tools {nodejs "node"}
   environment {
        npm_config_cache = 'npm-cache'
        HOME = '.'
    }
  stages {
    stage('Example') {
      steps {
         
        sh 'npm config ls'
      }
    }
  }
}
