#FROM node:18
#RUN groupadd docker
#WORKDIR /app
#COPY --chown=docker:docker package*.json ./
#RUN npm install
#COPY --chown=app:node . .
#EXPOSE 3000
#CMD ["npm", "start"]

FROM node:18

# Criação de usuário e grupo
RUN groupadd -r appgroup && useradd -m -r -g appgroup appuser

# Definir o diretório de trabalho e copiar arquivos com o novo usuário
WORKDIR /app
COPY --chown=appuser:appgroup package*.json ./
RUN npm install
COPY --chown=appuser:appgroup . .

# Mudar para o usuário não-root
USER appuser

EXPOSE 5000
CMD ["npm", "start"]

