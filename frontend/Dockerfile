# Usa a imagem oficial do Node.js na versão 18
FROM node:18

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências do Node.js
RUN npm install

# Copia todo o restante dos arquivos do projeto
COPY . .

# Expõe a porta 3000 para acesso externo
EXPOSE 3000

# Executa o comando para iniciar a aplicação
CMD ["npm", "start"]