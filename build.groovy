@Library('global@master') _

node() {

    dir(env.BUILD_ID) {
        checkout scm: [$class: 'GitSCM', userRemoteConfigs: [[credentialsId: 'GIT_CRED', url: env.gitlabSourceRepoHttpUrl]], branches: [[name: env.gitlabSourceBranch]]]

        def serviceName = "${env.gitlabSourceRepoName}"

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
        }

        stage("build artifact") {
            dockerRun image: 'nexus.corp.bankbtpn.co.id:50001/openshift/nodejs-22:10.1-1767601359', \
                cmd: 'sh -c "npm ci --registry https://nexus.corp.bankbtpn.co.id/repository/npm-public && npm run lint && npm run test:coverage && npm run build"'
        }

        stage("scanning component") {
            dockerRun image: 'nexus.corp.bankbtpn.co.id:50001/openshift/sonar-runner:8.0.1', 
                        env: 'SONAR_SCANNER_OPTS="-Dsonar.scanner.truststorePassword=changeit -Xmx8192m"',
                        cmd: 'sonar-scanner'
        }

        stage("build image") {
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
            ocpDeploy session: "${namespace}-ekyc-web-${BUILD_NUMBER}", namespace: namespace, serviceName: serviceName, ocpUrl: ocpUrl, ocpCredential: ocpCredential, dockerRegistry: dockerRegistry, image: "${dockerNexus}/${nsService}:${version}", template: "deploy/template.yml", variable: "deploy/dev.env", parameters: "domain=${domain} namespace=${namespace} version=${version} replica=${replica}"
        }
    }
}
