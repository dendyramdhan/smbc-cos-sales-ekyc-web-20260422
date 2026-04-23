@Library('global@master') _

node (){
    deployDescription deployDesc: deployDesc
    dir (env.BUILD_ID){
        def serviceName = "ekyc-web"
        def nsService = "customer-administrative-platform/ekyc-web"
        def dockerRegistry = "default-route-openshift-image-registry.apps.ms.dev.corp.btpn.co.id"
        def dockerNexus = "nexus.corp.bankbtpn.co.id:50003"
        def domain = "apps.ms-bm.dev.corp.btpn.co.id"
        def ocpUrl = "https://api.ms-bm.dev.corp.btpn.co.id:6443"
        def namespace = "customer-administrative-platform-uat"
        def ocpCredential = "OBM_DEV"
        def replica = 1

        currentBuild.displayName = "#${BUILD_NUMBER}, ${version}"

        stage ("tag & push"){
            dockerPull image: "${dockerNexus}/${nsService}:${version}"
        }
        
        stage ("deploy"){
            checkout scm: [$class: 'GitSCM', userRemoteConfigs: [[credentialsId: 'GIT_CRED', url: "https://git.ecommchannels.com/Customer-Administrative-Platform/ekyc-web.git"]], branches: [[name: "refs/tags/${version}"]]]  
            ocpDeploy session: "${namespace}-ekyc-web-${BUILD_NUMBER}", namespace: namespace, serviceName: serviceName, ocpUrl: ocpUrl, ocpCredential: ocpCredential, dockerRegistry: dockerRegistry, image: "${dockerNexus}/${nsService}:${version}", template: "deploy/template.yml", variable: "deploy/uat.env", parameters: "domain=${domain} namespace=${namespace} version=${version} replica=${replica}"
        }
    }
}