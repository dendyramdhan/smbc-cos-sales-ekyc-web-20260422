@Library('global@master') _

node (){

    dir (env.BUILD_ID){
        checkout scm: [$class: 'GitSCM', userRemoteConfigs: [[credentialsId: 'GIT_CRED', url: env.gitlabSourceRepoHttpUrl]], branches: [[name: env.gitlabSourceBranch]]]
        
        def serviceName = "${env.gitlabSourceRepoName}"

        //get version from tag
        //def version = env.gitlabSourceBranch.replace("refs/tags/", "")

    	//get version from package.json
        def packageJson = readJSON file: 'package.json'
        def version = packageJson.version

        def dockerNexus = "nexus.corp.bankbtpn.co.id:50001"
        def dockerRegistry = "docker-registry-default.apps.dev.corp.btpn.co.id"
        def domain = "apps.dev.corp.btpn.co.id"
        def ocpUrl = "https://ocp.dev.corp.btpn.co.id:8443"
        def nsService = "Customer-Administrative-Platform/ekyc-web"
        def namespace = "customer-administrative-platform-dev"
        def nexusCred = "NEXUS_REGISTRY"
        def ocpCredential = "OCP_DEV"
        
        currentBuild.displayName = "#${BUILD_NUMBER}, ${version}"
    
        stage ("build artifact"){
            configFileProvider([configFile(fileId: 'vars', variable: 'vars'), configFile(fileId: 'npmrc', variable: 'npmrc')]){
                dockerRun image: 'nexus.corp.bankbtpn.co.id:50001/openshift/node', vars: "${vars}", cmd: 'npm install --registry http://nexus.corp.bankbtpn.co.id:8081/repository/npm-public'
                dockerRun image: 'nexus.corp.bankbtpn.co.id:50001/openshift/node', vars: "${vars}", cmd: 'npm run build'
                dockerRun image: 'nexus.corp.bankbtpn.co.id:50001/openshift/sonar-runner', vars: "${vars}", cmd:""
            }
        }
        
        stage ("build image"){
            dir ("build"){
				sh "tar -zcvf ../application.tar.gz *";
			}
            dockerBuild image: "${nsService}:${version}", workdir: pwd()
        }
    
        stage ("integration test"){                     
            /*     
            withEnv(["NPM_REGISTRY=https://nexus.devops.dev.corp.btpn.co.id/repository/npm-public/"]){
                compose file:"docker-compose.yml", test:"docker-compose.test.yml", testName:"test-client"
            }          
            */                
        }
        
       	stage ("tag & push"){
            dockerTag source: "${nsService}:${version}", to: "${dockerRegistry}/${namespace}/ekyc-web:${version}"
            dockerTag source: "${nsService}:${version}", to: "${dockerNexus}/${nsService}:${version}"
            dockerPush image: "${dockerNexus}/${nsService}:${version}", to: dockerNexus, credentialsId: nexusCred
        }
      
        stage ("deploy"){
            ocpDeploy session: "${namespace}-ekyc-web-${BUILD_NUMBER}", namespace: namespace, serviceName: serviceName, ocpUrl: ocpUrl, ocpCredential: ocpCredential, dockerRegistry: dockerRegistry, image: "${dockerRegistry}/${namespace}/ekyc-web:${version}", template: "deploy/template.yml", variable: "deploy/dev.env", parameters: "domain=apps.dev.corp.btpn.co.id namespace=${namespace} version=${version}"
        }              
    }
 }