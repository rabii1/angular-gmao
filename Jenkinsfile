pipeline {
  agent any
 
  tools {nodejs "node"}
   environment {
        npm_config_cache = 'npm-cache'
        HOME = '.'
    }
  stages {
     stage ('checkout'){
      steps{
        checkout scm
      }
    }
    stage('install module') {
      steps {
         
        sh 'npm install'
      }
    }
      stage ('build') {
      steps{
        sh '$(npm bin)/ng build --prod --build-optimizer'
      }
    }
  }
}
