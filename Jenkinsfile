pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'springhello-app'
        DOCKER_TAG = 'latest'
        CONTAINER_NAME = 'springhello-container'
        NETWORK_NAME = 'javadock-java11-mvn_katapios'  // 👈 вот это ключевое

    }

    stages {
        stage('Clone') {
            steps {
                git branch: 'main', url: 'https://github.com/Katapios/simple-java11-spring-app'
            }
        }

        stage('Build Maven Project') {
            steps {
                sh 'mvn clean package -DskipTests'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${DOCKER_IMAGE}:${DOCKER_TAG}")
                }
            }
        }

//         stage('Ensure Docker Network Exists') {
//             steps {
//                 sh '''
//                     echo "📡 Проверка существования сети katapios..."
//                     docker network inspect katapios >/dev/null 2>&1 || docker network create katapios
//                 '''
//             }
//         }

        stage('Wait for PostgreSQL') {
            steps {
                sh '''
                    echo "⏳ Ожидаем PostgreSQL в postgres_container..."
                    for i in {1..30}; do
                      if docker exec postgres_container pg_isready -U postgres > /dev/null 2>&1; then
                        echo "✅ PostgreSQL готов"
                        break
                      else
                        echo "🔁 Ожидание PostgreSQL... ($i)"
                        sleep 2
                      fi
                    done
                '''
            }
        }

        stage('Run Docker Container') {
            steps {
                sh '''
                    echo "🧹 Удаление предыдущего контейнера, если он есть..."
                    docker rm -f $CONTAINER_NAME || true

                    echo "🚀 Запуск springhello-app в сети katapios..."
                    docker run -d \
                      --name $CONTAINER_NAME \
                      --network=$NETWORK_NAME \
                      -p 8081:8081 \
                      -e MYAPP_JDBC_URL=jdbc:postgresql://postgres_container:5432/springmvc \
                      -e MYAPP_JDBC_USER=postgres \
                      -e MYAPP_JDBC_PASS=postgres \
                      -e SPRING_JPA_PROPERTIES_HIBERNATE_DIALECT=org.hibernate.dialect.PostgreSQLDialect \
                      $DOCKER_IMAGE:$DOCKER_TAG
                '''
            }
        }
    }

    post {
        always {
            echo '✅ Pipeline finished.'
        }
    }
}
