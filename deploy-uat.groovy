@Library('global@master') _

node (){
    deployDescription deployDesc: deployDesc
    dir (env.BUILD_ID){
        def serviceName = "ekyc-web"
        def nsService = "Customer-Administrative-Platform/ekyc-web"
        def dockerRegistry = "docker-registry-default.apps.dev.corp.btpn.co.id"
        def dockerNexus = "nexus.corp.bankbtpn.co.id:50001"
        def domain = "apps.dev.corp.btpn.co.id"
        def ocpUrl = "https://ocp.dev.corp.btpn.co.id:8443"
        def namespace = "customer-administrative-platform-uat"
        def ocpCredential = "OCP_DEV"

        currentBuild.displayName = "#${BUILD_NUMBER}, ${version}"

        stage ("tag & push"){
            dockerPull image: "${dockerNexus}/${nsService}:${version}"
            dockerTag source: "${dockerNexus}/${nsService}:${version}", to: "${dockerRegistry}/${namespace}/ekyc-web:${version}"
        }
        
        stage ("deploy"){
            checkout scm: [$class: 'GitSCM', userRemoteConfigs: [[credentialsId: 'GIT_CRED', url: "https://git.ecommchannels.com/Customer-Administrative-Platform/ekyc-web.git"]], branches: [[name: "refs/tags/${version}"]]]  
            ocpDeploy session: "${namespace}-ekyc-web-${BUILD_NUMBER}", namespace: namespace, serviceName: serviceName, ocpUrl: ocpUrl, ocpCredential: ocpCredential, dockerRegistry: dockerRegistry, image: "${dockerRegistry}/${namespace}/ekyc-web:${version}", template: "deploy/template.yml", variable: "deploy/uat.env", parameters: "domain=apps.dev.corp.btpn.co.id namespace=${namespace} version=${version}"
        }
    }
}