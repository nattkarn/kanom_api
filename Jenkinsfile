import jenkins.model.Jenkins
pipeline {
    agent any

    environment {
        
        // Target URL: 
        registryTarget = '${regitryTarget}'


        gitUrl = "${url}/${repo}.git"

        softwareName = "${repo}"

        sonarUrl = ""
        sonarProject = ""
        sonarSoftware = ""
        sonarToken = ""


        credentialsId = 'githubPassword'
        DOCKERHUB_CREDENTIALS = credentials('gitLabToken')
        LINE_NOTIFY_TOKEN = credentials('lineNotifyToken')  // Line Notify Token

    }

    stages {
        stage('clone repository') {
            steps {
                withCredentials([gitUsernamePassword(credentialsId: credentialsId, gitToolName: 'git-tool')]) {
                    checkout scmGit(
                        branches: [[name: "${branch}"]],
                        userRemoteConfigs: [[credentialsId: credentialsId, url: gitUrl]])
                    sh "git config --global credential.helper store"
                    sh "git config --global user.name 'nattkarn'"
                }
            }
        }
        // stage('Run Unit Test'){
        //     steps {
        //         script {
        //             echo "Perform Unit Test"
        //         }
        //     }
        // }
        // stage('SonarQube Analysis'){
        //     steps {
        //     withSonarQubeEnv('SonarQuebe') { 
                
        //         sh "${scannerHome}/bin/sonar-scanner \
        //             -Dsonar.host.url=${sonarUrl} \
        //             -Dsonar.projectKey=${sonarProject}-${sonarSoftware} \
        //             -Dsonar.sources=./src \
        //             -Dsonar.login= \
        //             -Dsonar.password= \
        //             -Dsonar.token= \
        //             -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info \ # coverage path
        //             -Dsonar.projectVersion=${Version}" 
        //         }
        //     }
        // }


        //Uncomment
        stage('Build Image'){
            steps {
                script {
                    sh "docker build --no-cache -f Dockerfile -t ${registryTarget}:${version} ."
                }
            }
        }
        stage('Push Image to Registry'){
            steps{
                script {
                    echo 'Gitlab'
                    echo 'gitlabCredential'
                    sh '''
                            docker login registry.gitlab.com -u $DOCKERHUB_CREDENTIALS_USR -p $DOCKERHUB_CREDENTIALS_PSW
                        '''
                    sh "docker push ${registryTarget}:${version}"
                }
            }
        }

        
        stage('Clean up') {
            steps {
                sh 'docker image prune -a -f'
            }
        }



        stage('Run') {
            steps{
                // sh 'kubectl --kubeconfig=./ apply pod.yaml'
                sh 'docker-compose down && docker-compose up -d'
            }
        }
    }

    post{
        success{
            sendLineNotification("succeed")
        }
        failure{
            sendLineNotification("failed")
        }
  }
}

// Line Notification Function
def sendLineNotification(String message) {
    withCredentials([string(credentialsId: 'lineNotifyToken', variable: 'LINE_NOTIFY_TOKEN')]) {
        sh """
            curl -X POST https://notify-api.line.me/api/notify \
            -H "Authorization: Bearer ${LINE_NOTIFY_TOKEN}" \
            -F "message=${message}"
        """
    }
}