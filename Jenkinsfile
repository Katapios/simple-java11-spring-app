pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/Katapios/simple-java11-spring-app.git'
            }
        }

        stage('Build frontend') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Build backend') {
            steps {
                sh 'mvn clean package -DskipTests'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t simple-app .'
            }
        }

        stage('Deploy') {
            steps {
                // путь к проекту javadock-java11-mvn должен быть на Jenkins хосте
                sh '''
                    cd ../javadock-java11-mvn
                    docker-compose down
                    docker-compose up -d --build
                '''
            }
        }
    }
}
