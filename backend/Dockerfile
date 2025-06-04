# Usa a imagem oficial do Node.js na versão 18
FROM node:18

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências do Node.js e Instala wait-for-it (simples utilitário em bash)
RUN npm install && apt-get update && apt-get install -y netcat-openbsd

# Copia todo o restante dos arquivos do projeto
COPY . .

# Expõe a porta 5000 para acesso externo
EXPOSE 5000

# Executa o comando para iniciar a aplicação
CMD ["npm", "start"]