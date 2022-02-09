pipeline {
  agent any
 
  tools {nodejs "node"}
 
  stages {
    stage('Example') {
      steps {
        sh 'sudo chown -R 1000150000:0 "/.npm" '
        sh 'npm install -g @angular/cli'
        sh 'npm config ls'
      }
    }
  }
}
