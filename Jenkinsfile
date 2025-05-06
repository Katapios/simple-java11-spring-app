pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/Katapios/simple-java11-spring-app.git'
            }
        }

        stage('Install frontend dependencies') {
            steps {
                dir('frontend') {
                    sh 'npm ci'
                }
            }
        }

        stage('Build frontend') {
            steps {
                dir('frontend') {
                    sh 'npm run build'
                }
            }
        }

        stage('Copy frontend to Spring Boot static') {
            steps {
                sh 'rm -rf src/main/resources/static/* || true'
                sh 'mkdir -p src/main/resources/static'
                sh 'cp -r frontend/dist/* src/main/resources/static/'
            }
        }

        stage('Build backend') {
            steps {
                sh 'mvn clean package -DskipTests'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t myapp:latest .'
            }
        }

        stage('Deploy') {
            steps {
                sh 'docker-compose down || true'
                sh 'docker-compose up -d --build'
            }
        }
    }
}
