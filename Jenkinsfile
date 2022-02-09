pipeline {
  agent any
 
  tools {nodejs "node"}
 
  stages {
    stage('Example') {
      steps {
         sh 'npm install -g @angular/cli'
        sh 'npm config ls'
      }
    }
  }
}
