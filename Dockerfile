FROM nexus.corp.bankbtpn.co.id:50001/openshift/ubi8-nodejs:18.20.4
WORKDIR /app

ENV NODE_ENV production
RUN groupadd --system --gid 1002 nodejs
RUN useradd --system --uid 1002 nextjs
COPY public ./public
# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY .next/standalone .
COPY .next/static .next/static
RUN chown nextjs:nodejs /app/*
USER nextjs
EXPOSE 8080
ENV PORT 8080
CMD ["node", "server.js"]
