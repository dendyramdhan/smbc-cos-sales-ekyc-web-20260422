@Library('global@master') _

node (){
    deployDescription deployDesc: deployDesc
    dir (env.BUILD_ID){
        def serviceName = "ekyc-web"
        def nsService = "Customer-Administrative-Platform/ekyc-web"
        def dockerRegistry = "docker-registry-default.ms.corp.bankbtpn.co.id"
        def dockerNexus = "nexus.corp.bankbtpn.co.id:50001"
        def domain = "ms.corp.bankbtpn.co.id"
        def ocpUrl = "https://ocp.corp.bankbtpn.co.id:8443"
        def namespace = "customer-administrative-platform"
        def ocpCredential = "OCP_NEW_PROD"

        currentBuild.displayName = "#${BUILD_NUMBER}, ${version}"

        stage ("tag & push"){
            dockerPull image: "${dockerNexus}/${nsService}:${version}"
            dockerTag source: "${dockerNexus}/${nsService}:${version}", to: "${dockerRegistry}/${namespace}/ekyc-web:${version}"
        }
        
        stage ("deploy"){
            checkout scm: [$class: 'GitSCM', userRemoteConfigs: [[credentialsId: 'GIT_CRED', url: "https://git.ecommchannels.com/Customer-Administrative-Platform/ekyc-web.git"]], branches: [[name: "refs/tags/${version}"]]]  
            ocpDeploy session: "${namespace}-ekyc-web-${BUILD_NUMBER}", namespace: namespace, serviceName: serviceName, ocpUrl: ocpUrl, ocpCredential: ocpCredential, dockerRegistry: dockerRegistry, image: "${dockerRegistry}/${namespace}/ekyc-web:${version}", template: "deploy/template.yml", variable: "deploy/prod.env", parameters: "domain=ms.corp.bankbtpn.co.id namespace=${namespace} version=${version}"
        }
    }
}