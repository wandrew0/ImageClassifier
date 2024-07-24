FROM node:slim AS build
# RUN apt-get update && \
#     apt-get install -y vim
EXPOSE 3000
EXPOSE 3001
WORKDIR /usr/src/app
COPY package*.json .
RUN npm config rm proxy
RUN npm config rm https-proxy
RUN npm install
COPY . .
RUN npm run build
RUN npm uninstall onnxruntime-web
RUN npm prune
RUN sed -i "s/public/build/" ./api/models/quick_draw_model.js
RUN rm -r ./public
RUN rm -r ./src
RUN chmod u+x ./start.sh

FROM node:slim
WORKDIR /usr/src/app
COPY --from=build /usr/src/app .
CMD ["sh", "./start.sh"]
# CMD sh