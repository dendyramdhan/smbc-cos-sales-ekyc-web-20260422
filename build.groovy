@Library('global@master') _

node() {

    dir(env.BUILD_ID) {
        checkout scm: [$class: 'GitSCM', userRemoteConfigs: [[credentialsId: 'GIT_CRED', url: env.gitlabSourceRepoHttpUrl]], branches: [[name: env.gitlabSourceBranch]]]

        def serviceName = "${env.gitlabSourceRepoName}"

        //get version from tag
        def version = env.gitlabSourceBranch.replace("refs/tags/", "")

        def dockerNexus = "nexus.corp.bankbtpn.co.id:50003"
        def dockerRegistry = "default-route-openshift-image-registry.apps.ms.dev.corp.btpn.co.id"
        def domain = "apps.ms-bm.dev.corp.btpn.co.id"
        def ocpUrl = "https://api.ms-bm.dev.corp.btpn.co.id:6443"
        def nsService = "customer-administrative-platform/ekyc-web"
        def namespace = "customer-administrative-platform-dev"
        def nexusCred = "NEXUS_REGISTRY"
        def ocpCredential = "OBM_DEV"
        def replica = 1

        currentBuild.displayName = "#${BUILD_NUMBER}, ${version}"

        stage("build version") {
            sh "sed \"s/0.0.0/${version}/g\" package.json > package-temp.json && rm package.json && mv package-temp.json package.json";
//            sh "sed \"s/0.0.0/${version}/g\" nginx.conf > nginx-temp.conf && rm nginx.conf && mv nginx-temp.conf nginx.conf";
        }

        stage("build artifact") {
                dockerRun image: 'nexus.corp.bankbtpn.co.id:50001/openshift/ubi8-nodejs:18.20.4', cmd: 'npm install --unsafe-perm --registry https://nexus.corp.bankbtpn.co.id/repository/npm-public'
                dockerRun image: 'nexus.corp.bankbtpn.co.id:50001/openshift/ubi8-nodejs:18.20.4', cmd: 'npm run lint'

                dockerRun image: 'nexus.corp.bankbtpn.co.id:50001/openshift/ubi8-nodejs:18.20.4', cmd: 'npm run build'
        }

        stage("build image") {
//            dir("build") {
//                sh "tar -zcvf ../application.tar.gz *";
//            }
            dockerBuild image: "${nsService}:${version}", workdir: pwd()
        }

        stage("integration test") {
            /*
            withEnv(["NPM_REGISTRY=https://nexus.devops.dev.corp.btpn.co.id/repository/npm-public/"]){
                compose file:"docker-compose.yml", test:"docker-compose.test.yml", testName:"test-client"
            }
            */
        }

        stage("tag & push") {
            dockerTag source: "${nsService}:${version}", to: "${dockerNexus}/${nsService}:${version}"
            dockerPush image: "${dockerNexus}/${nsService}:${version}", to: dockerNexus, credentialsId: nexusCred
        }

        stage("deploy") {
            ocpDeploy session: "${namespace}-vcs-web-app-int-${BUILD_NUMBER}", namespace: namespace, serviceName: serviceName, ocpUrl: ocpUrl, ocpCredential: ocpCredential, dockerRegistry: dockerRegistry, image: "${dockerNexus}/${nsService}:${version}", template: "deploy/template.yml", variable: "deploy/dev.env", parameters: "domain=${domain} namespace=${namespace} version=${version} replica=${replica}"
//            osmDeployObm namespace: namespace, serviceName: serviceName, ocpUrl: ocpUrl, ocpCredential: ocpCredential, dockerRegistry: dockerRegistry, image:"${dockerNexus}/${nsService}:${version}", deployment: "deploy/deployment.yaml", route: "deploy/route.yaml", parameters: "namespace=${namespace} appname=${serviceName} version=${version} route=${route} replica=${replica}"
        }
    }
}
