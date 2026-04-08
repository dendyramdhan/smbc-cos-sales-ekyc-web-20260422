FROM nexus.corp.bankbtpn.co.id:50001/openshift/nginx.rhel7.2

LABEL maintainer="btpn-devops"
RUN mkdir -p /var/www/html/dist
ADD application.tar.gz /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/
ADD start.sh /usr/local/bin/
RUN ["chmod", "+x", "/usr/local/bin/start.sh"]
RUN ["chmod", "777", "/var/www/html/dist"]
RUN ["chmod", "777", "/var/www/html"]
EXPOSE 8080
ENTRYPOINT ["/usr/local/bin/start.sh"]